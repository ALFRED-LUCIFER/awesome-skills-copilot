# playwright-test-gen

> Generate Playwright test specs for Copilot Agent System web applications — page objects, fixtures, API mocking, and accessibility checks.

## Purpose

Provides templates and patterns for generating Playwright end-to-end tests with page objects, test fixtures, API interception, and `@axe-core/playwright` accessibility checks. Currently marked for **future use** — Cypress is the primary E2E framework.

## When to Use

- Cross-browser testing requirements
- Accessibility audits with axe-core
- Visual regression testing
- Cypress → Playwright migration planning

## Templates

- **Page Object Pattern** — Encapsulated selectors and actions
- **Test Spec** — API mocking, assertions, screenshot comparison
- **Fixtures** — Shared test setup and teardown
- **Accessibility** — axe-core integration for WCAG 2.2 AA

## Dependencies

- Playwright
- `@axe-core/playwright`

## Used By

- Future E2E testing workflows
