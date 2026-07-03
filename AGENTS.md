<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from
your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any
code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

The canonical, always-read guide for this repo is **[CLAUDE.md](./CLAUDE.md)** — read it first.
This file is the cross-tool pointer (agents that look for `AGENTS.md`); it summarizes only the
must-not-break rules. CLAUDE.md is the source of truth.

## What this is

A Next.js (App Router) + Tailwind v4 + shadcn/ui app driven by a DTCG design-token system on a
**neutral base** (shadcn neutral, in sync with the Figma neutral collection). It's a starter tool —
apply a brand on top with the `apply-aesthetic` skill (see `docs/applying-a-brand.md`). Every
component is documented at "assignment depth":
state/variant stories in `stories/manual/**`, a 1:1 MDX doc in `stories/docs/**` (bound via
`<Meta of={…}>`), and a component-tier token block in `tokens/*.tokens.json`.

## Non-negotiable rules

1. **Never hardcode colors.** Use semantic token classes only (`bg-card`, `text-muted-foreground`,
   `border-border`, `bg-primary`) — no hex, no `text-gray-500`. CI enforces this outside
   `components/ui` (`npm run audit:components` → rule #1). A sanctioned arbitrary value must carry
   a `ds-allow-hardcode` comment on its line.
2. **Tokens are generated.** Edit `tokens/*.tokens.json`, then run `npm run tokens:build` to
   regenerate `app/tokens.generated.css`. CI fails on drift. Don't hand-edit the generated CSS.
3. **Own, don't fork.** `components/ui/*` are shadcn primitives — add via `npx shadcn@latest add`;
   keep edits token-driven.
4. **Docs are 1:1.** Each component has exactly one `stories/docs/*.mdx` bound with
   `<Meta of={XStories} />`. Manual stories carry **no** `tags: ["autodocs"]` (an attached MDX
   does not replace autodocs — both would render, duplicating the Docs entry).
5. **Tailwind v4 idioms:** `size-4` not `w-4 h-4`; `tw-animate-css`; `React.ComponentProps<>` over
   `forwardRef`. Server Components by default; `"use client"` only at the interactive leaf.

## Verify before you push

```bash
npm run lint && npx tsc --noEmit
npm run test-storybook   # render-smoke + play + axe a11y (205 tests)
npm run audit            # AUDIT.md (rule #1) [+ VARIANTS.md when a Figma token is set]
```

## Figma

Code is the source of truth; sync **code → Figma** via the Figma MCP (the REST PAT is dead; writes
use the MCP OAuth connection). Colors in Figma must be applied via **alias/semantic** variables
only — semantic vars **alias primitives**, never hold raw values. Pull direction (Figma → code):
CLAUDE.md → "Figma MCP Integration Rules". Push direction (code → Figma) runbook:
**[docs/code-to-figma-push.md](./docs/code-to-figma-push.md)** — auth/seat, token→Variable mapping,
what can't be automated (text/Google Sans), and the per-page variant-attribution pitfall.
Drift check: `npm run figma:pull <nodeId>` matches a node's colours → tokens; `npm run figma:parity`
sweeps every Components page and writes **[docs/figma-token-parity.md](./docs/figma-token-parity.md)**
(rendered colours only — invisible nodes skipped, so no false "drift" from instance interiors).
