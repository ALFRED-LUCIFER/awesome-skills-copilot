# code-review-pipeline

> Multi-perspective code review chain with auto-fix delegation and iteration control. Enforces GUARDRAILS § 12e.

## Purpose

Executes the mandatory code review chain with 5 review lenses, auto-fix delegation to specialists, and a max 3-iteration loop. Returns a structured JSON response contract with scores and findings.

## When to Use

- Mandatory quality chain invocation after code generation
- Pre-PR code reviews
- `@reviewer` agent review pipeline

## Review Lenses

1. **Correctness** — Logic errors, null handling, edge cases
2. **Security** — OWASP Top 10, SEC-1–24 compliance
3. **Architecture** — Pattern adherence, layer separation, DI
4. **Performance** — N+1 queries, unnecessary allocations, memoization
5. **Standards** — Naming, logging, i18n, data-testid

## Configuration

- Max 3 review iterations
- Auto-delegates fixes to `@frontend` or `@backend`
- Returns JSON: `{ score, findings[], fixed[], remaining[] }`

## Used By

- `@reviewer` agent
- `@orchestrator` (quality chain final step)
