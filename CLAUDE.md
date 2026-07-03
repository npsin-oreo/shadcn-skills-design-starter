# CLAUDE.md

Project guide for Claude Code. A Next.js + Tailwind CSS v4 + shadcn/ui app whose UI is
driven by a Figma design system. Read this every session.

## Project Overview

- **What:** Next.js (App Router) application built from a Figma design file.
- **Design system:** 1,804 design tokens synced from Figma (neutral theme). The Figma file
  and this app share the **same token set**, so Figma variable names map 1:1 to Tailwind classes.
- **Skill:** `.claude/skills/shadcn-ui-design/` carries the full token reference, Next.js
  conventions, and component patterns. It auto-activates on UI work — prefer it over guessing.

## Tech Stack

| Layer | Tool | Version |
|---|---|---|
| Framework | Next.js (App Router) | Latest |
| Styling | Tailwind CSS | v4 |
| Components | shadcn/ui (owned in `components/ui/`) | Latest |
| Animation | tw-animate-css | Latest |
| Icons | lucide-react | Latest |
| Forms | react-hook-form + zod | Latest |
| Theming | next-themes (class strategy) | Latest |
| Fonts | next/font — Google Sans (sans), Geist Mono (mono) | — |

## Commands

```bash
npm run dev          # start dev server (http://localhost:3000)
npm run build        # production build
npm run start        # serve production build
npm run lint         # eslint
npx tsc --noEmit     # typecheck
npx shadcn@latest add <name>   # add a shadcn/ui component
npm run storybook        # component explorer (http://localhost:6006)
npm run gen:stories      # regenerate stories/generated/ from the registry
npm run test-storybook   # render-smoke every story (vitest + playwright)
npm run audit            # audit:components + audit:variants → AUDIT.md + VARIANTS.md
```

> **Design-system audit** (`scripts/audit-{components,variants}.mjs`): cross-checks the Figma
> component set against `components/ui/*`, the doc registry, and the 1:1 MDX docs, and enforces
> **rule #1 — no hardcoded colors outside `components/ui`** (only `.tsx/.ts` is scanned, so the
> token `*.css` files are exempt; a sanctioned arbitrary value must carry a `ds-allow-hardcode`
> comment marker on its line to be skipped). Needs a Figma REST token in `$FIGMA_PERSONAL_ACCESS_TOKEN`
> or `.mcp.json` (file key `$FIGMA_FILE_KEY`). **Without a valid token it degrades to a local
> code-only audit** — `audit:components` still writes `AUDIT.md` (primitives × registry × MDX +
> the hardcoded-color check) and `audit:variants` skips with a notice. The committed `AUDIT.md`
> was generated in local mode; supply a working token to populate the Figma coverage matrix +
> `VARIANTS.md`.

> **Storybook stories:** all components are now hand-authored in `stories/manual/**` (one file
> per component, with `args`/`argTypes` controls). Every component is at **assignment depth**:
> discrete state/variant galleries in its manual story (static focus/hover reproduce the
> component's own pseudo-class utilities; `disabled`/`aria-invalid` use real attributes), a
> curated MDX doc in `stories/docs/**` (**55 files, 1:1 with components** — each binds to its
> story via `<Meta of={XStories} />` so it renders as that component's **Docs tab**. NOTE: an
> attached MDX does **not** replace autodocs — the manual stories therefore carry **no**
> `tags: ["autodocs"]`, or each component would show two Docs entries), and a component-tier
> token block in `tokens/*.tokens.json` (313 vars; pure
> compositions like combobox/data-table/date-picker reuse their constituents' tokens and are
> documented rather than re-tokenised). `npm run gen:stories` emits Demo-only stories
> into `stories/generated/**` from `components/docs/registry.tsx`, **skipping** any slug in the
> `MANUAL` set in `scripts/gen-stories.mjs`. Since every slug is currently in `MANUAL`,
> `stories/generated/` is empty and the script writes 0 files — that is expected. Its guard
> distinguishes "regex matched **nothing**" (registry format broke → abort) from "everything is
> manual" (valid → wipe `generated/`, write 0). To get a generated story back, remove its slug
> from `MANUAL` and re-run.

> App is scaffolded: Next.js 16 + React 19 + Tailwind v4, shadcn/ui (radix, neutral base,
> CSS variables). `globals.css` carries all semantic + sidebar + chart tokens as oklch
> values matching the Figma neutral theme. Fonts: **Geist** (sans, working default) +
> **Geist Mono** via `next/font/google`. Design target for sans is **Google Sans** — add the
> licensed files and switch to `next/font/local` (see skill `assets/fonts.ts`) when available.

## Project Structure

```
app/                      # App Router — Server Components by default
  layout.tsx              # root: fonts + ThemeProvider + Toaster
  globals.css             # @theme inline tokens (oklch, neutral theme)
  page.tsx                # demo page showcasing tokens
  (group)/                # route groups: (auth), (dashboard) — add as needed
    layout.tsx page.tsx loading.tsx error.tsx
components/
  ui/                     # shadcn/ui — edit directly, never wrap
  providers/              # theme-provider.tsx (next-themes wrapper)
  layout/                 # app chrome: mode-toggle, sidebar, header, nav
  shared/                 # cross-feature composites
  [feature]/              # feature-scoped components
lib/                      # utils.ts (cn)
components.json           # shadcn config (radix, neutral, @/ aliases)
.claude/skills/shadcn-ui-design/   # design system skill (tokens + patterns)
```

## Design System Rules

- **IMPORTANT: never hardcode colors.** Use semantic token classes only —
  `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`. No hex, no `text-gray-500`.
- Spacing on the **4px scale**: `p-4` (16px), `gap-6` (24px), etc.
- Fonts: **Google Sans** (`font-sans`) / **Geist Mono** (`font-mono`).
- Radius: `rounded-sm` (buttons, inputs), `rounded-lg` (cards), `rounded-xl` (dialogs).
- Tailwind v4: use `size-4` not `w-4 h-4`; `tw-animate-css` not `tailwindcss-animate`;
  React 19 `React.ComponentProps<>` not `React.forwardRef()`.
- Exact token values (all 1,804) →
  `.claude/skills/shadcn-ui-design/references/DESIGN.md`.
- Component patterns (Button, Card, Form, Dialog, Table…) →
  `.claude/skills/shadcn-ui-design/references/components.md`.

## Figma MCP Integration Rules

**IMPORTANT:** For any Figma-driven change, follow this flow in order. Do not skip steps.
A Figma URL looks like `https://figma.com/design/:fileKey/:name?node-id=1-2`
(fileKey after `/design/`, nodeId = the `node-id` value).

> This section is the **Figma → code** (pull) flow. For the reverse — **code → Figma** (push) —
> follow the runbook in [`docs/code-to-figma-push.md`](docs/code-to-figma-push.md): writes go
> through the MCP OAuth connection (the REST PAT is dead), load the `figma-use` skill first, and
> mind the limits (text can't be automated — Google Sans) and the per-page variant-attribution
> pitfall. The `npm run audit` pipeline is read-only and never writes to Figma.

1. **`get_design_context`** for the node. If the response is truncated, run **`get_metadata`**
   for the node map, then re-fetch the specific child nodes individually.
2. **`get_variable_defs`** to read the design variables bound to the selection.
3. **`get_screenshot`** for a visual reference — this is the source of truth for validation.
4. **Assets:** if the Figma MCP returns a `localhost` source for an image/SVG, use it directly.
   IMPORTANT: do **not** add new icon packages, and do **not** use placeholders when a
   localhost source exists.
5. **Map Figma variables → Tailwind token classes** (1:1, see map below). Treat the MCP's
   React+Tailwind output as a representation of design, not final code.
6. Build with **Server Components by default**; reuse `components/ui/*`; add `"use client"`
   only for interactivity. Strive for 1:1 visual parity.
7. **Validate** the result against the `get_screenshot` image before marking complete.

## Figma Variable → Tailwind Token Map

The Figma file and this app share `variables-export.json`, so names match exactly:

| Figma variable | Tailwind class |
|---|---|
| `background` / `foreground` | `bg-background` / `text-foreground` |
| `card` / `card-foreground` | `bg-card` / `text-card-foreground` |
| `primary` / `primary-foreground` | `bg-primary` / `text-primary-foreground` |
| `secondary` | `bg-secondary` |
| `muted` / `muted-foreground` | `bg-muted` / `text-muted-foreground` |
| `accent` | `bg-accent` (hover states) |
| `destructive` | `text-destructive` / `bg-destructive` |
| `border` / `input` / `ring` | `border-border` / `border-input` / `ring-ring` |
| `sidebar*` | `bg-sidebar`, `text-sidebar-foreground`, `border-sidebar-border`, … |
| `chart-1`…`chart-5` | `var(--color-chart-1)` … `var(--color-chart-5)` |

If a Figma spec conflicts with a token, prefer the token and adjust spacing/size minimally
to match the screenshot.

## Server vs Client & Accessibility

- Server Component is the default. Add `"use client"` only for `useState`/`useEffect`/event
  handlers/browser APIs/router hooks. Push it to the interactive leaf, not the page.
  Details → `.claude/skills/shadcn-ui-design/references/nextjs.md`.
- Icon-only buttons need `aria-label`; dialogs need `<DialogTitle>` + `<DialogDescription>`;
  never remove the focus ring (`focus-visible:ring-2 focus-visible:ring-ring`); color is
  never the only signal.

## Code Connect (optional, Level 2)

Once the Figma library is published, map Figma components to `components/ui/*` with a
`figma.config.json` + `*.figma.tsx` files so `get_design_context` returns project component
names directly. Use the `figma-code-connect` skill to set this up. Not required for the first
implementation pass.

<!-- Regenerate the token reference after a Figma re-sync:
     python3 .claude/skills/shadcn-ui-design/scripts/generate_tokens.py -->
