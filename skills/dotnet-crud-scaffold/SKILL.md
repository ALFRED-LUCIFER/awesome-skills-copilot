---
name: dotnet-crud-scaffold
description: >
  Complete CRUD code templates for Org .NET 8 services using ServiceBase patterns.
  Contains DTO, Mapping, Repository, Service, Controller, Startup, and Constants templates.
  Used by @backend when generating new entities.
---

# .NET CRUD Scaffold

## When to Use

- @backend generating a new entity's full CRUD stack
- Adding a new entity to an existing microservice
- Need DTO, Mapping, Repository, Service, Controller, Startup, Constants

## Rules

1. Replace `{ServiceName}` with namespace detected from csproj (use `dotnet-namespace-detect` skill)
2. Replace `{EntityName}` with PascalCase entity name
3. Every DTO must have `InterfaceInfo` property with `EntityType` set
4. Master DTO = full detail, List DTO = grid/table subset, Write DTO = create/update input
5. Repository inherits `BaseRepository<{Entity}>` and implements `I{Entity}Repository`
6. Service inherits `BaseService` and wraps repository calls with `BaseResponse<T>`
7. Controller uses `[Authorize]`, `[ApiController]`, returns `BaseResponse<T>`
8. Startup registers: Repository → Service → AutoMapper profile → Constants
9. Constants class defines entity-specific string keys (routes, cache keys, error codes)
10. Mapping profile maps Entity ↔ Master DTO, Entity ↔ List DTO, Write DTO → Entity

## Steps

1. **Detect namespace** — run `dotnet-namespace-detect` to get `{ServiceName}`
2. **Create DTOs** — `DTO/Master/Master{Entity}.cs`, `DTO/List/List{Entity}.cs`, `DTO/Write/Write{Entity}.cs`
3. **Create Mapping Profile** — `Mapping/{Entity}MappingProfile.cs`
4. **Create Repository** — `Repository/I{Entity}Repository.cs` + `Repository/{Entity}Repository.cs`
5. **Create Service** — `Service/I{Entity}Service.cs` + `Service/{Entity}Service.cs`
6. **Create Controller** — `Controllers/{Entity}Controller.cs` with full CRUD endpoints
7. **Create Constants** — `Constants/{Entity}Constants.cs`
8. **Register in Startup** — add DI registration in `Startup.cs` or `ServiceCollectionExtensions.cs`

## File Structure

```
{ServiceName}/
├── Constants/{Entity}Constants.cs
├── Controllers/{Entity}Controller.cs
├── DTO/Master/Master{Entity}.cs
├── DTO/List/List{Entity}.cs
├── DTO/Write/Write{Entity}.cs
├── Mapping/{Entity}MappingProfile.cs
├── Repository/I{Entity}Repository.cs
├── Repository/{Entity}Repository.cs
├── Service/I{Entity}Service.cs
└── Service/{Entity}Service.cs
```

## Reference

See [./templates/](./templates/) for complete C# code templates for each file type.
