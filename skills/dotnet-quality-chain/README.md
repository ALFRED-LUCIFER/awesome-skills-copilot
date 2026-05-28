# dotnet-quality-chain

> Backend quality chain: build → migration auto-detect → unit tests → code review. Enforces GUARDRAILS § 12b.

## Purpose

Executes the mandatory backend quality chain after any .NET code generation. Ensures code compiles, migrations are handled, tests pass at 95% coverage, and code review scores are acceptable.

## When to Use

- Automatically invoked by `@orchestrator` after backend code generation
- `@backend` agent post-code-generation step
- Manual quality verification

## Chain Steps

1. **Build** — `dotnet build` must succeed with zero errors
2. **Migration Auto-detect** — Check if schema changes require EF Core migration, delegate to `@migration`
3. **Unit Tests** — Delegate to `@backend-tests`, verify 95% coverage floor
4. **Code Review** — Delegate to `@reviewer`, verify score ≤ 5

## Thresholds

| Threshold | Default |
|-----------|---------|
| `BACKEND_COVERAGE_MIN` | 95% |
| `REVIEW_PASS_THRESHOLD` | ≤ 5 |
| `MAX_REVIEW_ITERATIONS` | 3 |

## Used By

- `@orchestrator` agent
- `@backend` agent
