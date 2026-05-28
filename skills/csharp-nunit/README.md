# csharp-nunit

> NUnit + Moq + MockQueryable test templates for Org .NET 10 services — controller, service, and repository test patterns.

## Purpose

Provides ready-to-use test templates for all CRUD operations in Org .NET backend services. Templates use `{ServiceName}` and `{EntityName}` placeholders for code generation.

## When to Use

- `@backend-tests` agent generating unit tests
- Writing controller read/write/delete tests
- Setting up test infrastructure with Moq + MockQueryable

## Test Patterns Covered

- **Controller Tests**: GetAll, GetById, Create, Update, Delete
- **Service Tests**: Business logic, validation, error handling
- **Repository Tests**: Query patterns, filtering, pagination
- **Error Patterns**: NotFound, BadRequest, validation failures

## Dependencies

- NUnit 4.x
- Moq
- MockQueryable.Moq
- FluentAssertions

## Used By

- `@backend-tests` agent
