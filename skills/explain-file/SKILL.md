---
name: explain-file
description: Deep file analysis patterns — type detection, layer mapping, dependency tracing, and test counterpart lookup for your project codebases
---

# Explain File Skill

Structured analysis of a single file in a your project repository.

## .NET File Type Detection

| Filename pattern | Layer | Key rules |
|-----------------|-------|-----------|
| `*Controller.cs` | Controller — HTTP entry point | No business logic, `[Authorize]`, `BaseResponse<T>` |
| `*Service.cs` | Service — business logic | Calls Repository, try/catch/log, `ConfigureAwait(false)` |
| `*Repository.cs` | Repository — EF Core data access | `AsNoTracking`, dual DbContext support |
| `*DTO.cs` / `*Dto.cs` | Data Transfer Object | No logic, serialization-safe |
| `*Profile.cs` | AutoMapper Mapping Profile | `CreateMap<DTO, Entity>` only |
| `*DbContext.cs` | EF Core Database Context | Schema definition, `OnModelCreating` |
| `*Migration*.cs` | EF Core Migration | Rollback-safe `Up()/Down()` |
| `*Constants.cs` | Constants | Config keys, route templates |

## React/TypeScript File Type Detection

| Filename pattern | Layer | Key rules |
|-----------------|-------|-----------|
| `*Page.tsx` / `*Route.tsx` | Page / Route component | No `useState`/`useEffect` — all logic in controller hook |
| `use*Controller.ts` | Controller hook | Returns `{ state, handler }` |
| `use*Query.ts` | Data hook — TanStack Query fetch | Wraps API call |
| `use*Mutation.ts` | Data hook — TanStack Mutation | Wraps API mutation |
| `*.types.ts` | Type / interface definitions | Domain types |
| `*Dialog.tsx` | Dialog component | Uses `FormDialog` or `PlatformDialog` |
| `*Table.tsx` | Table component | Uses `PlatformMrt` |
| `*.test.ts` / `*.test.tsx` | Vitest unit / component test | RTL for components |
| `*.cy.ts` | Cypress E2E test | POM pattern |

## Analysis Output Template

```markdown
## File: {path}

**Type**: [layer name]
**Layer**: [Business Logic | Data Access | UI Presentation | Test]
**Service**: [detected .NET service name, or N/A]

### Purpose
[1–2 sentence description]

### Depends on
[injected interfaces / imported hooks / components]

### Called by
[files that reference this]

### Test counterpart
[matching test file, or "None found"]

### Applicable guardrails
[relevant GUARDRAILS sections for this file type]
```

## Namespace Detection (for .cs files)

Before analysis, run `#skill:dotnet-namespace-detect` commands to determine the service name.
