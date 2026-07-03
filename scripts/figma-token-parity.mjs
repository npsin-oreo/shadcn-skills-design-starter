#!/usr/bin/env node
// figma-token-parity — sweep every Figma "Components" page and check that the
// colours actually RENDERED there resolve to the semantic design tokens the app
// (and Storybook) ship in app/globals.css. One-way, read-only: it never writes
// to Figma. Writes docs/figma-token-parity.md.
//
// Usage:
//   node --env-file-if-exists=.env.local scripts/figma-token-parity.mjs
//   npm run figma:parity
//
// Token:    $FIGMA_PERSONAL_ACCESS_TOKEN (or .mcp.json mcpServers.figma.env)
// File key: $FIGMA_FILE_KEY (defaults to this repo's file)
//
// Unlike a raw node dump, this SKIPS nodes with visible:false (and their
// subtrees), so invisible instance-interior artefacts don't show up as false
// "drift" — only colours a viewer actually sees are counted.

import { readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
const FILE_KEY = process.env.FIGMA_FILE_KEY || "aZs8dlgg9wlcmEM0lFd3Zw"
const OUT = "docs/figma-token-parity.md"

function token() {
  if (process.env.FIGMA_PERSONAL_ACCESS_TOKEN) return process.env.FIGMA_PERSONAL_ACCESS_TOKEN.trim()
  try {
    return JSON.parse(readFileSync(join(root, ".mcp.json"), "utf8"))
      .mcpServers.figma.env.FIGMA_PERSONAL_ACCESS_TOKEN.trim()
  } catch { return null }
}
async function fig(path, tok) {
  const r = await fetch(`https://api.figma.com${path}`, { headers: { "X-Figma-Token": tok } })
  if (!r.ok) throw new Error(`HTTP ${r.status} on ${path} — ${(await r.text()).slice(0, 120)}`)
  return r.json()
}

/* ---- colour helpers + token matcher (sRGB → OKLab deltaE) ---- */
const hex2 = (v) => Math.round(v * 255).toString(16).padStart(2, "0")
const rgbaToHex = (c) => `#${hex2(c.r)}${hex2(c.g)}${hex2(c.b)}`
const srgbLin = (v) => { const c = v / 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 }
function hexToOklab(hex) {
  const h = hex.replace("#", "")
  const r = srgbLin(parseInt(h.slice(0, 2), 16)), g = srgbLin(parseInt(h.slice(2, 4), 16)), b = srgbLin(parseInt(h.slice(4, 6), 16))
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return { L: 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, a: 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, b: 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s }
}
const dE = (x, y) => Math.hypot(x.L - y.L, x.a - y.a, x.b - y.b)

function loadRefs() {
  const prim = [], sem = []
  try {
    const d = readFileSync(join(root, ".claude/skills/shadcn-ui-design/references/DESIGN.md"), "utf8")
    const a2 = d.indexOf("### A2"); const a3 = d.indexOf("### A3", a2)
    const sec = a2 !== -1 ? d.slice(a2, a3 === -1 ? undefined : a3) : ""
    for (const m of sec.matchAll(/`([a-z-]+)\/(\d+)`\s*\|\s*`(#[0-9a-fA-F]{6})`/g)) prim.push({ name: `${m[1]}/${m[2]}`, ...hexToOklab(m[3]) })
    for (const m of sec.matchAll(/`(white|black)`\s*\|\s*`(#[0-9a-fA-F]{6})`/g)) prim.push({ name: m[1], ...hexToOklab(m[2]) })
  } catch { /* no DESIGN.md */ }
  try {
    const css = readFileSync(join(root, "app/globals.css"), "utf8")
    // both modes — Storybook renders light + dark, so a colour matching either is in-system
    for (const [sel, mode] of [[":root", "light"], ["\\.dark", "dark"]]) {
      const body = css.match(new RegExp(`${sel}\\s*\\{([\\s\\S]*?)\\}`, "m"))?.[1] ?? ""
      for (const m of body.matchAll(/--([\w-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) sem.push({ name: `--${m[1]}`, mode, ...hexToOklab(m[2]) })
    }
  } catch { /* no globals.css */ }
  return { prim, sem }
}
function makeMatch({ prim, sem }) {
  const near = (lab, list) => list.reduce((b, r) => { const d = dE(lab, r); return !b || d < b.delta ? { name: r.name, mode: r.mode, delta: d } : b }, null)
  return (hex) => {
    const lab = hexToOklab(hex)
    const p = prim.length ? near(lab, prim) : null
    const s = sem.length ? near(lab, sem) : null
    const semantic = s && s.delta < 0.012 ? (s.mode === "dark" ? `${s.name} (dark)` : s.name) : null
    return { token: p?.name ?? null, delta: p ? +p.delta.toFixed(4) : null, semantic }
  }
}

/* ---- traversal: collect SOLID colours from VISIBLE nodes only ---- */
function collectVisible(node, out) {
  if (!node || node.visible === false) return
  for (const key of ["fills", "strokes"]) {
    const arr = node[key]
    if (!Array.isArray(arr)) continue
    for (const p of arr) if (p?.type === "SOLID" && p.visible !== false && p.color) {
      const hex = rgbaToHex(p.color); out.set(hex, (out.get(hex) || 0) + 1)
    }
  }
  if (Array.isArray(node.children)) for (const c of node.children) collectVisible(c, out)
}

async function main() {
  const tok = token()
  if (!tok) { console.error("✗ no Figma token (set $FIGMA_PERSONAL_ACCESS_TOKEN or .env.local)"); process.exit(1) }

  // 1) discover Components-section page canvases
  const doc = (await fig(`/v1/files/${FILE_KEY}?depth=1`, tok)).document
  let section = null; const pages = []
  for (const p of doc.children) {
    const raw = p.name.trim()
    if (!raw.startsWith("↳")) { section = raw; continue }
    if (section === "Components") pages.push(p.id)
  }
  // 2) deep-fetch all pages in one call, collect visible colours
  const data = await fig(`/v1/files/${FILE_KEY}/nodes?ids=${pages.join(",")}`, tok)
  const counts = new Map()
  for (const id of pages) {
    const d = data.nodes[id]?.document || data.nodes[id.replace("-", ":")]?.document
    if (d) collectVisible(d, counts)
  }
  // 3) match + aggregate
  const match = makeMatch(loadRefs())
  const DECORATIVE = new Set(["#ef4444", "#22c55e", "#3b82f6", "#eab308", "#f59e0b", "#a855f7", "#ec4899"])
  let total = 0, mapped = 0
  const byToken = new Map(); const drift = []
  for (const [hex, n] of counts) {
    total += n
    const m = match(hex)
    if (m.semantic) { mapped += n; if (!byToken.has(m.semantic)) byToken.set(m.semantic, []); byToken.get(m.semantic).push({ hex, n }) }
    else if (!DECORATIVE.has(hex.toLowerCase())) drift.push({ hex, n, token: m.token, delta: m.delta })
  }
  drift.sort((a, b) => b.n - a.n)

  // 4) write report
  const L = []
  L.push("# Figma ↔ Storybook Token Parity\n")
  L.push(`> Generated by \`scripts/figma-token-parity.mjs\` (\`npm run figma:parity\`). Figma file \`${FILE_KEY}\`.`)
  L.push("> Colours **rendered** on the Components pages, matched to the semantic tokens in")
  L.push("> `app/globals.css`. Invisible nodes are skipped, so this reflects what a viewer sees.\n")
  L.push(`- Component pages swept: **${pages.length}**`)
  L.push(`- Rendered colour instances: **${total}** · distinct hexes: **${counts.size}**`)
  L.push(`- Mapped to a semantic token: **${mapped}/${total} (${total ? (100 * mapped / total).toFixed(1) : 0}%)**`)
  L.push(`- Unmapped (non-decorative) drift: **${drift.reduce((s, d) => s + d.n, 0)}** across **${drift.length}** hexes\n`)
  L.push("## Semantic token → rendered Figma hex\n")
  L.push("| token | Figma hex (count) |")
  L.push("| --- | --- |")
  for (const [tk, hits] of [...byToken.entries()].sort()) {
    L.push(`| \`${tk}\` | ${hits.sort((a, b) => b.n - a.n).map((h) => `\`${h.hex}\`×${h.n}`).join(" ")} |`)
  }
  if (drift.length) {
    L.push("\n## Drift — rendered colours with no semantic token\n")
    L.push("| hex | count | nearest primitive |")
    L.push("| --- | --- | --- |")
    for (const d of drift.slice(0, 20)) L.push(`| \`${d.hex}\` | ${d.n} | ${d.token || "—"}${d.delta != null ? ` (Δ${d.delta})` : ""} |`)
  } else {
    L.push("\n## Drift\n\n✅ None — every rendered colour resolves to a semantic token.")
  }
  writeFileSync(join(root, OUT), L.join("\n") + "\n")
  console.log(`✓ ${OUT} — ${pages.length} pages · ${mapped}/${total} rendered instances mapped (${total ? (100 * mapped / total).toFixed(1) : 0}%) · ${drift.length} drift hexes`)
}
main().catch((e) => { console.error(`✗ ${e.message}`); process.exit(1) })
