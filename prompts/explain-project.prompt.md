---
name: explain-project
description: Instant onboarding — summarise any NG repo's stack, architecture, patterns, and test strategy
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [execute/getTerminalOutput, execute/runInTerminal, read/terminalSelection, read/terminalLastCommand, search/codebase]
---

Analyse the current workspace and produce a structured project summary. Follow these steps in order.

## Step 1 — Detect project type

Run these commands to identify the repo type:

```bash
# Check for package.json (frontend / Node)
cat package.json 2>/dev/null | head -40

# Check for .NET project files
find . -maxdepth 3 -name '*.csproj' -o -name '*.sln' | head -10

# Scan top-level structure
ls -la
```

## Step 2 — Detect .NET namespace (if .NET project found)

If any `.csproj` or `.sln` was found in Step 1, run these namespace detection commands:

```bash
# 1. Find the production .csproj
find . -name '*.Service.csproj' -o -name '*.csproj' | grep -v '\.Test\.' | head -5

# 2. Extract root namespace from existing source files
grep -r '^namespace Org\.' --include='*.cs' -h | sort | uniq -c | sort -rn | head -5

# 3. Check Startup.cs / Program.cs for the service name
grep -m1 'namespace' Startup.cs 2>/dev/null || grep -m1 'namespace' Program.cs 2>/dev/null
```

## Step 3 — Read entry points

- Read `README.md` or `CLAUDE.md` if present (first 80 lines)
- For .NET: read `Program.cs` or `Startup.cs` (first 60 lines)
- For frontend: read `src/main.tsx` or `src/App.tsx` (first 40 lines)

## Step 4 — Scan key folders

Identify and briefly describe the purpose of these folders if present:
`src/`, `Controllers/`, `Services/`, `Repository/`, `Domain/`, `DTO/`, `Migrations/`, `tests/`, `cypress/`

## Step 5 — Read instruction context

List all files present in `` and note the `applyTo:` glob for each.

## Step 6 — Detect test framework

```bash
# Frontend — check devDependencies
cat package.json 2>/dev/null | grep -E '"vitest|cypress|jest|testing-library"'

# Backend — find test project
find . -name '*.Test.csproj' -maxdepth 4 | head -5
```

## Step 7 — Detect MCP integrations

Check if `.vscode/mcp.json` or `copilot/mcp.json` exists and list registered server names.

## Output

Produce this exact structure — omit sections that are genuinely not applicable:

---

## Project: [detected name]

**Stack**: [e.g. `.NET 10 + React 19 + PostgreSQL` | `React 19 + MUI 7` | `.NET 10 only`]
**Service namespace**: [e.g. `Org.CuttingManagement.Service` — or `N/A`]

### Architecture layers

[Ordered list from entry point to data store, e.g.:]
1. `Controllers/` — HTTP entry points, JWT auth, returns `BaseResponse<T>`
2. `Services/` — Business logic
3. `Repository/` — EF Core data access
4. PostgreSQL via dual DbContext

### Key patterns enforced

[Bullet list extracted from instruction files — e.g. `BaseResponse<T>`, `useXxxController`, `PlatformMrt`, `ConfigureAwait(false)`]

### Test strategy

| Framework | Scope | Coverage target |
|-----------|-------|----------------|
| [e.g. NUnit + Moq + MockQueryable] | Unit | 95% |
| [e.g. Vitest + RTL] | Unit / Component | 90% |
| [e.g. Cypress 13 POM] | E2E | — |

### MCP integrations

[Bullet list of server names, e.g. `jira-azure`, `confluence-azure` — or "None detected"]

### Active instruction files

[Bullet list: `filename.instructions.md` → `applyTo: glob`]

---
