# Design Tokens — DTCG 3-tier (neutral base)

W3C **DTCG**-format design tokens for this project, in the canonical 3-tier
architecture. The base is the **shadcn neutral** theme (OKLCH), in sync with the
Figma neutral collection. This is a starting tool — apply a brand on top with the
`apply-aesthetic` skill (see [`../docs/applying-a-brand.md`](../docs/applying-a-brand.md)),
which re-points the primitive + semantic layers only.

## The three tiers

```
Primitive  →  Semantic  →  Component
raw palette   purpose roles  component-scoped
(neutral/900)  (primary)      (button.default-bg)
```

| Tier | Lives in | Rule |
|---|---|---|
| **Primitive** | `*.tokens.json` → `primitive` | Raw values. Never referenced by components. |
| **Semantic** | `*.tokens.json` → `semantic` + **`app/globals.css`** `:root`/`.dark` | Purpose roles (`primary`, `muted-foreground`, `ring`…). Names map 1:1 to CSS vars and Tailwind classes (`bg-primary`, `text-muted-foreground`). Light = `$value`; dark = `$extensions.mode.dark`. |
| **Component** | `*.tokens.json` → `component` → generated to `app/tokens.generated.css` | `button.*`, `field.*`, `dialog.*`. Each aliases a semantic role — components never touch primitives or raw values. |

## Files

- `color.tokens.json` — palette → roles → button/field/dialog colors
- `dimension.tokens.json` — radius scale (10px shadcn-neutral base)
- `motion.tokens.json` — durations + easings + per-component transitions
- `typography.tokens.json` — font families (Geist sans), weights, sizes

## Build

```bash
npm run tokens:build   # tokens/*.tokens.json → app/tokens.generated.css
```

`scripts/build-tokens.mjs` emits **only the component tier** as CSS custom
properties. The trick that keeps light/dark working: when a component token
aliases a **semantic** role it emits `var(--role)` (not the resolved literal),
so it inherits the mode-swapped value from `globals.css`. Primitive aliases and
raw values (overlay, durations) are inlined. `globals.css` `@import`s the
generated file, and `npm run build` runs `tokens:build` first so it never drifts.

`globals.css` `:root`/`.dark` **is** the compiled primitive+semantic output (the
source of truth that actually renders); these JSON files are the documented,
tool-portable definition of the same system.

## Accessibility

Every mapped text/UI color pair is verified **WCAG 2.2 AA**. The neutral base uses
the shadcn neutral OKLCH scale (e.g. `--foreground` oklch(0.145) on `--background`
oklch(1) ≈ 19:1; `--muted-foreground` oklch(0.556) on white ≈ 4.6:1). When you
apply a brand, re-verify each pair — the `apply-aesthetic` skill checks contrast
as part of the re-point.

## Branding

The neutral base is intentionally unopinionated. To give a project a look, apply a
named design system (apple, linear, stripe, vercel…) or a custom brand with the
`apply-aesthetic` skill — it re-points the primitive + semantic tiers (and
`globals.css` `:root`/`.dark`) while leaving components and the component tier
untouched. See [`../docs/applying-a-brand.md`](../docs/applying-a-brand.md).
