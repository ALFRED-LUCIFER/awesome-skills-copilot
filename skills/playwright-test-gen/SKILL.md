---
name: playwright-test-gen
description: Generate Playwright test specs for Copilot Agent System web applications — page objects, fixtures, API mocking, and accessibility checks
---

# Playwright Test Generation Skill

Generate end-to-end tests using Playwright for Copilot Agent System React frontends. Complements existing Cypress E2E tests with cross-browser coverage and accessibility testing.

## When to Use

- Cross-browser testing (Chromium, Firefox, WebKit)
- Accessibility audits (built-in `@axe-core/playwright`)
- Visual regression tests (screenshot comparison)
- API request interception (more powerful than Cypress)
- When the team decides to migrate from Cypress to Playwright

## Page Object Pattern

```typescript
// pages/{Feature}Page.ts
import { type Locator, type Page, expect } from '@playwright/test';

export class {Feature}Page {
  readonly page: Page;
  readonly heading: Locator;
  readonly createButton: Locator;
  readonly table: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: /{feature}/i });
    this.createButton = page.getByTestId('{feature}-create-button');
    this.table = page.getByTestId('{feature}-table');
    this.searchInput = page.getByTestId('{feature}-search-input');
  }

  async goto() {
    await this.page.goto('/{feature}');
    await expect(this.heading).toBeVisible();
  }

  async create(data: Record<string, string>) {
    await this.createButton.click();
    for (const [field, value] of Object.entries(data)) {
      await this.page.getByTestId(`{feature}-${field}-input`).fill(value);
    }
    await this.page.getByTestId('{feature}-save-button').click();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
  }

  async getRowCount(): Promise<number> {
    return this.table.getByRole('row').count() - 1; // minus header
  }
}
```

## Test Spec Pattern

```typescript
// tests/{feature}.spec.ts
import { test, expect } from '@playwright/test';
import { {Feature}Page } from '../pages/{Feature}Page';

test.describe('{Feature} CRUD', () => {
  let featurePage: {Feature}Page;

  test.beforeEach(async ({ page }) => {
    // Mock API responses
    await page.route('**/api/{feature}/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [], success: true, message: null }),
      });
    });

    featurePage = new {Feature}Page(page);
    await featurePage.goto();
  });

  test('displays the {feature} list', async () => {
    await expect(featurePage.heading).toBeVisible();
    await expect(featurePage.table).toBeVisible();
  });

  test('creates a new {feature}', async () => {
    await featurePage.create({ name: 'Test {Feature}' });
    await expect(featurePage.page.getByText('Test {Feature}')).toBeVisible();
  });

  test('search filters results', async ({ page }) => {
    await featurePage.search('test');
    // Verify API was called with search param
    const request = page.waitForRequest((req) =>
      req.url().includes('/api/{feature}') && req.url().includes('search=test')
    );
    await expect(request).toBeTruthy();
  });
});
```

## Accessibility Test Pattern

```typescript
// tests/{feature}-a11y.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { {Feature}Page } from '../pages/{Feature}Page';

test.describe('{Feature} Accessibility', () => {
  test('meets WCAG 2.2 AA standards', async ({ page }) => {
    const featurePage = new {Feature}Page(page);
    await featurePage.goto();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag22aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });
});
```

## Configuration

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['json', { outputFile: 'test-results.json' }]],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

## Selectors — data-testid First

Always use `data-testid` selectors (GUARDRAILS § O6):
```typescript
// ✅ Good
page.getByTestId('order-save-button')
page.getByRole('heading', { name: /orders/i })

// ❌ Bad — fragile selectors
page.locator('.MuiButton-root')
page.locator('#save-btn')
page.locator('button:nth-child(2)')
```

## Jira Integration

When generating tests from Jira tickets, map Gherkin scenarios to Playwright tests:
```
Scenario: User creates a new order
  → test('creates a new order', async ({ page }) => { ... })
```
