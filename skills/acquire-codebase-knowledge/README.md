# acquire-codebase-knowledge

> Structured codebase exploration for onboarding — produces a knowledge map of architecture, patterns, conventions, and key files.

## Purpose

Provides a 4-step structured workflow for understanding any your project repository. Generates a knowledge map covering project structure, architecture patterns, coding conventions, and key files — ideal for onboarding or switching between services.

## When to Use

- Onboarding to a new microservice or frontend app
- Context gathering before planning a feature
- Switching between backend/frontend repositories
- Understanding unfamiliar codebase areas

## Workflow

1. **Project Detection** — Identify stack (.NET / React) from project files
2. **Architecture Map** — Map layers, dependencies, and entry points
3. **Convention Detection** — Detect naming patterns, folder structure, DI registration style
4. **Knowledge Map Output** — Structured summary with key files, patterns, and conventions

## Tools Used

`find`, `grep`, `git log`, `ls` (shell commands)

## Used By

- `/explain-project` prompt
- `@planner` agent (pre-planning context)
