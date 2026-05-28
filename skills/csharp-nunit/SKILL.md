---
name: csharp-nunit
description: >
  NUnit test templates for Org .NET 8 services. Contains controller read/write/delete
  test patterns, service tests, and test data setup using Moq + MockQueryable.
  Used by @backend-tests when generating backend unit tests.
---

# NUnit Test Templates

## When to Use

- @backend-tests generating unit tests for .NET controllers/services
- Writing read/write/delete test patterns for CRUD operations
- Setting up test data with Moq + MockQueryable

## Rules

1. Replace `{ServiceName}` and `{EntityName}` with actual values from codebase
2. Test class inherits `{ServiceName}TestData` for shared mock setup
3. Use `[TestFixture]` on class, `[SetUp]` for controller instantiation
4. Controller tests: call `DoSetup()` in SetUp, create controller with mocked deps
5. Use `MockCustomProblemDetailFactory` for controller ProblemDetailsFactory
6. Assert HTTP status via `ObjectResult.StatusCode` or typed `OkObjectResult`
7. Assert response body via `BaseResponse<T>` contract (Success, Data, Message)
8. Service tests: mock repository via `Mock<IXxxRepository>`, verify calls
9. Use `MockQueryable` for IQueryable mocking (EF Core query testing)
10. Every CRUD op needs: happy path + not-found + validation error + exception tests

## Steps

1. **Create test data class** — `{ServiceName}TestData.cs` with mock setup, sample entities
2. **Create controller read tests** — `ReadFunctionTest.cs` (get-by-id, get-all, not-found)
3. **Create controller write tests** — `WriteFunctionTest.cs` (create, update, validation)
4. **Create controller delete tests** — `DeleteFunctionTest.cs` (delete, not-found)
5. **Create service tests** — `{Entity}ServiceTest.cs` (logic, repo calls, error handling)
6. **Verify coverage** — target 95% (happy + error paths for every CRUD op)

## File Structure

```
Test/
├── {ServiceName}TestData.cs
├── ControllerTest/Common/{EntityName}ControllerTest/
│   ├── ReadFunctionTest.cs
│   ├── WriteFunctionTest.cs
│   └── DeleteFunctionTest.cs
└── ServiceTest/{EntityName}ServiceTest.cs
```

## Reference

See [./templates/](./templates/) for complete C# test file templates (read, write, delete, service, test data setup).
