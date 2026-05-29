---
name: migration-guide
description: 'Framework and version migration planning — breaking change analysis, codemod generation, step-by-step migration plans for React, Angular, Vue, .NET, Node, Python upgrades'
---

# Migration Guide Skill

Plan systematic framework/version upgrades with minimal risk.

## When to Use

- Upgrading a major framework version (React 18→19, .NET 8→10, Node 18→22)
- Migrating between frameworks (Express→Fastify, Vue 2→3)
- Assessing migration effort and risk before committing
- Creating a phased migration plan for large codebases

## Rules

1. ALWAYS read the official migration guide first
2. Assess impact BEFORE starting: count affected files, estimate effort
3. Migrate incrementally — each step MUST leave the project buildable and testable
4. Create a migration branch — never migrate on main
5. Run full test suite after EACH migration step
6. Document manual steps that can't be automated
7. If >50 files affected per step, break into sub-steps

## Steps

1. Identify current version from manifest files (package.json, *.csproj, go.mod)
2. Read official migration guide for target version
3. List all breaking changes relevant to this project
4. Scan codebase for affected patterns: deprecated APIs, changed signatures, removed features
5. Create phased plan: dependency updates → code changes → config changes → test fixes
6. Write codemods where possible (jscodeshift for JS/TS, Roslyn for C#, ast for Python)
7. Execute plan step by step: update → build → fix errors → test → commit
8. Document post-migration notes: new patterns to adopt, old patterns to avoid

## Reference

See `./examples.md` for common migration checklists per framework.
