---
name: product-flow-screenshots
description: "Generate or update productFlowScreenshots.cy.ts — capture publication-quality screenshots of every app screen for documentation, user manuals, and sprint reviews"
argument-hint: "Describe which screens to add/update, or say 'discover all' to auto-detect"
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [search/codebase, edit/editFiles, execute/getTerminalOutput, execute/runInTerminal, read/terminalLastCommand, read/terminalSelection, todo, vscode/memory, vscode/askQuestions]
---

Generate or update `cypress/e2e/productFlowScreenshots.cy.ts` — the product's visual screenshot tour.

**Request**: `${input:request:Describe screens to add/update, or say 'discover all' to auto-detect all screens}`

---

## Step 1 — Load the skill

Read the file `skills/product-flow-screenshots/SKILL.md` for the complete workflow rules, helpers, and scaffold template.

---

## Step 2 — Check existing state (Phase 1 from skill)

Search for `cypress/e2e/productFlowScreenshots.cy.ts` in the workspace.

- **File exists** → Read it, parse the numbered `it()` blocks, present the screen inventory to the user, and ask what they want to change (add/remove/reorder/update/regenerate).
- **File does not exist** → Proceed to full discovery (Phase 2 from skill).

---

## Step 3 — Discover Cypress infrastructure

Inspect the workspace to find:
- **Selectors & Page Objects**: `cypress/pageObjects/`, `cypress/pages/`, `cypress/support/`
- **Login method**: `cypress/methods/`, `cypress/support/commands.ts`
- **Config**: `cypress.config.ts` (viewport, baseUrl, screenshotFolder)
- **Routes**: `src/Router.tsx`, `src/routes.tsx`, `src/App.tsx`
- **Pages**: `src/pages/`, `src/views/`, `src/screens/`
- **Dialogs**: Search for `Dialog`, `Modal`, `PlatformDialog`, `FormDialog` in `src/`

Present ALL discovered screens with routes to the user for confirmation before generating.

---

## Step 4 — Generate or update

Follow the skill rules strictly:
- **Single file**: `cypress/e2e/productFlowScreenshots.cy.ts` — never create a second file
- **All helpers required**: `forceMonitorViewport`, `waitForLoading`, `waitForNetworkIdle`, `shotPage`, `shotDialog`, `closeDialogIfOpen`
- **One `it()` per screen**, numbered sequentially (01, 02, 03...)
- **Pages** use `capture: 'fullPage'`; **Dialogs** use `capture: 'viewport'`
- **Viewport**: 1920×1080 triple-layer enforcement
- **Graceful skip** for missing data — never fail on empty state

When updating, preserve all working `it()` blocks and renumber after changes.

---

## Step 5 — Verify and remind

After generating, remind the user:

```bash
npx cypress run --spec "cypress/e2e/productFlowScreenshots.cy.ts"
```

Output folder: `cypress/screenshots/productFlowScreenshots.cy.ts/product-flow/`
