# dotnet-crud-scaffold

> Complete CRUD code templates for Org .NET 10 services using ServiceBase patterns — DTO → Mapping → Repository → Service → Controller → Startup → Constants.

## Purpose

Provides 7-layer code templates for generating complete CRUD entities in Org .NET backend services. Uses `{ServiceName}` and `{EntityName}` placeholders for automated code generation.

## When to Use

- `@backend` agent generating new entity CRUD operations
- `@scaffold` agent creating new microservice skeletons
- Adding a new entity to an existing service

## Template Layers

1. **DTO** — Request/Response data transfer objects
2. **Mapping Profile** — AutoMapper configuration
3. **Repository** — Data access with `BaseRepository<T>`
4. **Service** — Business logic with `BaseResponse<T>` returns
5. **Controller** — API endpoints with standard routing
6. **Startup Registration** — DI container configuration
7. **Constants** — Configuration keys and route constants

## Dependencies

- `Org.ServiceBase` platform library
- AutoMapper
- Entity Framework Core

## Used By

- `@backend` agent
- `@scaffold` agent
