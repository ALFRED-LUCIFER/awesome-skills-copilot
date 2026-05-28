---
name: performance-optimize
description: Performance analysis patterns for Copilot Agent System — .NET (EF Core, async) and React (memoization, virtualization, TanStack Query) focus areas
---

# Performance Optimization Skill

Structured performance review checklist for Copilot Agent System codebases.

## .NET / C# Performance Checks

| ID | Check | Pattern | Severity |
|----|-------|---------|----------|
| P1 | Missing `AsNoTracking()` | Read-only EF Core queries | 🟠 High |
| P2 | N+1 queries | Missing `.Include()` or unbounded loops calling DB | 🔴 Critical |
| P3 | Missing pagination | Collection endpoints without `Skip/Take` | 🟠 High |
| P4 | Synchronous I/O | `.Result`, `.Wait()`, missing `await` | 🔴 Critical |
| P5 | Missing `ConfigureAwait(false)` | Every `await` in library/service code | 🟡 Medium |
| P6 | Unbounded memory | `ToList()` on large result sets without pagination | 🟠 High |
| P7 | Missing indexes | Query filters on non-indexed columns | 🟠 High |
| P8 | AutoMapper in loop | `Map<T>` in foreach — use `ProjectTo<T>` instead | 🟠 High |
| P9 | Over-fetching | Full entities when only subset of columns needed | 🟡 Medium |

## React / TypeScript Performance Checks

| ID | Check | Pattern | Severity |
|----|-------|---------|----------|
| P10 | Missing memoization | Expensive computations without `useMemo` / `useCallback` | 🟠 High |
| P11 | Unnecessary re-renders | Components re-rendering without memoization | 🟡 Medium |
| P12 | Bad useEffect deps | Missing or incorrect dependency array | 🔴 Critical |
| P13 | No virtualization | Lists > 100 items rendered without virtualization | 🟠 High |
| P14 | Redundant API calls | Missing TanStack Query `staleTime` / `gcTime` config | 🟡 Medium |
| P15 | Conditional useQuery | `useQuery` called inside loops or conditionally | 🔴 Critical |
| P16 | Missing code-split | Heavy imports used only on interaction | 🟡 Medium |
| P17 | Cascading re-renders | State that triggers unnecessary child renders | 🟠 High |

## Output Format

```markdown
### Performance Review

| Severity | ID | File | Line | Finding | Fix |
|----------|-----|------|------|---------|-----|
| 🔴 | P2 | OrderService.cs | 45 | N+1 query in GetAll | Add .Include(x => x.Items) |

**Issues**: {N} found, {N} fixed
**Impact**: [estimated improvement]
```
