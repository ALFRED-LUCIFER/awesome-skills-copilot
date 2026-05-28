# review-and-fix

> Fix-first code review — review staged/uncommitted changes across 5 quality dimensions and fix every issue immediately without approval gates.

## Purpose

Performs a code review and immediately fixes all found issues — no approval loop. Reviews across 5 dimensions with severity scoring and specific fix patterns for common issues.

## When to Use

- `/review-and-fix-code` prompt
- Quick quality pass before committing
- Post-implementation cleanup

## Review Dimensions

1. **Correctness** — Logic errors, null handling, edge cases
2. **Security** — Injection, auth, secrets exposure
3. **Architecture** — Pattern adherence, layer violations
4. **Performance** — N+1, unnecessary allocations, missing memoization
5. **Standards** — Naming, logging, i18n, data-testid

## Severity Scoring

| Severity | Points |
|----------|--------|
| Critical | 10 |
| High | 5 |
| Medium | 2 |
| Info | 1 |

## Tools Used

- File editing, `dotnet build`, `npx tsc`, `npx eslint`

## Used By

- `/review-and-fix-code` prompt
