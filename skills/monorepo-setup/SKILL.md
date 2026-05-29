---
name: monorepo-setup
description: 'Monorepo setup and optimization — Nx, Turborepo, pnpm workspaces, and Lerna configuration with task orchestration, caching, and dependency management'
---

# Monorepo Setup Skill

Set up and optimize monorepo tooling for multi-package projects.

## When to Use

- Converting multiple repos into a monorepo
- Setting up a new monorepo project
- Adding task caching and orchestration
- Optimizing CI for monorepo workflows

## Rules

1. Use workspace protocol for internal dependencies (`workspace:*`)
2. Hoist shared dependencies — no version conflicts between packages
3. Task orchestration: build dependencies before dependents (topological order)
4. Remote caching for CI — never rebuild unchanged packages
5. Enforce consistent dependency versions across packages (syncpack or similar)
6. Each package MUST have its own tsconfig, eslint, and test config
7. Changesets or conventional commits for per-package versioning
8. CI: only run tasks for affected packages (NX affected, Turbo filter)

## Steps

1. Choose tool: Nx (full-featured), Turborepo (lightweight), pnpm workspaces (minimal)
2. Initialize monorepo structure: `packages/`, `apps/`, shared `tsconfig.base.json`
3. Configure workspace: pnpm-workspace.yaml or package.json workspaces
4. Set up task runner: `turbo.json` or `nx.json` with pipeline/task graph
5. Configure caching: local + remote (Nx Cloud, Vercel Remote Cache, or self-hosted)
6. Add shared tooling: root-level eslint, prettier, commitlint configs
7. Configure CI: use `--filter=[HEAD^1]` or `nx affected` for incremental builds
8. Add package generator/scaffolder for consistent new package creation

## Reference

See `./templates/` for Turborepo and Nx configuration examples.
