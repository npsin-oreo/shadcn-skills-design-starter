// Variant-level audit: enumerate every variant axis/value Figma defines per
// component, and cross-check it against the examples each component documents in
// `components/docs/registry.tsx`. Writes VARIANTS.md.
//
//   npm run audit:variants
//
// Adapted from plugin87/shadcn-skills-design-starter for this repo's registry
// (`components/docs/registry.tsx`, a `c("slug", …)` helper). Uses the cached
// /tmp/fig-components.json if present, else fetches.
//
// NOTE: this repo's Figma components are NOT published to a team library, so the
// `/v1/files/{key}/components` endpoint returns 0. We instead walk the document
// tree of each "Components"-section page and collect the variant COMPONENT nodes
// (named `prop=value, …`) directly — the same source `audit-components` uses.
//
// Token:    $FIGMA_PERSONAL_ACCESS_TOKEN or mcpServers.figma.env in ./.mcp.json
// File key: $FIGMA_FILE_KEY (defaults to the shared design file)

import { readFileSync, writeFileSync, existsSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
// This repo's Figma file is "@shadcn/ui Learning". Override with $FIGMA_FILE_KEY.
// (.mcp.json PAT currently 403s on the REST API — supply a fresh token to run.)
const FILE_KEY = process.env.FIGMA_FILE_KEY || "aZs8dlgg9wlcmEM0lFd3Zw"
const CACHE = "/tmp/fig-components.json"
const REGISTRY = "components/docs/registry.tsx"

function tokenValue() {
  if (process.env.FIGMA_PERSONAL_ACCESS_TOKEN) return process.env.FIGMA_PERSONAL_ACCESS_TOKEN.trim()
  return JSON.parse(readFileSync(join(root, ".mcp.json"), "utf8"))
    .mcpServers.figma.env.FIGMA_PERSONAL_ACCESS_TOKEN.trim()
}

// Find the pages under the file's "Components" section (mirrors audit-components).
async function componentPages(headers) {
  const res = await fetch(`https://api.figma.com/v1/files/${FILE_KEY}?depth=1`, { headers })
  if (!res.ok) throw new Error(`Figma HTTP ${res.status} — token may be expired or lack file access`)
  const doc = (await res.json()).document
  const pages = []
  let section = null
  for (const p of doc.children) {
    const raw = p.name.replace(/↳/g, "").trim()
    const isChild = p.name.includes("↳")
    if (raw === "" || /^-+$/.test(raw)) continue
    if (!isChild) { section = raw; continue }
    if (section === "Components") pages.push({ id: p.id, name: raw })
  }
  return pages
}

async function load() {
  if (existsSync(CACHE)) return JSON.parse(readFileSync(CACHE, "utf8"))
  let tok
  try { tok = tokenValue() } catch { tok = null }
  if (!tok) throw new Error("no Figma token (set $FIGMA_PERSONAL_ACCESS_TOKEN or .mcp.json)")
  const headers = { "X-Figma-Token": tok }

  const pages = await componentPages(headers)
  // Walk each Components page's node tree (batched) and collect every variant
  // COMPONENT (name contains `=`), tagging it with its page name so the grouping
  // below behaves exactly as it did against the published `/components` shape.
  const components = []
  const CHUNK = 8
  for (let i = 0; i < pages.length; i += CHUNK) {
    const batch = pages.slice(i, i + CHUNK)
    const ids = batch.map((p) => p.id).join(",")
    const res = await fetch(
      `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encodeURIComponent(ids)}`,
      { headers },
    )
    if (!res.ok) throw new Error(`Figma HTTP ${res.status} (nodes) — token may lack file access`)
    const j = await res.json()
    for (const p of batch) {
      const node = j.nodes[p.id]?.document
      if (!node) continue
      ;(function walk(n) {
        if (n.type === "COMPONENT" && n.name.includes("=")) {
          components.push({ name: n.name, containing_frame: { pageName: p.name } })
        }
        for (const c of n.children || []) walk(c)
      })(node)
    }
  }
  const data = { meta: { components } }
  writeFileSync(CACHE, JSON.stringify(data))
  return data
}

const OVERRIDES = {
  "aspect radio": "aspect-ratio",
  "contex menu": "context-menu",
  "input opt": "input-otp",
  seperator: "separator",
}
const slugify = (name) => {
  // strip ↳ tree markers and decoration emoji (e.g. the 🔵 "new" badge on some
  // Components pages) so the page name reduces to a clean shadcn slug.
  const n = name.replace(/↳/g, "").replace(/[^\x00-\x7F]/g, "").trim().toLowerCase()
  return OVERRIDES[n] || n.replace(/\s+/g, "-")
}

// pages that aren't UI components (icons / templates / blocks / demos)
const IGNORE = /lucide|tabler|home|templates?|blocks?|dashboard|tasks|playground|authentication|workshop|demo|welcome|cover|marketkit|datavi|monoline|finzo|momento|mayo|charts?|examples|featured|login|signup|otp$|live demo/i

let loaded
try {
  loaded = await load()
} catch (e) {
  // Variant coverage is purely Figma-driven — with no token there's nothing to
  // compute. Skip gracefully (don't overwrite an existing VARIANTS.md) so the
  // combined `npm run audit` still succeeds for the code-side checks.
  console.warn(`⚠️  audit:variants skipped — ${e.message}`)
  console.warn("   Supply a valid token, then re-run `npm run audit:variants` to regenerate VARIANTS.md.")
  process.exit(0)
}
const components = loaded.meta.components || []

// group variant components by their component page
const byComp = new Map()
for (const c of components) {
  const page = c.containing_frame?.pageName
  if (!page || IGNORE.test(page)) continue
  if (!c.name.includes("=")) continue // only variant instances
  const slug = slugify(page)
  if (!byComp.has(slug)) byComp.set(slug, { combos: 0, axes: new Map() })
  const g = byComp.get(slug)
  g.combos++
  for (const part of c.name.split(",")) {
    const [prop, ...rest] = part.split("=")
    if (!rest.length) continue
    const p = prop.trim()
    const v = rest.join("=").trim()
    if (!g.axes.has(p)) g.axes.set(p, new Set())
    g.axes.get(p).add(v)
  }
}

// values that are merely interaction states (covered by an interactive demo),
// not distinct *visual* variants that need their own example.
const STATE_VALUES = new Set([
  "default", "open", "closed", "close", "hover", "active", "focus", "focused",
  "loading", "disabled", "off", "on", "toggled", "checked", "unchecked",
  "button", "dialog", "drawer", "tooltip", "buttons", "question#1", "question#2",
  "question#3", "frame 6", "alert dialog",
])
const isStateAxis = (values) =>
  values.every((v) => STATE_VALUES.has(v.toLowerCase()))

// documented slugs — from the doc registry (minus non-component reference pages)
const NON_COMPONENT = new Set(["icons", "colors", "typography", "spacing", "radius"])
const registrySrc = readFileSync(join(root, REGISTRY), "utf8")
const documented = new Set(
  [...registrySrc.matchAll(/c\(\s*"([a-z0-9-]+)"|slug:\s*"([a-z0-9-]+)"/g)]
    .map((m) => m[1] || m[2])
    .filter((s) => !NON_COMPONENT.has(s)),
)

// ---- per-variant coverage: cross-check each Figma visual variant against the
// examples the component actually documents in the registry entry ----
// slice the registry into per-slug chunks (an entry begins at c("slug" or slug: "slug")
const anchors = [...registrySrc.matchAll(/c\(\s*"([a-z0-9-]+)"|slug:\s*"([a-z0-9-]+)"/g)]
  .map((m) => ({ slug: m[1] || m[2], index: m.index }))
  .sort((a, b) => a.index - b.index)
function registryText(slug) {
  const i = anchors.findIndex((a) => a.slug === slug)
  if (i === -1) return ""
  const end = i + 1 < anchors.length ? anchors[i + 1].index : registrySrc.length
  return registrySrc.slice(anchors[i].index, end).toLowerCase()
}

// values that aren't discrete visual examples a page must render on their own
const NON_VISUAL = new Set(["responsive", "link_component", "link component"])
// an example titled with one of these demonstrates the whole axis at once
const AXIS_SYNONYM = { type: ["variant", "type"], size: ["size"], color: ["color", "colour"] }
const sigTokens = (s) =>
  s.toLowerCase().replace(/[_-]+/g, " ").split(/\s+/).filter((t) => t.length >= 4)

// the nameable, visual values of an axis that the docs ought to show
function meaningfulValues(prop, values) {
  const isSize = /size/i.test(prop)
  return values.filter((v) => {
    const low = v.toLowerCase()
    if (STATE_VALUES.has(low)) return false // covered by the interactive demo
    if (NON_VISUAL.has(low)) return false // a behaviour, not a discrete visual
    if (/^property/i.test(prop)) return false // figma auto-named axis
    if (/^\d+$/.test(v) && !isSize) return false // bare-int placeholder variant (keep px sizes)
    return true
  })
}

// is a value demonstrated anywhere in the component's registry entry?
function valueShown(prop, value, text) {
  const full = value.toLowerCase().replace(/[_-]+/g, " ")
  if (text.includes(full)) return true // exact name in a title/description
  if ((AXIS_SYNONYM[prop.toLowerCase()] || []).some((s) => text.includes(s))) return true // axis-level example
  return sigTokens(value).some((t) => text.includes(t)) // distinctive token
}

const slugs = [...byComp.keys()].sort()
const rows = slugs.map((slug) => {
  const g = byComp.get(slug)
  const axes = [...g.axes.entries()].map(([p, vs]) => {
    const values = [...vs]
    return { prop: p, values, isState: isStateAxis(values) }
  })
  const variantAxes = axes.filter((a) => !a.isState)
  const doc = documented.has(slug)
  const text = doc ? registryText(slug) : ""
  const coverage = variantAxes
    .map((a) => {
      const needed = meaningfulValues(a.prop, a.values)
      return { prop: a.prop, needed, missing: needed.filter((v) => !valueShown(a.prop, v, text)) }
    })
    .filter((c) => c.needed.length)
  const missing = coverage.flatMap((c) => c.missing.map((v) => `${c.prop}=${v}`))
  const covered = doc && missing.length === 0
  return { slug, combos: g.combos, axes, variantAxes, doc, coverage, missing, covered }
})

const statusOf = (r) => (!r.doc ? "⛔" : r.covered ? "✅" : "🟡")

const lines = []
lines.push("# Variant Audit (Figma → docs)\n")
lines.push(`> Generated by \`scripts/audit-variants.mjs\` (\`npm run audit:variants\`). Figma file \`${FILE_KEY}\`.`)
lines.push("> Cross-checks every **visual variant** Figma defines against the examples each")
lines.push("> component documents in `components/docs/registry.tsx`. Interaction states")
lines.push("> (Default/Open/Hover), Figma auto-named placeholders (Property, bare `1`/`2`) and")
lines.push("> behaviours (Responsive, Link_component) are excluded — they don't need a discrete example.\n")
lines.push("| Component | Status | Visual variants needed | Missing examples |")
lines.push("| --- | :---: | --- | --- |")
for (const r of rows) {
  const needed = r.coverage
  const vis =
    needed.length === 0
      ? "—"
      : needed
          .map((c) => `**${c.prop}**: ${c.needed.slice(0, 9).join(" / ")}${c.needed.length > 9 ? " …" : ""}`)
          .join("<br>")
  const miss = !r.doc ? "—" : r.missing.length ? r.missing.join(", ") : "✅ all shown"
  lines.push(`| \`${r.slug}\` | ${statusOf(r)} | ${vis} | ${miss} |`)
}
lines.push(
  "\n**Legend** — ✅ documented with every visual variant shown · 🟡 documented but missing an example for a Figma variant · ⛔ not documented.\n",
)

const partial = rows.filter((r) => r.doc && !r.covered)
const undocumented = rows.filter((r) => !r.doc)
const covered = rows.filter((r) => r.covered)
lines.push(`## 🟡 Documented but missing a variant example (${partial.length})\n`)
lines.push(
  partial.length
    ? partial.map((r) => `- **${r.slug}** — missing ${r.missing.join(", ")}`).join("\n")
    : "none — every documented component shows all its Figma visual variants.",
)
lines.push("\n## ⛔ Not documented (Figma component sets)\n")
lines.push(undocumented.map((r) => `\`${r.slug}\``).join(", ") || "none")

writeFileSync(join(root, "VARIANTS.md"), lines.join("\n") + "\n")

const withVisual = rows.filter((r) => r.doc && r.coverage.length)
console.log(`✓ VARIANTS.md — ${rows.length} components analysed`)
console.log(
  `   ✅ fully covered: ${covered.filter((r) => r.coverage.length).length}/${withVisual.length} components with visual variants`,
)
console.log("\n🟡 Documented but missing a variant example:")
if (partial.length) {
  for (const r of partial) console.log(`  ${r.slug.padEnd(14)} missing ${r.missing.join(", ")}`)
} else {
  console.log("  none ✅")
}
console.log("\n⛔ Not documented:", undocumented.map((r) => r.slug).join(", ") || "none")
