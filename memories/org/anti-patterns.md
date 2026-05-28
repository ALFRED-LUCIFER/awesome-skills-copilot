# Org-Wide Anti-Patterns

> Things that repeatedly cause issues across Copilot Agent System projects.
> Promoted from per-repo `discovered-gotchas.md` when patterns recur.

## Backend

- **async void**: Causes unhandled exceptions. Always return `Task` or `Task<T>`.
- **.Result / .Wait()**: Causes deadlocks in ASP.NET. Always `await`.
- **Missing TenantId filter**: Multi-tenant data leaks. Every query MUST scope by TenantId.
- **Hardcoded connection strings**: Security violation. Use `IConfiguration` + secrets.

## Frontend

- **useState in page components**: All state must live in `useXxxController` hooks.
- **PlatformDataGrid**: Deprecated. Use `PlatformMrt` / `usePlatformMrt`.
- **Raw MUI Table components**: Forbidden. Use platform abstractions.
- **any type**: Forbidden. Define proper interfaces.

## Migrations

- **No Down() method**: Every migration must be reversible.
- **Data loss without backup**: Always script data preservation before destructive changes.

## General

- **Force push to main/master**: Blocked by tool-guardian. Use feature branches.
- **npm/NuGet additions without approval**: Agents must ask before adding dependencies.

---
*Promoted from project-level gotchas. Update via PR to .github-private.*
