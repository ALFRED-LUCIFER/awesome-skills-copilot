---
name: git-hooks-setup
description: 'Configure Husky, lint-staged, commitlint, and pre-push hooks — enforce code quality gates before commits reach the remote'
---

# Git Hooks Setup Skill

Set up client-side git hooks for quality enforcement.

## When to Use

- Adding pre-commit lint/format enforcement to a project
- Setting up commitlint for conventional commit validation
- Configuring pre-push test gates
- Standardizing developer workflow across a team

## Rules

1. Hooks MUST be fast — pre-commit < 10 seconds (use lint-staged for incremental)
2. Use Husky (npm), pre-commit (Python), or lefthook (polyglot) — never raw .git/hooks
3. lint-staged runs linters ONLY on staged files — never the full codebase
4. commitlint enforces conventional commit format — reject non-conforming messages
5. Pre-push hooks run tests — but only affected tests if possible
6. NEVER use hooks as a substitute for CI — they're a first line of defense
7. Hooks MUST be opt-in installable — document setup in CONTRIBUTING.md

## Steps

1. Detect package manager and existing hook setup
2. Install hook framework: `npx husky init` (npm) or `pip install pre-commit` (Python)
3. Configure pre-commit hook: lint-staged for formatting + linting staged files
4. Configure commit-msg hook: commitlint to validate conventional commit format
5. Configure pre-push hook: run test suite (or affected tests only)
6. Add hook installation to project setup script (postinstall or similar)
7. Create `.lintstagedrc` / `lint-staged.config.js` with per-filetype commands
8. Document in CONTRIBUTING.md: how hooks are installed, how to skip if needed (`--no-verify`)

## Reference

See `./templates/` for Husky, lint-staged, and commitlint configuration examples.
