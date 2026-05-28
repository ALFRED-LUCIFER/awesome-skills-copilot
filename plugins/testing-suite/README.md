# Testing Suite Plugin

Complete testing toolkit covering unit tests, component tests, and E2E tests.

## Included Agents

| Agent | Purpose |
|-------|---------|
| `@backend-tests` | NUnit + Moq test writer (≥95% coverage) |
| `@frontend-tests` | Vitest + React Testing Library (≥90% coverage) |
| `@e2e-tests` | Cypress E2E with strict POM |
| `@playwright-e2e` | Playwright E2E — cross-browser, accessibility |

## Included Skills

| Skill | Purpose |
|-------|---------|
| `csharp-nunit` | NUnit test templates and patterns |
| `react-vitest` | Vitest + RTL test templates |
| `playwright-test-gen` | Playwright test spec generation |
| `product-flow-screenshots` | Automated screenshot flows |

## Usage

```
# Generate backend tests
@backend-tests write tests for OrderController

# Generate frontend tests
@frontend-tests write tests for useOrderController hook

# Generate Playwright E2E
@playwright-e2e write tests for the order creation flow

# Generate Cypress E2E
@e2e-tests write tests for the login page
```
