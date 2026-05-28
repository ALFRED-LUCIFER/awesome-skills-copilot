# react-quality-chain

> Frontend quality chain: build + lint → parallel unit tests and Cypress E2E → code review. Enforces GUARDRAILS § 12a.

## Purpose

Executes the mandatory frontend quality chain after any React code generation. Ensures the app builds cleanly, linting passes, tests meet coverage thresholds, and code review scores are acceptable.

## When to Use

- Automatically invoked by `@orchestrator` after frontend code generation
- `@frontend` agent post-code-generation step
- Manual quality verification

## Chain Steps

1. **Build + Lint** — `npm run build` and `npm run lint` must succeed
2. **Unit Tests** — Delegate to `@frontend-tests`, verify 90% coverage floor (parallel)
3. **Cypress E2E** — Delegate to `@e2e-tests` (parallel with unit tests)
4. **Code Review** — Delegate to `@reviewer`, verify score ≤ 5

## Thresholds

| Threshold | Default |
|-----------|---------|
| `FRONTEND_COVERAGE_MIN` | 90% |
| `CYPRESS_MANDATORY` | true |
| `REVIEW_PASS_THRESHOLD` | ≤ 5 |

## Used By

- `@orchestrator` agent
- `@frontend` agent
