# conventional-commit

> Enforces Conventional Commits format for all git commit messages — type(scope), breaking changes, and Jira ticket references.

## Purpose

Ensures all commit messages follow the Conventional Commits specification with your project extensions: mandatory scope, Jira ticket references in footers, and breaking change notation.

## When to Use

- Any commit message generation
- `/describe-pr` prompt (PR title follows commit format)
- Post-implementation commit preparation

## Commit Types (11)

| Type | Use When |
|------|----------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code restructuring (no behavior change) |
| `test` | Adding/updating tests |
| `docs` | Documentation changes |
| `style` | Formatting, whitespace |
| `perf` | Performance improvement |
| `ci` | CI/CD pipeline changes |
| `build` | Build system / dependency changes |
| `chore` | Maintenance tasks |
| `revert` | Reverting a previous commit |

## Format

```
type(scope): short description

Body with context (optional)

Refs: NG-XXXX
BREAKING CHANGE: description (if applicable)
```

## Used By

- `/describe-pr` prompt
