# Spec Template — `{feature}.spec.ts`

Place file at: `playwright/e2e/{feature}.spec.ts`

## Standard CRUD Spec

```typescript
import { test, expect } from '../fixtures/base.fixture';
import { {Feature}Page } from '../pages/{Feature}Page';

// Mock data factory — define inline or import from mocks/{feature}.mock.ts
const mock{Feature} = (overrides: Partial<{Feature}Dto> = {}): {Feature}Dto => ({
  id: 1,
  name: 'Test {Feature}',
  createdAt: '2026-01-01T00:00:00Z',
  ...overrides,
});

test.describe('PROJ-#####: {Feature} management', () => {
  let featurePage: {Feature}Page;

  test.beforeEach(async ({ page }) => {
    // Intercept list endpoint
    await page.route('**/api/{feature}**', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            data: [mock{Feature}({ id: 1 }), mock{Feature}({ id: 2, name: 'Another {Feature}' })],
            success: true,
            message: null,
          }),
        });
      } else {
        await route.continue();
      }
    });

    featurePage = new {Feature}Page(page);
    await featurePage.goto();
  });

  // ── AC1: List ──────────────────────────────────────────────────────────────

  test('AC1: should display {feature} list on load @smoke', async () => {
    await expect(featurePage.heading).toBeVisible();
    await featurePage.expectRowCount(2);
    await featurePage.expectRowVisible('Test {Feature}');
  });

  test('AC1: should show empty state when no {feature} records exist @smoke', async ({ page }) => {
    await page.route('**/api/{feature}**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [], success: true, message: null }),
      });
    });

    await featurePage.goto();
    await featurePage.expectEmptyState();
  });

  // ── AC2: Search ────────────────────────────────────────────────────────────

  test('AC2: should filter results when searching @regression', async ({ page }) => {
    const searchRequest = page.waitForRequest(
      (req) => req.url().includes('/api/{feature}') && req.url().includes('search=')
    );

    await featurePage.search('Test');
    await searchRequest;
    // Assert filtered results rendered by the (already mocked) API
    await featurePage.expectRowVisible('Test {Feature}');
  });

  // ── AC3: Create ────────────────────────────────────────────────────────────

  test('AC3: should create a new {feature} via dialog @smoke', async ({ page }) => {
    await page.route('**/api/{feature}', async (route) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ data: mock{Feature}({ id: 3, name: 'New {Feature}' }), success: true }),
        });
      } else {
        await route.continue();
      }
    });

    await featurePage.create({ name: 'New {Feature}' });
    await featurePage.expectRowVisible('New {Feature}');
  });

  test('AC3: should show validation error when name is empty @regression', async () => {
    await featurePage.openCreateDialog();
    await featurePage.saveButton.click(); // Submit without filling in data
    await featurePage.expectDialogError('Name is required');
  });

  // ── AC4: Edit ──────────────────────────────────────────────────────────────

  test('AC4: should edit an existing {feature} @regression', async ({ page }) => {
    await page.route('**/api/{feature}/**', async (route) => {
      if (route.request().method() === 'PUT') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ data: mock{Feature}({ name: 'Updated {Feature}' }), success: true }),
        });
      } else {
        await route.continue();
      }
    });

    await featurePage.openEditForRow(0);
    await featurePage.fillAndSave({ name: 'Updated {Feature}' });
    await featurePage.expectRowVisible('Updated {Feature}');
  });

  // ── AC5: Delete ────────────────────────────────────────────────────────────

  test('AC5: should delete a {feature} after confirmation @regression', async ({ page }) => {
    await page.route('**/api/{feature}/**', async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({ status: 204 });
      } else {
        await route.continue();
      }
    });

    const initialCount = await featurePage.tableRows.count();
    await featurePage.deleteRow(0);
    await featurePage.expectRowCount(initialCount - 1);
  });
});
```

## Tagging Convention

| Tag | When to use |
|-----|-------------|
| `@smoke` | Critical happy-path tests — run on every PR |
| `@regression` | Full regression suite — run nightly |
| `@slow` | Tests > 10 s — excluded from fast feedback loops |
| `@a11y` | Accessibility-only tests |

## Rules

- Import page object from `../pages/{Feature}Page` — never use raw `page.getByTestId()` in spec
- Mock all API routes in `beforeEach` — tests must not depend on a running backend
- Each test covers exactly ONE acceptance criterion
- Test names format: `AC#: should {behavior} when {condition}` or `AC#: should {behavior}`
- Replace `PROJ-#####` with the real Jira ticket key
- `{Feature}Dto` type comes from the frontend's type definitions — import if available, inline otherwise
