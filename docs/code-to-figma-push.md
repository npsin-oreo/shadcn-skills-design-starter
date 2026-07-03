# Code → Figma Push — Runbook

> Direction: **code is the source of truth → write design INTO Figma**. This is the reverse of the
> "Figma MCP Integration Rules" in [CLAUDE.md](../CLAUDE.md) (which pull Figma → code). The audit
> pipeline (`npm run audit`) is **read-only, one-way** (Figma → docs); it never writes to Figma.
> There is **no automatic reverse sync** — a push is an agent-driven, deliberate operation.

Figma file: **`aZs8dlgg9wlcmEM0lFd3Zw`** ("@shadcn/ui Learning") · team owner **napasin.int@gmail.com**.

---

## When to run this

- Code has a component / variant / state / token that Figma lacks, and you want Figma to match code.
- A token value changed in `tokens/*.tokens.json` and the bound Figma **Variable** should follow.
- You are standing up (or repairing) the Figma library so `get_design_context` returns real
  component structure.

**Do not** run it to "fix" an audit finding before confirming the drift is real — see
[Pitfalls](#pitfalls). Often the docs, not Figma, are what's behind.

---

## Preconditions (check every time)

1. **Auth = MCP OAuth, not the REST PAT.** Writes go through the Figma MCP (`use_figma`), which uses
   the OAuth connection. The `.mcp.json` REST PAT is **dead (403)** and irrelevant to writes — but
   it also means the audit can't cross-check live, so diff against the cached snapshot or a fresh PAT.
2. **Confirm identity + seat** with `mcp__figma__whoami` → must be **napasin.int@gmail.com, Full/Dev
   seat**. MCP seat limits are **per team that owns the file**: View/Collab = ~6 tool calls/month;
   Dev/Full = 200/day. `whoami` itself is exempt. If it shows a different account, re-auth via
   `/mcp` → server "figma".
3. **Load the skills first (MANDATORY).** Before any `use_figma` call, invoke the **`figma-use`**
   skill. For building library components/variables, also load **`figma-generate-library`**; for a
   full page/screen, **`figma-generate-design`**. Skipping `figma-use` causes hard-to-debug failures.
4. **Know what can't be automated** — see [Limits](#limits).

---

## The push flow

Work **incrementally** — one component / token group at a time, verify, then continue. Never do a
wholesale replace of the file.

1. **Diff first.** Establish what code has that Figma lacks. Use `npm run audit` (or MCP
   `get_metadata` on the target page) to list current Figma variants, then compare to
   `components/ui/*`, `components/docs/registry.tsx`, and `tokens/*.tokens.json`.
2. **Tokens before components.** If new/changed tokens are involved, push **Variables first** — a
   component bound to a missing variable can't be built correctly. See [Token mapping](#token--figma-variable-mapping).
3. **Load `figma-use`** (+ `figma-generate-library`), then **`use_figma`** to create/update nodes:
   component set → variant nodes (`prop=value` names) → bind fills/typography/spacing to Variables.
4. **Match the 8 states** the code component actually implements (default, hover, focus-visible,
   active, disabled, loading, `aria-invalid`, checked/selected as applicable). Only push states the
   code truly has — don't invent decorative variants.
5. **Verify** with `mcp__figma__get_screenshot` on the node you wrote, and re-check
   `get_variable_defs` to confirm bindings resolve to the intended semantic tokens.
6. **Record** what you pushed (and re-run `npm run audit` if variant coverage changed).

---

## Token → Figma Variable mapping

The 3-tier DTCG tokens map 1:1 to Figma Variable collections/modes. **Names match** (`tokens/` and
the Figma file share `variables-export.json`).

| Tier (`tokens/*.tokens.json`) | Figma Variable | Rule |
|---|---|---|
| primitive (`zinc/400`, `blue/500`) | `tw-colors` primitives collection | raw values live **only** here |
| semantic (`background`, `primary`, `muted-foreground`) | `shadcn-ui` semantic collection | **must alias a primitive** — never hold a raw value |
| component-tier (`tokens/*.tokens.json` blocks) | bound on the component node | reuse semantic; pure compositions reuse constituents |

Governance: **apply color to a node only via an alias/semantic Variable**, never a raw paint. When a
token value changes, rebind the Variable (`setBoundVariableForPaint` works on text/fills **without**
loading the font). Light + dark = Variable **modes** on the same collection.

---

## Limits (what a push can't do)

- **Text `characters` can't be edited via automation.** The file's font is **Google Sans**, which
  the `use_figma` runtime can't load, so setting/renaming text content fails. Copy fixes (titles,
  descriptions, labels) must be done **by hand in the Figma app**. *Structural* changes — creating
  nodes, variants, binding Variables, fills, auto-layout — are fine.
- **Published-library remnants can't be purged** from this file via the Plugin API (inert empty
  collection shells persist).
- **No CI hook.** There is intentionally no `npm run push:figma`; a push is agent-driven so a human
  reviews scope before a shared file is written.

---

## Pitfalls

- **Audit `Type=`/`Size=` attribution is per-page, not per-component.** The variant audit groups
  every `prop=value` node on a Figma *page* under that page's slug. A finding like "spinner missing
  `Type=Outline/Secondary`" was a **false positive**: those were **Button** variants in a
  "spinner-inside-a-loading-button" example composed on the spinner page — not spinner types. **Open
  the Figma node (`get_screenshot`/`get_design_context`) and confirm the variant truly belongs to
  the component before pushing anything.**
- **Don't fabricate variants to satisfy the audit.** If code genuinely lacks a Figma variant, the
  fix is a product decision (implement in code, or drop it from Figma) — not a fake node.
- **Semantic Variables must alias, never hold raw hex.** A push that binds a node straight to a
  primitive (or a literal color) violates color governance.

---

## Related

- [CLAUDE.md](../CLAUDE.md) → "Figma MCP Integration Rules" (the Figma → code pull direction)
- [AGENTS.md](../AGENTS.md) → "## Figma"
- [docs/component-audit.md](./component-audit.md) — the 4-dimension coverage matrix
- Skills: `figma-use` (prerequisite), `figma-generate-library`, `figma-generate-design`,
  `figma-integration`, `figma-code-connect`
