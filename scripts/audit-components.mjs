// Audit the Figma component set against what's implemented + documented, and
// check the design-system rules (no hardcoded colors outside components/ui).
// Writes AUDIT.md.
//
//   npm run audit:components
//
// Adapted from plugin87/shadcn-skills-design-starter for this repo's structure:
// our doc registry is `components/docs/registry.tsx` (a `c("slug", …)` helper +
// object entries with `slug:`), not `lib/navigation.ts`.
//
// Token:    $FIGMA_PERSONAL_ACCESS_TOKEN or mcpServers.figma.env in ./.mcp.json
// File key: $FIGMA_FILE_KEY (defaults to the shared design file)

import { readFileSync, writeFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

const root = process.cwd()
// This repo's Figma file is "@shadcn/ui Learning" (71 component pages). Note:
// the OVERRIDES map + the `section === "Components"` page-grouping below were
// tuned for a sibling file — re-verify the page structure once a valid token is
// available (the .mcp.json PAT currently 403s on the REST API; needs a fresh one).
const FILE_KEY = process.env.FIGMA_FILE_KEY || "aZs8dlgg9wlcmEM0lFd3Zw"
const REGISTRY = "components/docs/registry.tsx"

function token() {
  if (process.env.FIGMA_PERSONAL_ACCESS_TOKEN) return process.env.FIGMA_PERSONAL_ACCESS_TOKEN.trim()
  try {
    return JSON.parse(readFileSync(join(root, ".mcp.json"), "utf8"))
      .mcpServers.figma.env.FIGMA_PERSONAL_ACCESS_TOKEN.trim()
  } catch {
    return null
  }
}

/* -------- normalise a Figma component name → canonical shadcn slug -------- */

const OVERRIDES = {
  "alert dialog": "alert-dialog",
  "aspect radio": "aspect-ratio", // Figma typo
  "button group": "button-group",
  "contex menu": "context-menu", // Figma typo
  "data table": "data-table",
  "date picker": "date-picker",
  "dropdown menu": "dropdown-menu",
  "hover card": "hover-card",
  "input opt": "input-otp", // Figma typo (OPT → OTP)
  "input group": "input-group",
  kpd: "kbd",
  "native select": "native-select",
  "navigation menu": "navigation-menu",
  "radio group": "radio-group",
  "scroll-area": "scroll-area",
  seperator: "separator", // Figma typo
  "toggle group": "toggle-group",
}

const slugify = (name) => {
  // strip ↳ tree markers and decoration emoji (e.g. the 🔵 "new" badge on some
  // Components pages) so the page name reduces to a clean shadcn slug.
  const n = name.replace(/↳/g, "").replace(/[^\x00-\x7F]/g, "").trim().toLowerCase()
  return OVERRIDES[n] || n.replace(/\s+/g, "-")
}

// Composed patterns (no single CLI primitive) and registry extras — so
// "primitive not in components/ui" is expected, not a defect.
const PATTERN = new Set(["combobox", "data-table", "date-picker"])
const SPECIAL = new Set(["chart", "sidebar"]) // chart=recharts, sidebar=app shell

/* ----------------------------------------------------------- gather data */

async function figmaComponents(tok) {
  const res = await fetch(
    `https://api.figma.com/v1/files/${FILE_KEY}?depth=1`,
    { headers: { "X-Figma-Token": tok } },
  )
  if (!res.ok) throw new Error(`Figma HTTP ${res.status}`)
  const doc = (await res.json()).document
  const out = []
  let section = null
  for (const page of doc.children) {
    const raw = page.name.replace(/↳/g, "").trim()
    const isChild = page.name.includes("↳")
    if (raw === "" || /^-+$/.test(raw)) continue
    if (!isChild) {
      section = raw
      continue
    }
    if (section === "Components") out.push(raw)
  }
  return out
}

function installedPrimitives() {
  return new Set(
    readdirSync(join(root, "components/ui"))
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => f.replace(".tsx", "")),
  )
}

// Documented = every component slug in the doc registry, minus the
// non-component reference pages (icons + the Design Tokens swatches).
const NON_COMPONENT = new Set(["icons", "colors", "typography", "spacing", "radius"])
function documentedSlugs() {
  const src = readFileSync(join(root, REGISTRY), "utf8")
  const all = [...src.matchAll(/c\(\s*"([a-z0-9-]+)"|slug:\s*"([a-z0-9-]+)"/g)].map((m) => m[1] || m[2])
  return new Set(all.filter((s) => !NON_COMPONENT.has(s)))
}

// MDX docs that exist 1:1 per component (stories/docs/*.mdx, bound via <Meta of>)
function mdxDocSlugs() {
  try {
    return new Set(
      readdirSync(join(root, "stories/docs"))
        .filter((f) => f.endsWith(".mdx"))
        .map((f) => f.replace(/\.mdx$/, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()),
    )
  } catch {
    return new Set()
  }
}

function hardcodedColorHits() {
  // Design-system rule #1 — no hardcoded colors outside components/ui.
  // Only .tsx/.ts is scanned, so token *.css (globals.css, tokens.generated.css) is exempt.
  const re = /(bg|text|border|ring|fill)-(white|black|zinc|gray|slate|neutral|blue|red|green|yellow|amber)-\d|#[0-9a-fA-F]{3,6}\b|bg-\[/
  const hits = []
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name)
      if (e.isDirectory()) {
        if (e.name === "ui") continue // primitives are vendored
        walk(p)
      } else if (/\.(tsx|ts)$/.test(e.name)) {
        readFileSync(p, "utf8").split("\n").forEach((line, i) => {
          if (
            re.test(line) &&
            !line.includes("github.com/shadcn.png") &&
            !/oklch/.test(line) &&
            !line.includes("ds-allow-hardcode") // sanctioned-exception marker
          ) {
            hits.push(`${p.replace(root + "/", "")}:${i + 1}`)
          }
        })
      }
    }
  }
  for (const d of ["app", "components", "lib"]) {
    try { walk(join(root, d)) } catch { /* skip */ }
  }
  return hits
}

/* ----------------------------------------------------------------- main */

const installed = installedPrimitives()
const documented = documentedSlugs()
const mdx = mdxDocSlugs()

// Try Figma; degrade to a local-only audit if the token/file is unavailable so
// the code-side checks (primitives × registry × MDX, hardcoded colors) still run.
const tok = token()
let figma = null
let figmaNote = ""
if (!tok) {
  figmaNote = "no Figma token (set $FIGMA_PERSONAL_ACCESS_TOKEN or .mcp.json)"
} else {
  try {
    figma = await figmaComponents(tok)
  } catch (e) {
    figmaNote = `Figma fetch failed (${e.message}) — token may be expired or lack file access`
  }
}

const statusFor = (slug) => {
  if (documented.has(slug)) {
    const parts = [installed.has(slug) ? "ui" : "composed", "registry"]
    if (mdx.has(slug)) parts.push("mdx")
    return { status: "✅ documented", note: parts.join(" + ") }
  }
  if (installed.has(slug)) return { status: "🟡 installed", note: "primitive present, no docs page" }
  if (PATTERN.has(slug)) return { status: "➖ pattern", note: "composed pattern (no single CLI primitive)" }
  if (SPECIAL.has(slug)) return { status: "➖ special", note: slug === "sidebar" ? "app shell" : "needs recharts" }
  return { status: "⛔ missing", note: "standard primitive, not implemented" }
}

// Figma mode: one row per Figma Components-page entry. Local mode: one row per
// documented registry slug (sorted) — no Figma cross-check.
const rows = (figma
  ? figma.map((name) => ({ name, slug: slugify(name) }))
  : [...documented].sort().map((slug) => ({ name: slug, slug }))
).map((r) => ({ ...r, ...statusFor(r.slug) }))

const tally = rows.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {})
const colorHits = hardcodedColorHits()

// documented slugs with no matching Figma component (extra coverage)
const figmaSlugs = new Set(rows.map((r) => r.slug))
const extraDocs = [...documented].filter((s) => !figmaSlugs.has(s))
// documented components missing their 1:1 MDX doc
const missingMdx = [...documented].filter((s) => !mdx.has(s))

const date = new Date().toISOString().slice(0, 10)
const mode = figma ? "Figma + code" : "local (code-only)"
const md = `# Component Audit

> Generated by \`scripts/audit-components.mjs\` (\`npm run audit:components\`) on ${date}.
> Mode: **${mode}**. ${figma
    ? `Source of truth: Figma file \`${FILE_KEY}\` (Components page).`
    : `⚠️ Figma cross-check skipped — ${figmaNote}. Run with a valid token to populate the Figma coverage matrix.`}
> Standards: the design-system rules in CLAUDE.md + \`.claude/skills/shadcn-ui-design/references/DESIGN.md\`.

## Summary

- **Figma components (Components page):** ${figma ? rows.length : "—  (Figma unavailable)"}
- **Installed primitives** (\`components/ui/*\`): ${installed.size}
- **Documented in registry** (\`components/docs/registry.tsx\`): ${documented.size}
- **Per-component MDX docs** (\`stories/docs/*.mdx\`): ${mdx.size}
- **Status tally:** ${Object.entries(tally).map(([k, v]) => `${k} ${v}`).join(" · ")}
- **Hardcoded-color violations** (rule #1, outside \`ui/\`): ${colorHits.length === 0 ? "0 ✅" : colorHits.length + " ⛔"}

## Coverage matrix

${figma ? "" : "_Local mode: one row per documented component (no Figma names/extras until a token is supplied)._\n"}
| ${figma ? "Figma component" : "Component"} | slug | status | notes |
| --- | --- | --- | --- |
${rows.map((r) => `| ${r.name} | \`${r.slug}\` | ${r.status} | ${r.note} |`).join("\n")}

## Gaps & buckets

**⛔ Missing standard primitives:** ${rows.filter((r) => r.status.startsWith("⛔")).map((r) => r.slug).join(", ") || "none 🎉"}

**➖ Composed patterns (built from existing primitives):** ${rows.filter((r) => r.note.includes("composed pattern")).map((r) => r.slug).join(", ") || "none"}

**Extra docs pages with no Figma component:** ${extraDocs.join(", ") || "none"}

**Documented components missing a 1:1 MDX doc:** ${missingMdx.join(", ") || "none 🎉"}

## Design-system compliance

- **Rule 1 — semantic tokens only:** ${colorHits.length === 0 ? "PASS — no hardcoded colors outside `components/ui` (token `*.css` is exempt; arbitrary values must carry a `ds-allow-hardcode` marker)." : "FAIL:\n" + colorHits.map((h) => `  - ${h}`).join("\n")}
- **Rule 2 — add via CLI:** primitives in \`components/ui\` come from \`npx shadcn add\`.
- **Rule 3 — don't fork ui:** edits to \`components/ui/*\` stay token-driven; any deviation should be commented.
- **Tokens:** the 3-tier DTCG sources in \`tokens/*.tokens.json\` compile to \`app/tokens.generated.css\`; component demos consume semantic tokens only.
`

writeFileSync(join(root, "AUDIT.md"), md)

console.log(`✓ AUDIT.md written (mode: ${mode})`)
if (!figma) console.log(`  ⚠️  ${figmaNote}`)
console.log(`  ${figma ? "figma: " + rows.length + " · " : ""}installed: ${installed.size} · documented: ${documented.size} · mdx: ${mdx.size}`)
console.log(`  tally: ${Object.entries(tally).map(([k, v]) => `${k}=${v}`).join("  ")}`)
console.log(`  hardcoded-color violations: ${colorHits.length}`)
if (extraDocs.length) console.log(`  extra docs (no figma match): ${extraDocs.join(", ")}`)
if (missingMdx.length) console.log(`  missing MDX: ${missingMdx.join(", ")}`)
