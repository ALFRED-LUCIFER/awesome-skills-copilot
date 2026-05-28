---
name: review-and-fix
description: Fix-first code review — review staged/uncommitted changes across 5 quality dimensions and fix every issue immediately without approval gates
---

# Review and Fix Skill

Fix-first review workflow. Every issue found is fixed immediately — no approval gate, no iteration cap. Differs from `@reviewer` (which pauses at score ≤5 and caps auto-fix at 3 iterations).

## Review Lenses (All Applied Simultaneously)

| Lens | What to check |
|------|--------------|
| **Correctness** | Logic errors, missing edge cases, broken `BaseResponse<T>`, missing null checks |
| **Security** | SEC-1–24 — injection, hardcoded credentials, missing auth, XSS, IDOR |
| **Architecture** | Layer violations, coupling, pattern compliance |
| **Performance** | N+1 queries, missing `AsNoTracking`, unnecessary re-renders, blocking `.Result`/`.Wait()` |
| **Standards** | Naming, `async void`, missing `data-testid`, hardcoded strings, i18n |

For `.tsx` files, also check accessibility (ACC-1–8, WCAG 2.2 AA).

## Scoring

| Severity | Score | Examples |
|----------|-------|---------|
| 🔴 Critical | 10 | SQL injection, hardcoded secrets, `async void` |
| 🟠 High | 5 | Layer violation, missing `AsNoTracking`, `.Result`/`.Wait()` |
| 🟡 Medium | 2 | Missing `data-testid`, hardcoded string |
| 🔵 Info | 1 | Style note, minor improvement |

## Fix Patterns

- Missing `ConfigureAwait(false)` → add to every `await`
- `.Result` / `.Wait()` → convert to `async/await`
- Hardcoded string → `t('key')` (frontend) or constants (backend)
- Missing `data-testid` → add to every interactive element
- `async void` → change to `Task`
- Business logic in Controller → move to Service
- `useState`/`useEffect` in Page → move to `useXxxController` hook

## Verification

After fixes, run:
- `.NET`: `dotnet build` in project directory
- `React`: `npx tsc --noEmit` and `npx eslint {changed files}`
