---
name: product-flow-screenshots
description: >
  Generate or update Cypress productFlowScreenshots.spec.cy.ts — a documentation screenshot
  walkthrough of every app screen. Use when: creating product screenshots, updating screenshot
  flow, adding new screens to visual tour, PO documentation, user manual screenshots,
  sprint review captures.
user-invocable: true
---

# Product Flow Screenshots

## When to Use

- Creating publication-quality screenshots for product documentation
- Updating screenshot flow after new screens added
- Sprint review captures or PO demos
- User manual visual walkthroughs

## Rules

1. **Single file**: always `cypress/e2e/productFlowScreenshots.spec.cy.ts` — never create a second spec
2. Numbered `it()` blocks — sequential order matching user flow
3. Login once in `before()` — reuse session across all screenshots
4. Set viewport to `1920x1080` for consistent output
5. Use existing page objects/selectors from `cypress/pageObjects/` or `cypress/support/`
6. Wait for loading states to resolve before capturing (`cy.get('[data-loading]').should('not.exist')`)
7. Screenshots saved to `cypress/screenshots/productFlowScreenshots/` (Cypress default)
8. Each `it()` block: navigate → interact (open dialog/tab if needed) → `cy.screenshot('NN-ScreenName')`
9. If file exists: present current screen inventory to user before modifying
10. Include both page views AND open dialogs/modals as separate screenshots

## Steps

1. **Check existing state** — does `cypress/e2e/productFlowScreenshots.spec.cy.ts` exist? If yes, parse `it()` blocks and present inventory
2. **Discover screens** — scan `src/Router.tsx` or `src/routes.tsx` for routes; scan for Dialog/Modal components
3. **Inspect Cypress infra** — find selectors, page objects, login method, config (viewport, baseUrl)
4. **Confirm with user** — present discovered screens, ask which to include and in what order
5. **Generate/update spec** — write numbered `it()` blocks with navigation, interaction, and `cy.screenshot()`
6. **Validate** — ensure Cypress config has `screenshotsFolder` set, all selectors resolve

## File Structure

```typescript
describe('Product Flow Screenshots', () => {
  before(() => { /* login + viewport setup */ });
  
  it('01 - Dashboard', () => { /* nav + screenshot */ });
  it('02 - [Page]', () => { /* nav + screenshot */ });
  it('03 - [Page] - [Dialog]', () => { /* open dialog + screenshot */ });
});
```

## Reference

See [./examples.md](./examples.md) for complete spec template, interaction patterns, and multi-product examples.
