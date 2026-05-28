---
name: react-quality-chain
description: >
  Executes the mandatory frontend quality chain: build+lint → parallel unit tests
  and Cypress E2E → code review. Enforces GUARDRAILS § 12a. Portable across VS Code,
  Copilot CLI, and cloud agents.
---

# Mandatory Frontend Chain

> **Portable Skill** — implements GUARDRAILS § 12a as a reusable workflow.

## Chain Steps

```
@frontend → Build+Lint → PARALLEL[@frontend-tests + @e2e-tests] → @reviewer --full
```

### Step 1 — Build & Lint
1. Run `npm run build` in the correct project directory
2. Run `npm run lint` — must produce 0 errors
3. If errors: classify as `COMPILE_ERROR` or `LINT_ERROR`, fix, re-run

### Step 2 — Parallel Testing (independent, run simultaneously)
**2a. Unit Tests** — delegate to `@frontend-tests`
- Direct mocking patterns (no `jest.mock()`)
- Behavior-focused assertions
- Minimum coverage: `FRONTEND_COVERAGE_MIN` (default 90%)

**2b. Cypress E2E** — delegate to `@e2e-tests`
- Strict POM architecture
- No raw `cy.get()` in spec files
- Skip if `CYPRESS_MANDATORY: false` override is set

### Step 3 — Code Review
- Delegate to `@reviewer --full`
- Pass threshold: `REVIEW_PASS_THRESHOLD` (default ≤ 5)
- On failure: route findings to `@frontend` → fix → re-review
- Max iterations: `MAX_REVIEW_ITERATIONS` (default 3)

## Response Contract

When invoked as a sub-agent, return:

```json
{
  "chain": "frontend",
  "status": "PASS | FAIL",
  "steps": {
    "build": { "status": "PASS", "errors": 0 },
    "unitTests": { "status": "PASS", "coverage": "92%", "testCount": 24 },
    "cypressE2E": { "status": "PASS", "specCount": 6, "pomCompliant": true },
    "review": { "status": "PASS", "score": 3, "iterations": 1 }
  },
  "filesGenerated": ["*.test.tsx", "*.cy.ts", "*.po.ts"],
  "overridesApplied": []
}
```

## Quality Threshold Overrides

Read from the project's `copilot-instructions.md`:
- `FRONTEND_COVERAGE_MIN` — minimum unit test coverage
- `CYPRESS_MANDATORY` — whether to invoke Cypress chain
- `REVIEW_PASS_THRESHOLD` — review score gate
- `MAX_REVIEW_ITERATIONS` — fix/re-review loop limit
