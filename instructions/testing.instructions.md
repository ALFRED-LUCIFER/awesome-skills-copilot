---
description: "Testing standards — coverage thresholds, patterns, and anti-patterns"
applyTo: "**/*.{test,spec}.{ts,tsx,cs}"
---

# Testing Standards

## Coverage Thresholds

| Layer | Minimum | Tool |
|-------|---------|------|
| Backend (.NET) | 95% | NUnit + Moq + MockQueryable |
| Frontend (React) | 90% | Vitest + React Testing Library |
| E2E (Cypress) | Critical paths | Cypress 13 + POM |
| E2E (Playwright) | Cross-browser | Playwright + POM |

## Unit Test Patterns

### .NET (NUnit)
- Use `[SetUp]` for common mocks, `[TestCase]` for parameterized data
- Mock repositories with MockQueryable for IQueryable chains
- Assert both success and error responses
- Test service methods independently from controller

### React (Vitest + RTL)
- Use `renderHook` for custom hook tests
- Use `screen.getByRole` over `getByTestId` when possible
- Test user interactions: click, type, submit
- Use mock factories for consistent test data

## E2E Patterns

### Page Object Model (POM)
- One page object per page/dialog
- Use `data-testid` selectors — never raw CSS selectors
- Keep selectors in page objects, assertions in specs
- Use fixtures for test data setup/teardown

### Anti-Patterns to Avoid
- ❌ `cy.get('.btn-primary')` — fragile CSS selector
- ❌ `cy.wait(5000)` — arbitrary wait
- ❌ Testing implementation details instead of behavior
- ❌ Shared mutable state between tests
