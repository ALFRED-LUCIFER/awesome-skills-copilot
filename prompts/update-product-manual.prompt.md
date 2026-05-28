---
name: update-product-manual
description: H.O.M.E.R. — Update an existing Org product manual. Runs gap check, patches available data, reports remaining items
argument-hint: Optional path to manual HTML file
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [execute/getTerminalOutput, execute/runInTerminal, edit/editFiles, search/codebase]
---

# Update Product Manual

You are updating an existing product manual. Follow this workflow:

1. **Find the existing manual** in the workspace: `find . -name "*-manual.html" | head -5`
2. **Run gap check** using `#skill:product-doc-gap-checker` against the found HTML file
3. **Scan for fresh data** using the Phase 1 commands from `#skill:myorg-doc-template`
4. **Auto-patch** any gaps that can be filled from the codebase (new routes, updated OSS, new i18n keys)
5. **Re-generate PDF** after patching
6. **Re-run gap check** and present the final report

For gaps that cannot be auto-filled, list them as action items for the product owner.
