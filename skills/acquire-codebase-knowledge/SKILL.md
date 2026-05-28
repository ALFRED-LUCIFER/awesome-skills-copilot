---
name: acquire-codebase-knowledge
description: Structured codebase exploration for onboarding — produces a knowledge map of architecture, patterns, conventions, and key files
---

# Acquire Codebase Knowledge Skill

Systematic exploration of a Copilot Agent System repository to build a comprehensive understanding. Use for onboarding, context gathering before planning, or when switching between services.

## Step 1 — Project Detection

```bash
# Detect project type
ls *.sln *.csproj package.json tsconfig.json 2>/dev/null

# Git info
git remote -v 2>/dev/null | head -2
git log --oneline -5
```

## Step 2 — Architecture Map

### For .NET Services

```bash
# Find all projects
find . -name '*.csproj' -maxdepth 4 | sort

# Find controllers (API surface)
find . -name '*Controller.cs' -maxdepth 5 | sort

# Find services (business logic)
find . -name '*Service.cs' -not -path '*/Test*' -maxdepth 5 | sort

# Find repositories (data access)
find . -name '*Repository.cs' -maxdepth 5 | sort

# Find DbContext (database schema)
find . -name '*DbContext.cs' -maxdepth 5

# Find migrations (schema history)
find . -path '*/Migrations/*.cs' -maxdepth 5 | wc -l

# Startup/DI registration
find . -name 'Startup.cs' -o -name 'Program.cs' | head -3
```

### For React Frontends

```bash
# Package info
cat package.json | grep -E '"name"|"version"|react|@mui|@myorg'

# Feature folders
ls -d src/features/*/ 2>/dev/null || ls -d src/pages/*/ 2>/dev/null

# Route definitions
find . -name '*routes*' -o -name '*Router*' | grep -v node_modules | head -5

# Hooks (business logic)
find src -name 'use*Controller*' -o -name 'use*Query*' | head -20

# API layer
find src -name '*api*' -o -name '*query*' -o -name '*mutation*' | grep -v node_modules | head -10
```

## Step 3 — Convention Detection

Read 2-3 representative files from each layer and note:
- Naming conventions (PascalCase services, camelCase hooks)
- Import patterns (barrel exports, relative vs absolute)
- Error handling pattern (BaseResponse<T>, try/catch)
- Logging pattern (ILogger<T>, structured logging)
- Test structure (NUnit/Vitest, test file location)

## Step 4 — Knowledge Map Output

```markdown
# 📚 Codebase Knowledge Map — {ServiceName}

## Stack
- **Backend**: .NET {version} / EF Core / PostgreSQL
- **Frontend**: React {version} / TypeScript / MUI {version}
- **Testing**: NUnit + Moq (backend) / Vitest + RTL (frontend) / Cypress (E2E)

## Architecture
- **Pattern**: {Clean Architecture / Vertical Slices / etc.}
- **Layers**: Controller → Service → Repository → DbContext
- **API Style**: REST with BaseResponse<T> wrapper

## Key Files
| File | Purpose |
|------|---------|
| `Startup.cs` | DI registration, middleware pipeline |
| `{Service}DbContext.cs` | EF Core schema definition |
| `src/features/{domain}/` | Feature folder (components + hooks) |

## Conventions
- {List detected conventions}

## Domain Entities
| Entity | Table | Controller | Service |
|--------|-------|-----------|---------|
| {Name} | {table} | {controller} | {service} |

## Test Coverage
- Backend: {count} test files
- Frontend: {count} test files
- E2E: {count} spec files

## Dependencies (notable)
- {key packages and versions}
```

## Step 5 — Save to Memory

Save the knowledge map to `/memories/repo/codebase-knowledge.md` for future reference.

## Step 6 — Doc-Sync Table

Identify documentation files linked to source files. Scan for:

```bash
# Find documentation files
find . -name '*.md' -not -path '*/node_modules/*' -not -path '*/.git/*' | sort

# Find OpenAPI/Swagger specs
find . -name 'swagger*' -o -name 'openapi*' -o -name '*.yaml' | grep -v node_modules | head -10

# Find Confluence references in code comments
grep -r "confluence\|wiki\|docs/" --include="*.cs" --include="*.ts" -l | head -10
```

Build a mapping table of source files → their linked documentation:

```markdown
# 📄 Doc-Sync Table — {ServiceName}

> Used by @reviewer to flag stale documentation when source changes without doc updates.

| Source File/Pattern | Linked Documentation | Sync Rule |
|---|---|---|
| `*Controller.cs` | `docs/api-{entity}.md` | Update when endpoints change |
| `*DbContext.cs` / `Migrations/` | `docs/schema.md` | Update when schema changes |
| `src/features/{domain}/` | `docs/features/{domain}.md` | Update when UI flow changes |
| `appsettings*.json` | `docs/configuration.md` | Update when config keys change |
| `Startup.cs` / `Program.cs` | `docs/setup.md` | Update when DI/middleware changes |
| `package.json` / `*.csproj` | `CHANGELOG.md` | Update when deps change |
```

Adapt the table to the actual files found in the repo. Remove rows where no linked doc exists yet. Save to `/memories/repo/doc-sync-table.md`.
