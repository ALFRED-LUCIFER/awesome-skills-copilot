---
name: conventional-commit
description: Enforces Conventional Commits format for all git commit messages — type(scope), breaking changes, Jira ticket references
---

# Conventional Commit Skill

All commit messages in Copilot Agent System repos MUST follow [Conventional Commits v1.0.0](https://www.conventionalcommits.org/).

## Format

```
<type>(<scope>): <short description>

[optional body — what and why, not how]

[optional footer(s)]
Refs: NG-1234
BREAKING CHANGE: <description>
```

## Types

| Type | When to use | Example |
|------|------------|---------|
| `feat` | New feature or capability | `feat(order): add PDF export endpoint` |
| `fix` | Bug fix | `fix(auth): handle expired refresh token` |
| `refactor` | Code change that neither fixes nor adds feature | `refactor(cutting): extract validation to service` |
| `test` | Adding or updating tests | `test(order): add controller CRUD tests` |
| `docs` | Documentation only | `docs(readme): update setup instructions` |
| `style` | Formatting, whitespace (no logic change) | `style(machine): fix indentation` |
| `perf` | Performance improvement | `perf(query): add AsNoTracking to read endpoints` |
| `ci` | CI/CD pipeline changes | `ci: add deployment stage for staging` |
| `chore` | Maintenance (deps, config) | `chore: bump MUI to 7.3.0` |
| `build` | Build system changes | `build: update Dockerfile to .NET 10` |
| `revert` | Revert a previous commit | `revert: feat(order): add PDF export endpoint` |

## Scope

Use the **feature/domain** name as scope (lowercase):
- `order`, `machine`, `cutting`, `rack`, `auth`, `user`, `notification`
- `migration` for EF Core migrations
- `deps` for dependency updates

## Rules

1. **Subject line**: max 72 chars, lowercase, imperative mood, no period
2. **Body**: wrap at 100 chars, explain *what* and *why*
3. **Jira reference**: always include `Refs: NG-XXXX` in footer when ticket exists
4. **Breaking changes**: `BREAKING CHANGE:` footer + `!` after type: `feat(api)!: remove v1 endpoints`
5. **No merge commits**: rebase before merging (squash merge in PR)

## Jira Integration

When a Jira ticket key is known:
```
feat(order): implement bulk status update

Add PATCH /api/orders/bulk-status endpoint with validation
for allowed status transitions per business rules.

Refs: NG-4567
```

## Multi-line Body Template

```
fix(cutting): prevent duplicate optimization runs

Previously, rapid button clicks could trigger multiple
optimization API calls before the first response arrived.

Root cause: missing debounce on the submit handler.
Fix: add 500ms debounce + disable button on pending state.

Refs: NG-2345
```
