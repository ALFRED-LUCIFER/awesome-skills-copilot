---
description: "Coding standards for .NET / C# files — conventions, patterns, and guardrails"
applyTo: "**/*.cs"
---

# .NET Coding Standards

## General Rules

- Use `BaseResponse<T>` as the standard API response wrapper
- Follow repository → service → controller layering
- Use AutoMapper for DTO mapping with explicit `MappingProfile`
- Register all services in `Startup.cs` DI collection
- Use structured logging with `ILogger<T>` — never `Console.WriteLine`

## Naming Conventions

- PascalCase for classes, methods, properties, and public members
- camelCase for local variables and parameters
- Prefix interfaces with `I` (e.g., `IOrderService`)
- Suffix DTOs with `Dto` (e.g., `OrderDto`)
- Suffix repositories with `Repository` (e.g., `OrderRepository`)

## Security (OWASP Top 10)

- Never concatenate SQL — use parameterized queries or EF Core LINQ
- Validate all input at controller level with `[Required]`, `[MaxLength]`, etc.
- Use `[Authorize]` on all endpoints — opt-out with `[AllowAnonymous]` explicitly
- Never log sensitive data (passwords, tokens, PII)
- Always use HTTPS in production configurations

## Testing

- Minimum 95% coverage for new code
- Use NUnit + Moq + MockQueryable
- Test happy path + error path for every CRUD operation
- Use `[TestCase]` for parameterized tests

## EF Core / Migrations

- Always include both `Up()` and `Down()` methods
- Use PostgreSQL-compatible column types
- Scope queries with `TenantId` for multi-tenant systems
- Add data validation SQL after migration
