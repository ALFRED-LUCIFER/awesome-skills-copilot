# playwright-output

Reads Playwright reporter output (`test-results/results.json`, `test-results/junit.xml`, `playwright-report/`) and emits a typed `PlaywrightResult` contract.

## When to invoke

- After every `npx playwright test` run inside the `@playwright-tdd` loop
- To gate phase transitions: RED (all must fail) → GREEN (all must pass) → VERIFY (cross-browser + no flaky)
- Any time you need a structured summary of the last Playwright run

## Output contract

```json
{
  "total": 5,
  "passed": 5,
  "failed": 0,
  "flaky": 0,
  "skipped": 0,
  "duration": 12340,
  "allPassed": true,
  "allFailed": false,
  "failedTests": [],
  "flakyTests": [],
  "reportPath": "playwright-report/index.html",
  "source": "json"
}
```

## Required reporters in `playwright.config.ts`

```typescript
reporter: [
  ['html',  { outputFolder: 'playwright-report', open: 'never' }],
  ['json',  { outputFile: 'test-results/results.json' }],
  ['junit', { outputFile: 'test-results/junit.xml' }],
],
```

See full details in [SKILL.md](./SKILL.md).
