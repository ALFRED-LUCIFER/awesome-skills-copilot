---
name: acquire-codebase-knowledge
description: Structured codebase exploration for onboarding — produces a knowledge map of architecture, patterns, conventions, and key files
---

# Acquire Codebase Knowledge

## When to Use

- Onboarding to a new repository
- Context gathering before planning a feature
- Switching between microservices and needing orientation

## Rules

1. Start with project detection (sln/csproj/package.json/tsconfig)
2. Map architecture layer by layer: API surface → business logic → data access → models
3. Identify patterns: DI registration, naming conventions, folder structure, test layout
4. Note conventions: response wrapper types, error handling, logging patterns
5. Output as structured knowledge map (not prose) — tables and bullet lists
6. Never reproduce source code — describe what exists
7. Check for existing AGENTS.md or docs/ for prior knowledge
8. Limit exploration depth: max 4 levels deep, max 30 files per layer scan

## Steps

1. **Detect project type** — check for sln, csproj, package.json, tsconfig, go.mod etc.
2. **Map API surface** — find controllers/routes/endpoints (entry points)
3. **Map business logic** — find services, handlers, use cases
4. **Map data access** — find repositories, DbContexts, data models
5. **Map shared/infra** — find DI registration, middleware, config, utilities
6. **Identify test structure** — find test projects/folders, coverage config
7. **Extract conventions** — naming patterns, folder structure, response types
8. **Produce knowledge map** — structured output with file paths and roles

## Output Format

```markdown
## Knowledge Map: {repo-name}

### Stack
- Backend: {tech + version}
- Frontend: {tech + version}
- Database: {type}
- Testing: {frameworks}

### Architecture
| Layer | Pattern | Key Files |
|-------|---------|-----------|
| API | {pattern} | {files} |
| Logic | {pattern} | {files} |
| Data | {pattern} | {files} |

### Conventions
- {convention}: {description}

### Key Files
| File | Role |
|------|------|
| {path} | {purpose} |
```

## Reference

See [./examples.md](./examples.md) for discovery commands per tech stack and worked knowledge map examples.
