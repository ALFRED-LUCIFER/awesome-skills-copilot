---
name: playwright-output
description: Parse and structure Playwright test results from JSON/JUnit/HTML reporters. Produces a typed output contract consumed by @playwright-tdd to gate phase transitions (RED→GREEN→VERIFY). MCP filesystem read preferred; terminal fallback if unavailable. Use when: read playwright results, parse test output, check test pass/fail, playwright report, TDD gate, test result summary.
---

# Playwright Output Parsing

Reads Playwright reporter output and emits a typed `PlaywrightResult` contract that controls TDD phase progression.

## Output Contract

```typescript
interface PlaywrightResult {
  total: number;
  passed: number;
  failed: number;
  flaky: number;
  skipped: number;
  duration: number;         // ms
  allPassed: boolean;
  allFailed: boolean;       // true when passed === 0 and failed > 0 (RED gate)
  failedTests: FailedTest[];
  flakyTests: string[];
  reportPath: string;       // relative path to HTML report
  source: 'json' | 'junit' | 'terminal'; // which reporter was read
}

interface FailedTest {
  title: string;            // full test title including describe block
  file: string;
  line: number;
  error: string;            // first error message (truncated to 500 chars)
  retries: number;
}
```

## Reading Priority

Try sources in this order — stop at first success:

### 1. JSON Reporter (preferred)

File: `test-results/results.json`

```typescript
// Read and parse
const raw = JSON.parse(fs.readFileSync('test-results/results.json', 'utf-8'));
// raw.stats: { expected, unexpected, flaky, skipped, duration }
// raw.suites[].specs[].tests[].results[].status: 'passed'|'failed'|'flaky'|'skipped'
```

Parse algorithm:
```
total    = stats.expected + stats.unexpected + stats.flaky + stats.skipped
passed   = stats.expected
failed   = stats.unexpected
flaky    = stats.flaky
skipped  = stats.skipped
duration = stats.duration

for each suite → spec → test → result where status !== 'passed':
  failedTests.push({
    title: suite.title + ' > ' + spec.title,
    file: spec.file,
    line: spec.line,
    error: result.errors[0]?.message ?? result.errors[0]?.value ?? 'Unknown error',
    retries: results.length - 1,
  })
```

### 2. JUnit XML Reporter (fallback)

File: `test-results/junit.xml`

```xml
<!-- Parse <testsuites> → <testsuite tests="N" failures="F" errors="E" time="T"> -->
<!-- Failed: <testcase> children that contain <failure> or <error> elements -->
```

Parse algorithm:
```
total    = sum of testsuite[@tests]
passed   = total - failed - skipped
failed   = sum of testsuite[@failures] + testsuite[@errors]
duration = sum of testsuite[@time] * 1000  (convert seconds → ms)

for each testcase with <failure> child:
  failedTests.push({
    title: testsuite[@name] + ' > ' + testcase[@name],
    file: testcase[@classname],
    line: 0,  // not in JUnit format
    error: failure.text (first 500 chars),
    retries: 0,
  })
```

### 3. Terminal Output (last resort)

Parse `npx playwright test` stdout:
```
# Passed:   N passed (Xs)  → passed
# Failed:   N failed        → failed
# Flaky:    N flaky         → flaky
# Line:     ✘ {title} ({file}:{line})
#           Error: {message}
```

Regex patterns:
```
/(\d+) passed/           → passed count
/(\d+) failed/           → failed count
/(\d+) flaky/            → flaky count
/✘\s+(.+)\s+\((.+):(\d+)\)/ → failed test: title, file, line
```

## TDD Phase Gates

The `@playwright-tdd` agent uses this contract to enforce phase transitions:

| Phase | Gate condition | Fail action |
|-------|---------------|-------------|
| **RED** | `allFailed === true` | Strengthen assertions — loop back |
| **RED** | `failed < total` (some passed) | Tests too weak — fix spec, re-run |
| **GREEN** | `allPassed === true` | Proceed to REFACTOR |
| **GREEN** | `failed > 0` after 3 attempts | Escalate — surface failing test errors |
| **VERIFY** | `allPassed === true` + cross-browser | Emit final report |
| **VERIFY** | Any `flaky > 0` | Fix flakiness before declaring done |

## Steps

1. **Detect reporters** — Check which output files exist
2. **Read results** — Parse using priority order above
3. **Build contract** — Populate `PlaywrightResult` fields
4. **Apply gate** — Return `{ pass: boolean, result: PlaywrightResult, gateReason: string }`
5. **Surface failures** — For failed tests, format error messages for the calling agent

## Run Command Reference

```bash
# Standard run (all browsers, all reporters)
npx playwright test --reporter=json,html,junit

# Targeted run (single spec, single browser — faster TDD loop)
npx playwright test {feature}.spec.ts --project=chromium --reporter=json

# Full cross-browser verification (VERIFY phase only)
npx playwright test --project=chromium,firefox,webkit --reporter=html,json,junit

# Tag-scoped run
npx playwright test --grep @smoke
npx playwright test --grep-invert @slow
```

## MCP Integration

If the `filesystem` MCP server is available, read report files directly without running a shell command:

```
mcp.filesystem.read('test-results/results.json')  → parse JSON
mcp.filesystem.read('test-results/junit.xml')     → parse XML
```

If MCP is unavailable, use `execute/runInTerminal` with `cat test-results/results.json` as fallback.

## Reference

Templates: `skills/playwright-test-gen/templates/fixture.ts.md` — contains `playwright.config.ts` with the three mandatory reporters (`html`, `json`, `junit`). All output paths are relative to the workspace root.
