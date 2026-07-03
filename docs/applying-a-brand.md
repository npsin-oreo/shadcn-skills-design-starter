# Applying a Brand

This repo ships a **neutral base** (shadcn neutral, in sync with the Figma neutral
collection). It's a starting tool — you give a project its look by applying a brand
**on top of** the neutral base. Branding re-points the **token layer only**; component
code, the docs site, Storybook, and CI never change.

## What a brand touches (and what it doesn't)

| Re-pointed by a brand | Left untouched |
|---|---|
| `tokens/color.tokens.json` — `primitive` + `semantic` | `components/ui/*` (consume semantic classes) |
| `tokens/typography.tokens.json` — `fontFamily` | the `component` tier (aliases semantics) |
| `tokens/dimension.tokens.json` — radius `base` | `stories/**`, `components/docs/registry.tsx` |
| `app/globals.css` — `:root` / `.dark` | `.github/workflows/ci.yml`, the audit |
| `app/layout.tsx` — the font import | — |

Because every component reads **semantic** classes (`bg-primary`, `text-muted-foreground`,
`border-border`) and the component tier aliases semantic roles, re-pointing the semantic
values reskins the entire app with zero component edits.

## The workflow (use the `apply-aesthetic` skill)

The `apply-aesthetic` skill resolves a named design system or a custom brief into the token
system and verifies contrast. Prompt Claude Code:

```text
Using the apply-aesthetic skill, apply the `<brand>` aesthetic on top of the neutral base:
re-point the primitive + semantic tokens (background/foreground/primary/muted-foreground/
destructive/border/ring + chart ramp + sidebar) in tokens/*.tokens.json AND app/globals.css
:root/.dark, in both light and dark. Update the font in app/layout.tsx + typography tokens if
the brand calls for it. Verify every foreground/background pair meets WCAG 2.2 AA and annotate
the ratios. Do NOT change any components/ui file. Then run `npm run tokens:build`.
```

Swap `<brand>` for one of the skill's 138 named systems, or describe a custom brand.

### Example references

The skill knows named systems you can drop in as a starting point:

| Brand | Feel | Signature move |
|---|---|---|
| `apple` | calm, high-contrast, spacious | action blue `#0071e3`, near-black ink, soft 12px geometry, SF/system type |
| `linear-app` | precise, technical, dark-first | indigo accent, tight radii, subtle borders |
| `stripe` | trustworthy, refined | violet/blurple accent, generous type scale |
| `vercel` | stark, monochrome-plus-one | near-pure black/white with a single accent |

> **This project was previously themed `apple`.** That direction was removed to keep the base
> neutral — `apple` now lives here as one *example* you can re-apply, not the shipped default.

## After applying — re-verify the gates

A brand changes values, so re-run the checks:

```bash
npm run tokens:build      # regenerate app/tokens.generated.css (reproducible)
npm run test-storybook    # render + axe (WCAG 2 AA) across every story
npm run audit             # 0 hardcoded-colour violations (rule #1)
```

If the brand also has a Figma file, `npm run figma:parity` confirms the design and the tokens
still agree (see [`code-to-figma-push.md`](code-to-figma-push.md)).

## Rules that survive any brand

- **Never hardcode colours in components.** Brands move token *values*; components keep reading
  semantic classes. A raw hex in a component is a bug the audit fails on.
- **Semantic must alias a primitive**, never hold a raw value. Keep the 3-tier discipline.
- **Verify WCAG 2.2 AA** for every text/UI pair after the re-point — a pretty brand that fails
  contrast is not done.
