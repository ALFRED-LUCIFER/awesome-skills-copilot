---
name: product-flow-screenshots
description: >
  Generate or update Cypress productFlowScreenshots.spec.cy.ts — a documentation screenshot
  walkthrough of every app screen. Use when: creating product screenshots, updating screenshot
  flow, adding new screens to visual tour, PO documentation, user manual screenshots,
  sprint review captures.
user-invocable: true
---

# Product Flow Screenshots — Universal Skill

Generate or **update** `cypress/e2e/productFlowScreenshots.spec.cy.ts` for any product.
This file captures publication-quality screenshots of every user-facing screen
for documentation, user manuals, and sprint reviews.

---

## CRITICAL: Single File Rule

Every product uses **exactly one file**: `cypress/e2e/productFlowScreenshots.spec.cy.ts`.
Never create a second screenshot spec. Always update the existing one.

---

## Phase 1 — Check Existing State

### 1.1 Does the file already exist?

Search for `cypress/e2e/productFlowScreenshots.spec.cy.ts`.

- **EXISTS** → Read it. Parse the numbered `it()` blocks to build a screen inventory.
  Present to the user:
  > Your current screenshot flow has these screens:
  > 01 – Dashboard
  > 02 – ...
  >
  > What do you want to do?
  > - Add new screens (which ones?)
  > - Remove screens
  > - Reorder screens
  > - Update interactions for existing screens
  > - Full regeneration

- **DOES NOT EXIST** → Proceed to Phase 2 (full discovery).

### 1.2 Inspect Cypress infrastructure

Find and read these files (they vary by product):

| What | Where to look |
|---|---|
| Selectors | `cypress/pageObjects/Selector.ts`, `cypress/support/selectors.ts` |
| Page Objects | `cypress/pages/*.ts`, `cypress/support/pages/*.ts` |
| Login method | `cypress/methods/*.ts`, `cypress/support/commands.ts` |
| Config | `cypress.config.ts` — viewport, baseUrl, screenshotFolder |
| Routes | `src/Router.tsx`, `src/routes.tsx`, `src/App.tsx` |
| Pages | `src/pages/`, `src/views/`, `src/screens/` |
| Dialogs | Search for `Dialog`, `Modal`, `PlatformDialog`, `FormDialog` in `src/` |

### 1.3 Present discovered screens

List ALL discovered pages and dialogs with routes and ask the user to confirm:

> I found these screens in your app:
> 1. Dashboard (`/`)
> 2. [Page] (`/route`) — has dialog: [DialogName]
> ...
> Which to include? Any order preference? Any I missed?

---

## Phase 2 — Generate or Update

### Fixed filename

```
cypress/e2e/productFlowScreenshots.spec.cy.ts
```

### When UPDATING an existing file

1. Preserve all working `it()` blocks that the user wants to keep
2. Renumber screens sequentially (01, 02, 03...) after adds/removes
3. Update the JSDoc coverage list at the top to match
4. Keep all helper functions (`forceMonitorViewport`, `waitForLoading`, etc.) intact
5. Only modify the specific `it()` blocks being added/changed/removed

### Scaffold structure (for new files or full regeneration)

```typescript
/**
 * Product Visual Tour — [PRODUCT NAME] Screenshots
 *
 * Screens covered:
 *   01 – [Screen Name]
 *   02 – [Screen Name]
 *   ...
 *
 * Run:
 *   npx cypress run --spec "cypress/e2e/productFlowScreenshots.spec.cy.ts"
 *
 * Output:
 *   cypress/screenshots/productFlowScreenshots.spec.cy.ts/product-flow/
 */

// ─── Constants ─────────────────────────────────────────────────────
const MONITOR_WIDTH = 1920;
const MONITOR_HEIGHT = 1080;

// ─── Helpers (DO NOT MODIFY — shared across all products) ──────────

/** Triple-layer viewport enforcement — config alone is unreliable */
const forceMonitorViewport = () => {
  cy.viewport(MONITOR_WIDTH, MONITOR_HEIGHT);
  cy.wait(400);
};

/** Wait for ALL loading indicators — spinners, progress bars, skeletons */
const waitForLoading = (timeout = 20000) => {
  const indicators = [
    '.MuiCircularProgress-root',   // Spinners
    '.MuiLinearProgress-root',     // Progress bars
    '.MuiSkeleton-root',           // Placeholder shimmers
    // For non-MUI apps, also check:
    // '.ant-spin', '.ant-skeleton',           // Ant Design
    // '.chakra-spinner', '.chakra-skeleton',   // Chakra UI
    // '[data-testid="loading"]',              // Custom
    // '.spinner', '.loading-overlay',         // Generic
  ];
  indicators.forEach((sel) => {
    cy.get('body').then(($body) => {
      if ($body.find(sel).length > 0) {
        cy.get(sel, { timeout }).should('not.exist');
      }
    });
  });
};

/** Wait for network idle — no pending XHR/fetch for 1 second */
const waitForNetworkIdle = (waitMs = 1000) => {
  cy.intercept('**').as('networkIdle');
  cy.wait(waitMs);
};

/** Capture full scrollable page */
const shotPage = (name: string) => {
  forceMonitorViewport();
  cy.scrollTo('top', { ensureScrollable: false });
  cy.wait(150);
  cy.screenshot(`product-flow/${name}`, {
    overwrite: true,
    capture: 'fullPage',
  });
};

/** Capture viewport only — for dialogs (position: fixed) */
const shotDialog = (name: string, dialogTestId: string) => {
  forceMonitorViewport();
  cy.get(`[data-testid="${dialogTestId}"]`).should('be.visible');
  cy.screenshot(`product-flow/${name}`, {
    overwrite: true,
    capture: 'viewport',
  });
};

/** Safe dialog close — fallback chain → specific → generic → Escape */
const closeDialogIfOpen = () => {
  cy.get('body').then(($body) => {
    const closeButtons = [
      '[data-testid$="-secondary-btn"]',
      '[data-testid="close-button"]',
      '[data-testid="cancel-button"]',
      'button[aria-label="Close"]',
      '.MuiDialog-root button.MuiIconButton-root',
    ];
    for (const sel of closeButtons) {
      if ($body.find(sel).length) {
        cy.get(sel).first().click({ force: true });
        return;
      }
    }
    cy.get('body').type('{esc}');
  });
};

// ─── Suite ─────────────────────────────────────────────────────────
describe('Product Visual Tour – [PRODUCT NAME] Screenshots', () => {
  before(() => {
    Cypress.config('screenshotOnRunFailure', false);
    forceMonitorViewport();
    // Login once — use product-specific login method
  });

  beforeEach(() => {
    forceMonitorViewport();
    // Re-auth if session expired
  });

  after(() => {
    // Clean auto-named failure shots
    cy.exec(
      'find cypress/screenshots/productFlowScreenshots.spec.cy.ts -maxdepth 1 -name "*.png" -delete 2>/dev/null || true',
      { failOnNonZeroExit: false },
    );
  });

  it('01 – [Screen Name]', () => {
    cy.visit('/route');
    forceMonitorViewport();
    waitForLoading();
    waitForNetworkIdle();
    shotPage('01-screen-name');
  });

  // one it() per screen — numbered sequentially
});
```

Detect which UI framework the product uses and include the right loading selectors.

---

## Rules — Apply ALL of These

### RULE 1: Viewport enforcement (1920×1080)

**Problem:** `viewportWidth` config alone is unreliable. Electron window may be smaller, causing down-scaling. Responsive breakpoints may not trigger.

**Solution:** Triple-layer enforcement — call `forceMonitorViewport()` in ALL of: `before()`, `beforeEach()`, after every `cy.visit()`, before every screenshot.

### RULE 2: Wait for ALL loading indicators

**Problem:** Only checking spinners misses skeletons and progress bars.

**Solution:** `waitForLoading()` checks spinners + progress bars + skeletons. Detect which UI framework the product uses and include the right selectors.

### RULE 3: Two capture modes — Pages vs Dialogs

**Problem:** Dialogs use `position: fixed`. `capture: 'fullPage'` stitches multiple viewport slices → dialogs appear duplicated or offset.

| Type | Capture | Why |
|---|---|---|
| Page | `fullPage` | Content below fold included |
| Dialog | `viewport` | Fixed-position centered, no duplication |

### RULE 4: Network idle

Always call `waitForNetworkIdle()` after `waitForLoading()`, before every screenshot.

### RULE 5: Test isolation

Each `it()` block is independent. Do not rely on state from previous `it()` blocks.

### RULE 6: One `it()` per screen

Failure isolation. Each screen gets its own `it()` block. If one screen fails, the rest continue.

### RULE 7: Safe dialog close

Use `closeDialogIfOpen()` with fallback chain — specific test-id → generic close → Escape key.

### RULE 8: Graceful skip for missing data

```typescript
cy.get('body').then(($body) => {
  if ($body.find('[data-testid="edit-button"]').length === 0) {
    cy.log('⚠️ No data – skipping screenshot');
    return;
  }
  // proceed with interaction + screenshot...
});
```

### RULE 9: Naming convention

Two-digit prefix. Kebab-case. All under `product-flow/` subfolder.

```
product-flow/01-dashboard.png
product-flow/02-order-list.png
product-flow/03-order-detail.png
product-flow/04-create-dialog.png
```

### RULE 10: Per-screen sequence

```typescript
it('NN – Screen Name', () => {
  cy.visit('/route');
  forceMonitorViewport();
  // pageObject.waitForPageLoad();  // if page object exists
  // interact...
  waitForLoading();
  waitForNetworkIdle();
  shotPage('NN-screen-name');          // OR shotDialog('NN-name', 'testid');
  closeDialogIfOpen();                 // if dialog was opened
});
```

---

## ⛔ DO NOT

| DO NOT | DO INSTEAD |
|---|---|
| Create a second screenshot spec file | Update `productFlowScreenshots.cy.ts` |
| Use `fullPage` for dialogs | Use `viewport` — dialogs are `position: fixed` |
| Only wait for spinners | Wait for ALL: spinner + progress bar + skeleton |
| Trust viewport config alone | `cy.viewport()` + 400ms settle before every shot |
| Use `cy.wait(500)` for network | Use `cy.wait(1000)` minimum |
| Put all screenshots in one `it()` | One `it()` per screen |
| Skip `scrollTo('top')` on pages | Always scroll top before `fullPage` |
| Hardcode one close selector | Fallback chain → specific → generic → Escape |
| Assume seed data exists | Graceful `$body.find()` skip |
| Change the filename | Always `productFlowScreenshots.cy.ts` |
| Remove helpers when updating | Keep all shared helpers intact |
| Forget to register in specPattern | Check `cypress.config.ts` — add explicit entry if array-based |
| Skip `before:browser:launch` check | Always verify/add the 1920×1080 browser launch handler in `cypress.config.ts` |

---

## Phase 3 — Register in cypress.config.ts

### 3.1 Check if specPattern uses an explicit list

Read `cypress.config.ts` (or the config file referenced in the root, e.g. `cypress/config/*.ts`).

**Pattern A — glob string** (e.g. `specPattern: 'cypress/e2e/**/*.cy.ts'`):
- `productFlowScreenshots.cy.ts` is already matched. **No change needed.**
- Tell the user: `cypress.config.ts` glob already covers the file — no edit required.

**Pattern B — explicit array** (e.g. `specPattern: ['cypress/e2e/foo.cy.ts', ...]`):
- `productFlowScreenshots.cy.ts` **must be added** to the array or Cypress will not find it.
- Append it at the end of the array under a `// Phase 6: PO visual tour` comment:

```typescript
// Phase 6: PO visual tour (screenshots for user manual)
'cypress/e2e/productFlowScreenshots.cy.ts',
```

### 3.2 Check for `before:browser:launch` viewport enforcement

Read `cypress.config.ts` and check whether `extendSetupNodeEvents` (or `setupNodeEvents`) already contains a `before:browser:launch` handler that sets `--window-size=1920,1080`.

**If MISSING**, add the following block inside the existing `extendSetupNodeEvents` (or `setupNodeEvents`) callback. If neither exists, create `extendSetupNodeEvents`:

```typescript
extendSetupNodeEvents: (on) => {
  on('before:browser:launch', (browser, launchOptions) => {
    const width = 1920;
    const height = 1080;

    if (browser.family === 'chromium' && browser.name !== 'electron') {
      launchOptions.args.push(`--window-size=${width},${height}`);
      launchOptions.args.push('--window-position=0,0');
      launchOptions.args.push('--force-device-scale-factor=1');
    }

    if (browser.name === 'electron') {
      launchOptions.preferences.width = width;
      launchOptions.preferences.height = height;
    }

    if (browser.family === 'firefox') {
      launchOptions.args.push(`--width=${width}`);
      launchOptions.args.push(`--height=${height}`);
    }

    return launchOptions;
  });
},
```

**If PRESENT**, verify it sets `1920×1080` — update the values if they differ.

> This is the **fourth layer** of viewport enforcement alongside `cy.viewport()` in the spec. Without it, Electron and some Chromium builds launch at a smaller window size, causing screenshots to be down-scaled or to hit mobile breakpoints.

### 3.3 Verification step

After adding the file, confirm Cypress recognises it:

```bash
npx cypress run --spec "cypress/e2e/productFlowScreenshots.cy.ts" --headless
```

Expected output: `1 spec found`, no `Can't run because no spec files were found` error.

---

## Output Checklist

- [ ] File: `cypress/e2e/productFlowScreenshots.cy.ts`
- [ ] `cypress.config.ts` specPattern includes the file (glob match OR explicit entry added)
- [ ] `cypress.config.ts` has `before:browser:launch` handler enforcing 1920×1080 for Chromium, Electron, and Firefox (added if missing)
- [ ] JSDoc header with coverage list + run command
- [ ] All helpers present (`forceMonitorViewport`, `waitForLoading`, `waitForNetworkIdle`, `shotPage`, `shotDialog`, `closeDialogIfOpen`)
- [ ] One `it()` per screen, numbered sequentially
- [ ] Screenshots in `product-flow/` subfolder
- [ ] Remind user: `npx cypress run --spec "cypress/e2e/productFlowScreenshots.cy.ts"`

---

## Cross-Product Compatibility

| Scenario | What happens |
|---|---|
| New product, no file exists | Full discovery → asks user to confirm screens → generates complete file |
| Existing file, user says "add print dialog" | Reads existing file → parses screens → inserts new `it()` block → renumbers |
| Existing file, user says "update" | Reads existing file → shows screen list → asks what to change |
| Any product, any UI framework | Detects MUI/Ant/Chakra/custom and adjusts loading selectors |
