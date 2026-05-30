# Page Object Template — `{Feature}Page.ts`

Place file at: `playwright/pages/{Feature}Page.ts`

```typescript
import { type Locator, type Page, expect } from '@playwright/test';

/**
 * Page Object for the {Feature} page.
 * All locators use data-testid selectors via page.getByTestId().
 * No raw selectors are allowed in spec files — all interactions go through this class.
 */
export class {Feature}Page {
  readonly page: Page;

  // ── Locators ────────────────────────────────────────────────────────────────
  readonly heading: Locator;
  readonly createButton: Locator;
  readonly table: Locator;
  readonly tableRows: Locator;
  readonly searchInput: Locator;
  readonly loadingSpinner: Locator;
  readonly emptyStateMessage: Locator;

  // ── Dialog locators ──────────────────────────────────────────────────────────
  readonly dialog: Locator;
  readonly dialogTitle: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly deleteButton: Locator;
  readonly confirmDeleteButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // List view
    this.heading         = page.getByRole('heading', { name: /{feature}/i });
    this.createButton    = page.getByTestId('{feature}-create-button');
    this.table           = page.getByTestId('{feature}-table');
    this.tableRows       = page.getByTestId('{feature}-table-row');
    this.searchInput     = page.getByTestId('{feature}-search-input');
    this.loadingSpinner  = page.getByTestId('{feature}-loading');
    this.emptyStateMessage = page.getByTestId('{feature}-empty-state');

    // Create / Edit dialog
    this.dialog              = page.getByRole('dialog');
    this.dialogTitle         = page.getByTestId('{feature}-dialog-title');
    this.nameInput           = page.getByTestId('{feature}-name-input');
    this.saveButton          = page.getByTestId('{feature}-save-button');
    this.cancelButton        = page.getByTestId('{feature}-cancel-button');

    // Delete confirmation
    this.deleteButton        = page.getByTestId('{feature}-delete-button');
    this.confirmDeleteButton = page.getByTestId('{feature}-confirm-delete-button');
  }

  // ── Navigation ───────────────────────────────────────────────────────────────

  async goto() {
    await this.page.goto('/{feature}');
    await expect(this.heading).toBeVisible();
    await this.waitForTableReady();
  }

  // ── Waits ────────────────────────────────────────────────────────────────────

  /** Wait for the table to finish loading (spinner gone + table visible). */
  async waitForTableReady() {
    await this.loadingSpinner.waitFor({ state: 'hidden' });
    await expect(this.table).toBeVisible();
  }

  // ── Actions ──────────────────────────────────────────────────────────────────

  async openCreateDialog() {
    await this.createButton.click();
    await expect(this.dialog).toBeVisible();
  }

  async fillAndSave(data: { name: string; [key: string]: string }) {
    await this.nameInput.fill(data.name);
    for (const [field, value] of Object.entries(data)) {
      if (field === 'name') continue;
      await this.page.getByTestId(`{feature}-${field}-input`).fill(value);
    }
    await this.saveButton.click();
    await expect(this.dialog).toBeHidden();
  }

  async create(data: { name: string; [key: string]: string }) {
    await this.openCreateDialog();
    await this.fillAndSave(data);
    await this.waitForTableReady();
  }

  async search(query: string) {
    await this.searchInput.fill(query);
    await this.page.keyboard.press('Enter');
    await this.waitForTableReady();
  }

  async clearSearch() {
    await this.searchInput.clear();
    await this.page.keyboard.press('Enter');
    await this.waitForTableReady();
  }

  async openEditForRow(rowIndex: number) {
    await this.tableRows.nth(rowIndex).getByTestId('{feature}-edit-button').click();
    await expect(this.dialog).toBeVisible();
  }

  async deleteRow(rowIndex: number) {
    await this.tableRows.nth(rowIndex).getByTestId('{feature}-delete-button').click();
    await this.confirmDeleteButton.click();
    await this.waitForTableReady();
  }

  // ── Assertions ───────────────────────────────────────────────────────────────

  async expectRowCount(count: number) {
    await expect(this.tableRows).toHaveCount(count);
  }

  async expectRowVisible(text: string) {
    await expect(this.table.getByText(text)).toBeVisible();
  }

  async expectEmptyState() {
    await expect(this.emptyStateMessage).toBeVisible();
  }

  async expectDialogError(message: string) {
    await expect(this.page.getByTestId('{feature}-dialog-error')).toContainText(message);
  }
}
```

## Rules

- One class per page/feature — never combine two pages in one file
- All locators defined in the constructor — no inline `page.getByTestId()` in methods
- Action methods are named by intent (`create`, `search`, `deleteRow`) — not by UI element (`clickButton`)
- Assertion helpers (`expectRowCount`) live here — specs call them, never assert raw locators
- Replace all `{Feature}` (PascalCase) and `{feature}` (camelCase/kebab) with the actual entity name
