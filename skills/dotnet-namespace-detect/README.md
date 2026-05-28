# dotnet-namespace-detect

> Shared namespace auto-detection logic for all .NET agents. Run before generating any code or tests.

## Purpose

Automatically detects the correct .NET namespace for a service by inspecting `.csproj` files, existing `namespace` declarations, and `Startup.cs`. Prevents namespace mismatches in generated code.

## When to Use

- Before any .NET code generation (always)
- `@backend`, `@backend-tests`, `@migration`, `@scaffold` agents

## Detection Strategy

1. Find `.csproj` file → extract `<RootNamespace>` or derive from filename
2. Scan existing `namespace` declarations in source files
3. Check `Startup.cs` for service namespace pattern
4. **Fallback**: Ask the user if detection fails

## Used By

- `@backend` agent
- `@backend-tests` agent
- `@migration` agent
- `@scaffold` agent
