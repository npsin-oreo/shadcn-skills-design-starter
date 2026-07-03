<div align="center">

# 🎨 shadcn-skills-design-starter

**A Next.js starter wired to a Figma-driven design system — and supercharged for Claude Code.**

Design in Figma → tokens flow **1:1** into Tailwind → AI skills build, review, and ship the UI.

<br/>

![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Radix-000000)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
<br/>
![Design Tokens](https://img.shields.io/badge/Design_Tokens-1%2C804-171717)
![UI Components](https://img.shields.io/badge/Components-52-171717)
![Claude Skills](https://img.shields.io/badge/Claude_Skills-18-D97757)
![Offline Docs](https://img.shields.io/badge/Docs-offline_export-16A34A)

</div>

---

## 🧩 Design Components → Storybook

Three shadcn/ui components taken through the full design-system pipeline
(**tokens → code → docs → Storybook**) on the **neutral base** (apply a brand on top — see
[`docs/applying-a-brand.md`](docs/applying-a-brand.md)):

| Component | Level | States covered |
|---|---|---|
| **Button** | atom | default · hover · focus · active · disabled · loading · error |
| **Input / Field** | form | default · focus · filled · disabled · error |
| **Dialog** | composition | trigger · overlay · focus-trapped panel · form / destructive confirm |

- **Tokens** — DTCG 3-tier (`tokens/*.tokens.json`: primitive → semantic → component), compiled to CSS by `npm run tokens:build`. See [`tokens/README.md`](tokens/README.md).
- **Docs** — per-component MDX (anatomy · API · usage · a11y) under **Docs/** in Storybook.
- **A11y** — WCAG 2.2 AA; the Storybook a11y addon runs in `error` mode and passes on every story.

```bash
npm run storybook        # explore components + docs (http://localhost:6006)
npm run tokens:build     # DTCG tokens → app/tokens.generated.css
npm run test-storybook   # render + a11y smoke test (all stories)
npm run build-storybook  # static build → storybook-static/
```

**Live Storybook:** https://npsin-oreo.github.io/shadcn-skills-design-starter/ — deployed via GitHub Actions on push to `main`.

---

## ✨ Overview

This starter connects four layers so a Figma design becomes production code with minimal prompting:

| Layer | Role |
| :--- | :--- |
| 🎯 **Figma** | Source of truth — **1,804** design variables (the neutral theme) |
| 🧩 **Design tokens** | Figma variables map **1:1** to Tailwind classes (`primary` → `bg-primary`) |
| 🤖 **Claude Code** | `CLAUDE.md` + **18 skills** carry the rules, tokens, and the Figma → code workflow |
| 📚 **Living docs** | A browsable gallery of all **52 components** — exports to a fully offline static site |

```text
        ┌─────────┐   variables-export.json   ┌──────────────┐   semantic tokens   ┌──────────────┐
        │  FIGMA  │ ─────────  1:1  ─────────► │  app/         │ ─────────────────► │  components/  │
        │ 1,804   │   (Figma REST API +        │  globals.css  │   bg-primary,       │  ui/ (52)     │
        │ tokens  │    generate_tokens.py)     │  @theme inline│   text-muted-…      │  shadcn/ui    │
        └─────────┘                            └──────────────┘                     └──────┬───────┘
              ▲                                                                            │
              │  Code Connect / figma-integration                            /docs gallery │
              └──────────────────  Claude Code (CLAUDE.md + 18 skills)  ◄──────────────────┘
```

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open **[http://localhost:3000](http://localhost:3000)** for the app, or **[/docs](http://localhost:3000/docs)** for the component gallery.

| Script | Action |
| :--- | :--- |
| `npm run dev` | Start the dev server (Turbopack) |
| `npm run build` | Production build → static export to `out/` |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Type-check with `tsc --noEmit` |
| `npm run figma:pull` | Pull live colors & variable bindings from the Figma REST API |
| `npm run docs:offline` | Build + serve the component docs as a fully offline site |
| `npm run storybook` | Start Storybook (dev/QA component explorer) on :6006 |
| `npm run build-storybook` | Build the static Storybook to `storybook-static/` |
| `npm run gen:stories` | Regenerate demo stories from the component registry |
| `npm run test-storybook` | Run every story as a browser render test (Vitest + Playwright) |

---

## 🔄 Workflows

Seven end-to-end flows this repo is built around.

### 1 · Figma → Code (the design-to-code loop)

The primary loop, driven by Claude Code + the Figma MCP. From any `figma.com/design/<KEY>/…?node-id=1-2` URL:

```text
get_design_context   →  read the node (structure + intent)
get_variable_defs    →  resolve the bound design variables
get_screenshot       →  visual source of truth for validation
       ↓
map variables → Tailwind tokens  (primary → bg-primary, 1:1)
       ↓
build with Server Components, reuse components/ui/*
       ↓
validate the result against the screenshot
```

> Rules for each step live in **`CLAUDE.md` → Figma MCP Integration Rules** and the `figma-integration` skill.

### 2 · Pull live data from Figma (REST API)

`scripts/figma-pull.mjs` reads colors and variable bindings straight from the official Figma REST API and maps each color back to your tokens (`DESIGN.md` primitives + `app/globals.css` semantic tokens) using perceptual **OKLab ΔE**. Zero dependencies, Node ≥ 18.

> **Cloning this repo?** The tool ships with it — `scripts/figma-pull.mjs` is committed, so there's **nothing to install separately** (no extra npm package; it uses native `fetch`). The only thing that's *not* committed is the secret: `.mcp.json` (your Figma PAT) is gitignored. Bring your own token — that's the one piece each person supplies.

```bash
# 1. Provide a Figma Personal Access Token (never commit it — .mcp.json is gitignored)
cp .mcp.json.example .mcp.json   # then paste your figd_… token
#    or: export FIGMA_PERSONAL_ACCESS_TOKEN="figd_…"

# 2. Pull a frame/component by node id (from any figma.com/design/<KEY>/…?node-id=72-2591 URL)
npm run figma:pull -- --file <FILE_KEY> 72-2591

# 3. Optional JSON report
npm run figma:pull -- --file <FILE_KEY> 72-2591 --out figma-report.json
```

> Vendored from [plugin87/figma-rest-api](https://github.com/plugin87/figma-rest-api) (MIT). The Variables REST endpoint is Enterprise-only; on other plans you still get every rendered color + the variable ids each property is bound to.

### 3 · Regenerate the token reference

After a Figma re-sync, rebuild the human-readable token reference from the exported variables:

```bash
python3 .claude/skills/shadcn-ui-design/scripts/generate_tokens.py
# → writes references/DESIGN.md, verifies all 1,804 tokens
```

### 4 · Build with the AI design skills

18 skills auto-activate on UI work (see [Claude Code Integration](#-claude-code-integration)). Typical chains:

- **New component** → `design-component` (spec) → `shadcn-ui-design` / `design-code` (code) → `design-qa` (gates)
- **Audit an existing screen** → `design-review` (heuristics) + `a11y-audit` (WCAG) → `redesign` (surgical upgrade)
- **Copy / microcopy** → `ux-writing` · **Performance** → `performance` (Core Web Vitals)

### 5 · Component docs gallery (online + offline)

A browsable gallery of every component lives at **`/docs`**, with live demos, copy-paste code, and foundation reference pages (Icons · Colors · Typography · Spacing · Radius). `next build` emits a **fully static** site to `out/` (`output: "export"`), hostable anywhere.

```bash
npm run docs:offline      # builds out/ if missing, then serves it offline at http://localhost:4321/docs/
```

> Or double-click `scripts/open-docs.command` in Finder. It serves `out/` via Python's static server — no internet, no Node server runtime.

### 6 · Storybook (dev + QA component explorer)

A Storybook complements the `/docs` gallery as the **dev/QA surface** — browse each component
in isolation, flip light/dark, and run accessibility checks. Stories are **generated from the
same `components/docs/registry.tsx`** (single source of truth), so they never drift from the docs.

```bash
npm run storybook          # http://localhost:6006
npm run gen:stories        # regenerate demo stories after editing the registry
npm run test-storybook     # run every story as a render test (CI-friendly)
```

- **52 components**, sidebar grouped by the 7 categories, each with an autodocs page + code snippet.
- **Interactive Controls** — **47 components** have a hand-authored **Playground** story with
  `args`/`argTypes` for live knobs (variant/size/disabled, overlay open/side, type, counts, text…),
  in `stories/manual/`. The 8 deeply-composite ones (chart, data-table, menubar, navigation-menu,
  command-palette combobox, date-picker, context-menu, input-group) keep a rich Demo (generated
  into `stories/generated/`), where prop-level controls aren't meaningful.
- **Themes** toolbar toggles light/dark (`.dark` class, matching `next-themes`).
- **a11y** addon runs axe on every story for QA.
- **Test runner** — `@storybook/addon-vitest` adds a sidebar **Testing** widget that runs every
  story as a browser render smoke-test (Vitest + Playwright/Chromium); `npm run test-storybook`
  runs the same headless. ✅ All 102 stories currently pass.
- Stack: Storybook 10 · `@storybook/nextjs-vite` · Tailwind v4 via `@tailwindcss/vite`.
- Foundations / Design-Token pages stay in `/docs` (they read tokens server-side; stubbed in SB).

### 7 · Multi-platform / any-framework token export

The token-build pipeline sources the **real** neutral theme — not samples — straight from `app/globals.css`:

```bash
# canonical { name: { light, dark } } map (32 semantic tokens) for downstream export
node .claude/skills/_resources/scripts/build_tokens.mjs --from-css app/globals.css --json --out dist/tokens.json
```

Feed `dist/tokens.json` into the `design-code` adapters (React, Vue, Svelte, SwiftUI, Compose, …) or a Style-Dictionary build to emit the same theme on any platform. See the `token-build` skill.

---

## 🧱 Tech Stack

| Tool | Version | Purpose |
| :--- | :--- | :--- |
| **Next.js** | 16 (App Router) | Framework — Server Components by default, static export |
| **React** | 19 | UI runtime |
| **Tailwind CSS** | v4 | Styling via `@theme inline` tokens |
| **shadcn/ui** | Radix · neutral | Owned components in `components/ui/` |
| **TypeScript** | 5 | Types throughout |
| **next-themes** | 0.4 | Light / dark mode (class strategy) |
| **lucide-react** | 1.x | Icons |
| **sonner** | — | Toasts |
| **tw-animate-css** | — | Animations |
| **embla-carousel** · **react-day-picker** | — | Carousel · Calendar primitives |

---

## 🤖 Claude Code Integration

This repo is designed to drive UI work from a Figma file through Claude Code.

### `CLAUDE.md` — loaded every session
Stack, structure, design-system rules, and the **Figma MCP workflow** (the step order from [Workflow 1](#1--figma--code-the-design-to-code-loop)).

### `.claude/skills/` — 18 skills

The project's own **`shadcn-ui-design`** skill, plus the vendored **`ux-ui-agent-skills`** kit. All shared reference data (138-system design library, framework adapters, token samples, scripts, component specs) is consolidated under **`_resources/`** to keep the project root clean.

```text
.claude/skills/
├── shadcn-ui-design/            # ★ this project's design system (use this first)
│   ├── SKILL.md                 # manifest + core rules
│   ├── references/              # DESIGN.md (1,804 tokens) · components.md · nextjs.md
│   ├── scripts/generate_tokens.py
│   └── assets/                  # globals.css · utils.ts · fonts.ts · variables-export.json
├── _resources/                  # shared kit data (see _resources/README.md)
│   ├── KIT-CONVENTIONS.md        design-systems/ (138)  frameworks/ (20 adapters)
│   └── scripts/ (19)             tokens/ (samples)      components/ (specs)
└── …17 kit skills…              # each a SKILL.md referencing ../_resources/
```

<details>
<summary><b>The 17 kit skills</b> (click to expand)</summary>

| Skill | What it does |
| :--- | :--- |
| `design-code` | Production component code for **any** framework (React, Vue, Svelte, SwiftUI, Compose…) |
| `design-component` | Component spec — anatomy, variants, the 8 states, token mapping, a11y |
| `design-tokens` | Generate / audit DTCG tokens (3-tier: primitive → semantic → component) |
| `token-build` | Build tokens → platform artifacts (CSS, Tailwind, JS/TS, iOS, Android, Compose) |
| `design-review` | Critique a UI across 6 dimensions + Nielsen's 10 heuristics |
| `a11y-audit` | WCAG 2.2 AA/AAA + ARIA audit with criterion-referenced fixes |
| `design-qa` | QA gates — token/hardcode lint, axe, contrast, visual regression |
| `performance` | Core Web Vitals (LCP / INP / CLS) optimisation |
| `redesign` | Upgrade an existing UI to premium quality without breaking it |
| `image-to-code` | Turn a screenshot/mockup into token-driven code |
| `apply-aesthetic` | Apply a named look (apple, linear, vercel…) from the 138-system library |
| `brandkit` | Generate a complete accessible brand token system from a brief |
| `migrate-design-system` | Bridge to/from Material, HIG, Fluent, Carbon, Ant… |
| `figma-integration` | Keep Figma ↔ code in sync (tokens ↔ Figma Variables) |
| `governance` | SemVer, contribution, and deprecation rules for the system |
| `prototype` | Fidelity ladder (content-first → wireframe → hi-fi → code) + usability tests |
| `ux-writing` | UI copy — buttons, errors, empty states, microcopy |

> ⚠️ For UI work **in this codebase**, prefer the project's own `shadcn-ui-design` skill. The kit's `tokens/*.json` are samples — the real source of truth is `app/globals.css`. Details in `.claude/skills/_resources/README.md`.

</details>

---

## 🎨 Design Tokens

Never hardcode colors — every value is a **semantic token**. Because the Figma file and the app share `variables-export.json`, the mapping is exact:

| Figma variable | Tailwind class |
| :--- | :--- |
| `background` / `foreground` | `bg-background` / `text-foreground` |
| `card` / `card-foreground` | `bg-card` / `text-card-foreground` |
| `primary` / `primary-foreground` | `bg-primary` / `text-primary-foreground` |
| `muted` / `muted-foreground` | `bg-muted` / `text-muted-foreground` |
| `accent` | `bg-accent` (hover states) |
| `destructive` | `text-destructive` / `bg-destructive` |
| `border` / `input` / `ring` | `border-border` / `border-input` / `ring-ring` |
| `sidebar*` | `bg-sidebar`, `text-sidebar-foreground`, … |
| `chart-1…5` | `var(--color-chart-1…5)` |

**Spacing** on the 4px scale (`p-4` = 16px) · **Radius** `rounded-sm` (controls) / `rounded-lg` (cards) / `rounded-xl` (dialogs) · **Fonts** Google Sans (`font-sans`) / Geist Mono (`font-mono`).

---

## 🧩 Component Library

**52** shadcn/ui components, owned in `components/ui/` (edit directly, never wrap), browsable at `/docs` and organised by category — **Form & Input · Display · Navigation · Overlay · Data · Feedback · Utility**, plus **Foundations** & **Design Tokens** reference pages.

<details>
<summary><b>All 52 components</b> (click to expand)</summary>

`accordion` · `alert` · `alert-dialog` · `aspect-ratio` · `avatar` · `badge` · `breadcrumb` · `button` · `button-group` · `calendar` · `card` · `carousel` · `chart` · `checkbox` · `collapsible` · `command` · `context-menu` · `dialog` · `drawer` · `dropdown-menu` · `empty` · `field` · `hover-card` · `input` · `input-group` · `input-otp` · `item` · `kbd` · `label` · `menubar` · `native-select` · `navigation-menu` · `pagination` · `popover` · `progress` · `radio-group` · `scroll-area` · `select` · `separator` · `sheet` · `sidebar` · `skeleton` · `slider` · `sonner` · `spinner` · `switch` · `table` · `tabs` · `textarea` · `toggle` · `toggle-group` · `tooltip`

</details>

Add more with:

```bash
npx shadcn@latest add <component>
```

---

## 📂 Project Structure

```text
.
├── app/
│   ├── layout.tsx              # fonts + ThemeProvider + Toaster
│   ├── globals.css             # @theme inline tokens (oklch, neutral) — REAL token source
│   ├── page.tsx                # token showcase page
│   └── docs/                   # component gallery (static-exported)
│       ├── page.tsx            # gallery index (grouped by category)
│       └── [slug]/page.tsx     # per-component demo + code + references
├── components/
│   ├── ui/                     # shadcn/ui — 52 components, edit directly
│   ├── docs/                   # gallery registry, sidebar, demos, reference pages
│   ├── providers/              # theme-provider
│   └── layout/                 # app chrome (mode-toggle, …)
├── lib/
│   ├── utils.ts                # cn() helper
│   └── design-tokens.ts        # server-only reader of variables-export.json (docs pages)
├── scripts/
│   ├── figma-pull.mjs          # pull colors/bindings from the Figma REST API
│   └── open-docs.command       # offline docs launcher (npm run docs:offline)
├── .claude/skills/             # 18 skills (shadcn-ui-design + ux-ui-agent-skills kit)
├── components.json             # shadcn config (radix, neutral, @/ aliases)
├── next.config.ts              # output: "export" (static), trailingSlash
├── .mcp.json.example           # Figma token template (.mcp.json is gitignored)
└── CLAUDE.md                   # Claude Code project guide
```

---

## 📐 Conventions

- **Server Components by default** — add `"use client"` only for interactivity, at the leaf.
- **Semantic tokens only** — no raw hex, no `text-gray-500`.
- **Tailwind v4** — `size-4` (not `w-4 h-4`), `tw-animate-css`, React 19 `ComponentProps`.
- **Accessibility** — `aria-label` on icon buttons, `<DialogTitle>` + `<DialogDescription>`, visible focus rings, color never the only signal.
- **Secrets** — never commit a Figma PAT. `.mcp.json`, `figma-*.json`, and `.env*` are gitignored.

---

<div align="center">
<sub>Built with Next.js · Tailwind CSS v4 · shadcn/ui — driven by Figma & Claude Code</sub>
</div>
