# Full-Stack .NET + React Plugin

Complete development toolkit for .NET + React full-stack applications.

## Included Agents

| Agent | Purpose |
|-------|---------|
| `@orchestrator` | Single entry-point — plan → approve → execute |
| `@backend` | .NET CRUD code generator (Controller → Service → Repo → DTO) |
| `@frontend` | React + TypeScript + MUI component builder |
| `@scaffold` | .NET microservice skeleton scaffolder |
| `@migration` | EF Core migration specialist |

## Included Skills

| Skill | Purpose |
|-------|---------|
| `dotnet-crud-scaffold` | .NET CRUD code templates |
| `react-crud-scaffold` | React CRUD code templates |
| `dotnet-namespace-detect` | .NET namespace auto-detection |
| `dotnet-quality-chain` | Backend quality chain |
| `react-quality-chain` | Frontend quality chain |

## Usage

```
# Build a complete CRUD feature
@orchestrator build user preferences CRUD with React UI

# Backend only
@backend create Order entity with CRUD

# Frontend only
@frontend create OrderPage with table, dialog, and hooks

# Scaffold a new microservice
@scaffold create new UserService microservice
```

## Quality Chains

Every code generation automatically triggers:
- **Backend**: build → migration → unit tests → review
- **Frontend**: build + lint → unit tests + E2E tests → review
