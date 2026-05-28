---
name: dotnet-namespace-detect
description: Shared namespace auto-detection logic for all .NET agents. Run these commands before generating any code or tests to avoid guessing the service name.
---

# Namespace Auto-Detection

Run the following commands **before generating any code or tests** to detect the service namespace. Never guess — always detect or ask.

## Commands

```bash
# 1. Find the .csproj to determine service name (production project)
find . -name '*.Service.csproj' -o -name '*.csproj' | grep -v '\.Test\.' | head -5

# 2. Extract root namespace from existing source files
grep -r '^namespace Org\.' --include='*.cs' -h | sort | uniq -c | sort -rn | head -5

# 3. Check Startup.cs / Program.cs for the service name
grep -m1 'namespace' Startup.cs 2>/dev/null || grep -m1 'namespace' Program.cs 2>/dev/null
```

## For Test Projects (additional step)

```bash
# 4. Find test project .csproj
find . -name "*.Test.csproj" -maxdepth 3

# 5. Extract RootNamespace from test .csproj
grep -i "RootNamespace\|<AssemblyName" *.Test.csproj 2>/dev/null
```

## Result

Set the `{ServiceName}` placeholder to the detected name (e.g., `UserManagement`, `CuttingManagement`, `NotificationService`).

All templates use `{ServiceName}` as a placeholder — replace with the actual detected name before generating code.

## Fallback

If detection fails (no .csproj found, ambiguous results): ask the user:
> _"What is the service name? (PascalCase, e.g., `CuttingManagement`)"_ — Never guess.
