# performance-optimize

> Performance analysis patterns for .NET (EF Core, async) and React (memoization, virtualization, TanStack Query).

## Purpose

Provides structured performance analysis checklists for both .NET backend and React frontend code. Each check is severity-tagged (Critical/High/Medium) with specific fix patterns.

## When to Use

- `/optimize-performance` prompt
- Performance review during code review
- Pre-production performance audit

## .NET Checks (P1–P9)

| # | Check | Severity |
|---|-------|----------|
| P1 | N+1 query detection | Critical |
| P2 | Missing `AsNoTracking()` on read queries | High |
| P3 | Synchronous DB calls (`Result`/`Wait()`) | Critical |
| P4 | Unbounded result sets (missing pagination) | High |
| P5 | Missing `Include()` causing lazy loading | High |
| P6–P9 | Additional EF Core and async patterns | Medium |

## React Checks (P10–P17)

| # | Check | Severity |
|---|-------|----------|
| P10 | Missing `useMemo`/`useCallback` in expensive renders | High |
| P11 | Missing list virtualization (large datasets) | Critical |
| P12 | TanStack Query stale time misconfiguration | Medium |
| P13 | Unnecessary re-renders from prop changes | High |
| P14–P17 | Additional React performance patterns | Medium |

## Used By

- `/optimize-performance` prompt
