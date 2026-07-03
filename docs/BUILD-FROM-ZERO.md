# Build This Repo From Zero — a teachable, step-by-step playbook

How to reconstruct **this** project (Next.js + Tailwind v4 + shadcn/ui driven by a Figma design
system) from an empty folder, using Claude Code. Each phase has a **goal**, a **copy-paste prompt**
to give Claude Code, what it **produces**, and a **gate** (how you know it's done before moving on).

> **Golden rule — order follows dependency, not enthusiasm.** Tokens before components. Components
> before docs. Docs before gates. Gates before Figma round-tripping. Don't skip ahead: every later
> phase assumes the earlier gate is green.

**Definition of done (the target):** 52 `components/ui/*`, 55 MDX docs + 55 manual stories (1:1),
4 `tokens/*.tokens.json` DTCG files → generated CSS, a neutral base (brand-ready) verified WCAG AA,
a Storybook explorer with an a11y gate, `npm run audit` (Figma↔code) + `npm run figma:parity`
tooling, and CI with 4 gates.

> **How to use this doc:** paste each phase's prompt into Claude Code **in order**. After each,
> check the **gate** before moving on. The consolidated [Master checklist](#master-checklist) at the
> end is your tick-list for a full run.

---

## Phase 0 — Foundations (set up BEFORE you prompt anything)

These are the inputs. Get them wrong and every later phase fights you.

1. **Toolchain:** Node ≥ 20.12 (for `--env-file-if-exists`), git, a GitHub repo, Claude Code.
2. **A Figma design file** with **Variables** (a shadcn/ui-style token set — collections
   `shadcn-ui` semantic + `tw-colors` primitives). This is the source of truth. Note its
   **file key** (from the URL `/design/:fileKey/…`).
3. **Figma access, two channels** — they are different and you need both:
   - **MCP (OAuth):** connect in Claude Code via `/mcp` → server `figma`. Must be a **Full/Dev
     seat on the team that owns the file** (per-team, not per-account). Confirm with `whoami`.
     This channel does screenshots + writes (Plugin API).
   - **REST PAT:** a Personal Access Token in **`.env.local`** (gitignored) as
     `FIGMA_PERSONAL_ACCESS_TOKEN=…` + `FIGMA_FILE_KEY=…`. Used by the audit/pull scripts. **The
     Variables REST API is Enterprise-only** — a Pro PAT reads component structure but not variable
     values; that's expected (variable values come via MCP or the committed export).
4. **Vendor the design skills into `.claude/skills/`:**
   - **`shadcn-ui-design`** — the *project* skill: the full token reference (`references/DESIGN.md`,
     ~1,804 tokens), component patterns (`references/components.md`), Next.js conventions, and the
     Figma `variables-export.json`. **This is the seed** — it teaches Claude the token names and the
     house rules. Everything downstream references it.
   - The **design kit** — `design-tokens`, `apply-aesthetic`, `design-component`, `design-code`,
     `design-qa`, `a11y-audit`, `governance`, `figma-integration`, `redesign`, `token-build`, …
     (the reusable UX/design-system skills). Vendor them once; they drive the token, aesthetic, and
     QA phases.
5. **Write `CLAUDE.md` first.** Before building, hand Claude its constitution: the stack table, the
   **non-negotiable rules** (never hardcode colours → semantic tokens only; 4px spacing scale;
   `size-4` not `w-4 h-4`; Server Components by default; the Figma variable→Tailwind class map), and
   the Figma MCP flow.

**Prompt:**
```text
Read the shadcn-ui-design skill. Then write a CLAUDE.md for this repo that states the stack
(Next.js App Router, React 19, Tailwind v4, shadcn/ui owned in components/ui, next-themes,
lucide, react-hook-form+zod), the non-negotiable rules (NEVER hardcode colours — semantic token
classes only like bg-card/text-muted-foreground; 4px spacing scale; size-4 not w-4 h-4;
tw-animate-css; React.ComponentProps not forwardRef; Server Components by default), the Figma
variable→Tailwind class map, and the Figma MCP flow (get_design_context → get_variable_defs →
get_screenshot → map 1:1 → build → validate against the screenshot). Point to the skill's
DESIGN.md and components.md for exact token values and component patterns.
```

> **Gate 0:** `whoami` shows the right Figma account/seat; `curl` with your PAT hits
> `/v1/files/:key` → 200; `.claude/skills/shadcn-ui-design/references/DESIGN.md` exists; `CLAUDE.md`
> states the no-hardcoded-colour rule.

---

## Phase 1 — Scaffold the app

**Goal:** a running Next.js App Router app with Tailwind v4 + shadcn/ui wired to CSS-variable tokens.

**Prompt:**
```text
Scaffold a Next.js 16 (App Router) + React 19 + TypeScript app with Tailwind CSS v4 and shadcn/ui
(neutral base, CSS variables, @/ aliases). Add next-themes (class strategy) with a ThemeProvider
and a Toaster in the root layout, Geist + Geist Mono via next/font, and a demo page.tsx that shows
the semantic tokens. Create components.json, tsconfig path aliases, components/providers/
theme-provider.tsx, and lib/utils.ts (cn). Follow CLAUDE.md — no hardcoded colours.
```

**Produces:** `app/{layout,page,globals}.tsx/css`, `components.json`, `tsconfig.json` aliases,
`components/providers/theme-provider.tsx`, `lib/utils.ts` (`cn`), `postcss.config.mjs`.

> **Gate 1:** `npm run dev` serves; `npx tsc --noEmit` clean; the demo page renders with
> `bg-background`/`text-foreground` (no hex anywhere).

---

## Phase 2 — Tokens as the source of truth (DTCG, 3-tier)

**Goal:** design tokens live in `tokens/*.tokens.json` and **generate** the CSS — never hand-edited.

**Prompt** (uses the `design-tokens` + `token-build` skills):
```text
Using the design-tokens and token-build skills: pull the Figma file's variables and author them as
DTCG tokens in tokens/ with the 3-tier architecture (primitive → semantic → component), split into
color, dimension, typography, motion. Write scripts/build-tokens.mjs that transforms them into
app/tokens.generated.css, where semantic aliases resolve to var(--role) so they stay light/dark
aware. Wire "tokens:build": "node scripts/build-tokens.mjs" and make "build" run tokens:build
first. Semantic vars must alias primitives, never hold raw values.
```

**Produces:** `tokens/{color,dimension,typography,motion}.tokens.json`, `scripts/build-tokens.mjs`,
`app/tokens.generated.css`, the semantic layer in `app/globals.css`.

**Why now:** components in Phase 3 bind to these token names. A component built before its token
exists will hardcode a value — the exact thing CI later fails on.

> **Gate 2:** `npm run tokens:build` is **reproducible** (re-running produces no git diff — CI
> enforces this); semantic vars alias primitives (never raw values).

---

## Phase 3 — Components (own them, don't wrap)

**Goal:** all shadcn/ui primitives installed and any composite patterns documented.

**Prompt:**
```text
Add every shadcn/ui primitive we need via `npx shadcn@latest add …` into components/ui/ (own them —
edit in place, never wrap). Then close the gap against the Figma component set: add sm/md/xl size
variants to the core form controls, and build the composition patterns — combobox, data-table (real
TanStack Table), date-picker — as composed examples that reuse Popover/Command/Calendar/Table (no
standalone primitive file). Use only semantic token classes; no hex, no text-gray-*.
```

**Produces:** 52 `components/ui/*.tsx`, `hooks/`, TanStack + cmdk + react-day-picker deps.

> **Gate 3:** every primitive renders; `npx tsc --noEmit` clean; grep for hex / `text-gray-*` in
> `components/**` (outside `components/ui`) returns nothing.

---

## Phase 4 (optional) — Apply a brand

**Goal:** give the neutral base a look **without touching component code** — only tokens. The base
ships neutral on purpose; this phase is how you brand a real project. `apple` below is just one
example of the 138 named systems the skill knows. Full guide: [`applying-a-brand.md`](applying-a-brand.md).

**Prompt** (uses `apply-aesthetic`):
```text
Using the apply-aesthetic skill, apply the `<brand>` aesthetic on top of the neutral base: re-point
the primitive + SEMANTIC tokens (background/foreground/primary/muted-foreground/destructive/border/
ring + chart ramp + sidebar) in tokens/*.tokens.json AND globals.css :root/.dark, in BOTH light and
dark. Update the font in app/layout.tsx + typography tokens if the brand calls for it. Verify every
foreground/background pair meets WCAG 2.2 AA and annotate the ratios. Do NOT change any
components/ui file. Then run tokens:build.
```

**Produces:** re-pointed semantic tokens (e.g. for `apple`: `--primary #0071e3`,
`--muted-foreground #6e6e73`), WCAG-annotated. Every component reskins because it reads semantic
classes — zero component edits. Skip this phase entirely to ship the neutral base.

> **Gate 4:** contrast check passes AA for all text pairs; the app restyles but no component diff.

---

## Phase 5 — Docs + Storybook at "assignment depth"

**Goal:** every component documented three ways — a registry demo, a 1:1 MDX doc, and a manual
Storybook story showing all states/variants — plus an automated a11y gate.

**Prompt** (uses `design-component` + `design-qa`):
```text
Using design-component and design-qa: stand up Storybook (@storybook/nextjs-vite) with addons a11y,
docs, themes, vitest, and a11y: { test: 'error' } in preview. Build a doc registry
(components/docs/registry.tsx) with a demo per component; a 1:1 MDX doc per component in
stories/docs/ bound via <Meta of={…}>; and a manual story per component in stories/manual/ at
assignment depth (discrete state + variant galleries; real disabled/aria-invalid; static
focus/hover reproductions). Add scripts/gen-stories.mjs (a Demo-only generator with a MANUAL
skip-set). Add a component-tier token block per component in tokens/*.tokens.json.
```

**Produces:** `stories/manual/*` (55), `stories/docs/*.mdx` (55, 1:1), `components/docs/registry.tsx`,
`.storybook/*`, `scripts/gen-stories.mjs`, component-tier tokens.

> **Gate 5:** `npm run test-storybook` renders every story and axe passes (WCAG 2 AA, error-mode);
> MDX count == manual-story count == component count.

---

## Phase 6 — Quality gates + CI (make it self-defending)

**Goal:** the design system can't silently regress.

**Prompt:**
```text
Add an audit system: scripts/audit-components.mjs + scripts/audit-variants.mjs (npm run audit) that
cross-check the Figma Components pages against components/ui/*, the doc registry, and the 1:1 MDX
docs, and enforce rule #1 — NO hardcoded colours outside components/ui — writing AUDIT.md and
VARIANTS.md. Load the PAT from .env.local via `node --env-file-if-exists=.env.local`. Then add a
GitHub Actions ci.yml with 4 gates: (1) Lint & typecheck, (2) Design-system gates = tokens:build
reproducibility + the hardcoded-colour check, (3) Storybook tests (render + a11y via playwright),
(4) Next.js build. Add @vitest/coverage-v8.
```

**Produces:** `scripts/audit-*.mjs`, `AUDIT.md`, `VARIANTS.md`, `.github/workflows/ci.yml`,
`@vitest/coverage-v8`.

> **Gate 6:** all 4 CI gates green on a PR; `npm run audit` reports 0 hardcoded-colour violations.

---

## Phase 7 — Figma round-trip tooling (keep design ↔ code honest)

**Goal:** prove — and keep proving — that the Figma file and the shipped tokens agree.

**Prompt:**
```text
Add scripts/figma-pull.mjs (npm run figma:pull <nodeId>) that pulls a node's rendered colours and
matches each → nearest primitive + semantic token (OKLab ΔE, reading primitives from DESIGN.md §A2
hex and semantics from globals.css hex AND oklch). Add scripts/figma-token-parity.mjs
(npm run figma:parity) that sweeps every Components page, counts ONLY rendered colours (skip
visible:false — invisible instance interiors over-report as false drift), and writes
docs/figma-token-parity.md. Write a code→Figma push runbook (docs/code-to-figma-push.md): writes go
through the MCP Plugin API (use_figma), not REST (Enterprise-gated); text can't be automated (font
load limit); mind per-page variant attribution.
```

**Produces:** `scripts/figma-pull.mjs`, `scripts/figma-token-parity.mjs`,
`docs/{figma-token-parity,code-to-figma-push}.md`.

> **Gate 7:** `npm run figma:parity` reports ~99–100% of rendered Figma colours mapping to a
> semantic/chart token; residual "drift" is explainable (OS-native mocks, bound single nodes).

---

## The traps that cost the most time (learn them once)

- **Two Figma channels are not interchangeable.** REST reads structure; **Variables (values) are
  Enterprise-only over REST** — use MCP `get_variable_defs` / `getLocalVariablesAsync`. Writes go
  through the MCP **Plugin API**, never REST.
- **A committed `variables-export.json` goes stale.** Trust the **live** Figma (MCP) for parity, not
  a snapshot — the snapshot can drift from the live file after a brand re-point.
- **A raw node dump over-reports drift.** Colours on `visible:false` nodes and instance interiors
  don't render — filter them, or you'll "fix" things nobody sees.
- **Variant audits attribute per-page, not per-component.** A `Type=Outline` found on the Spinner
  page may belong to a Button composed there, not the Spinner. Open the node before "fixing."
- **Tokens are generated.** Edit `tokens/*.json` then `npm run tokens:build`; never hand-edit
  `tokens.generated.css` (CI fails on drift).
- **PATs expire.** Keep the working one in gitignored `.env.local`; scripts auto-load it.

---

## One-line phase map

`Phase 0 foundations (skills + CLAUDE.md + Figma access)` → `1 scaffold` → `2 tokens (source of
truth)` → `3 components` → `4 brand (optional, WCAG)` → `5 docs + Storybook + a11y` → `6 audit +
CI` → `7 Figma parity + push runbook`.

Each arrow is a green gate. Teach the gates, not just the prompts — the gate is what makes the next
prompt safe.

---

## Master checklist

Tick top-to-bottom; don't start a phase until the one above is fully checked.

**Phase 0 — Foundations**
- [ ] Node ≥ 20.12, git, GitHub repo, Claude Code installed
- [ ] Figma file with Variables; file key noted
- [ ] Figma MCP connected (`/mcp`), `whoami` = right account + Full/Dev seat
- [ ] REST PAT in gitignored `.env.local` (`FIGMA_PERSONAL_ACCESS_TOKEN`, `FIGMA_FILE_KEY`); `/v1/files/:key` → 200
- [ ] `shadcn-ui-design` skill + design kit vendored in `.claude/skills/`
- [ ] `CLAUDE.md` written (no-hardcoded-colour rule + Figma flow)

**Phase 1 — Scaffold**
- [ ] `npm run dev` serves; `npx tsc --noEmit` clean
- [ ] Demo page uses `bg-background`/`text-foreground` — zero hex

**Phase 2 — Tokens**
- [ ] `tokens/{color,dimension,typography,motion}.tokens.json` (3-tier)
- [ ] `npm run tokens:build` → `app/tokens.generated.css`, reproducible (no git diff on re-run)
- [ ] Semantic vars alias primitives (no raw values)

**Phase 3 — Components**
- [ ] 52 `components/ui/*` installed (owned, not wrapped)
- [ ] combobox / data-table / date-picker composition examples
- [ ] `npx tsc --noEmit` clean; no hex/`text-gray-*` outside `components/ui`

**Phase 4 — Brand (optional)**
- [ ] (optional) Semantic tokens re-pointed to a brand (light + dark), only tokens/globals edited
- [ ] All text pairs pass WCAG 2.2 AA (ratios annotated)

**Phase 5 — Docs + Storybook**
- [ ] Storybook up with a11y `test: 'error'`
- [ ] 55 MDX docs == 55 manual stories == component count
- [ ] `npm run test-storybook` green (render + axe AA)

**Phase 6 — Audit + CI**
- [ ] `npm run audit` → `AUDIT.md`/`VARIANTS.md`, 0 hardcoded-colour violations
- [ ] CI 4 gates green (lint+typecheck · design gates · storybook a11y · build)

**Phase 7 — Figma parity + push**
- [ ] `npm run figma:pull <node>` matches colours → tokens
- [ ] `npm run figma:parity` ~99–100% mapped → `docs/figma-token-parity.md`
- [ ] `docs/code-to-figma-push.md` runbook present
