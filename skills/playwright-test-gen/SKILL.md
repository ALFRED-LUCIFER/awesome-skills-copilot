---
name: playwright-test-gen
description: Generate Playwright test specs for web applications — page objects, fixtures, API mocking, and accessibility checks
---

# Playwright Test Generation

## When to Use

- Cross-browser E2E testing (Chromium, Firefox, WebKit)
- Accessibility audits with `@axe-core/playwright`
- Visual regression tests (screenshot comparison)
- API request interception and mocking
- Migrating from Cypress to Playwright

## Rules

1. Page Object Model: one class per page/feature in `pages/{Feature}Page.ts`
2. Use `data-testid` selectors via `page.getByTestId()` — never CSS class selectors
3. Use role-based locators (`getByRole`, `getByLabel`) for a11y-friendly selectors
4. Fixtures: extend `test` with custom fixtures for auth, API mocking, page objects
5. API mocking: `page.route()` to intercept and mock backend responses
6. Each spec: arrange (navigate + mock) → act (interact) → assert (expect)
7. Accessibility: include axe-core scan in at least one test per page
8. Visual regression: `expect(page).toHaveScreenshot()` for critical UI states
9. Parallel execution: tests must be independent (no shared state between specs)
10. Replace `{Feature}/{feature}` with entity name (PascalCase/camelCase)

## Steps

1. **Create page object** — `pages/{Feature}Page.ts` with locators + action methods
2. **Create fixtures** — `fixtures/{feature}.fixture.ts` extending base test
3. **Create API mocks** — `mocks/{feature}.mock.ts` with typed response data
4. **Write CRUD specs** — `{feature}.spec.ts` covering list, create, edit, delete flows
5. **Add a11y test** — axe-core scan within spec or dedicated `{feature}.a11y.spec.ts`
6. **Add visual test** — screenshot assertions for key states
7. **Validate** — `npx playwright test --project=chromium` passes

## File Structure

```
e2e/
├── pages/{Feature}Page.ts
├── fixtures/{feature}.fixture.ts
├── mocks/{feature}.mock.ts
├── specs/{feature}.spec.ts
└── specs/{feature}.a11y.spec.ts
```

## Reference

See [./examples.md](./examples.md) for complete page object, fixture, mock, and spec templates.
