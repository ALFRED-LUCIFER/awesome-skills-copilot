---
name: generate-tests
description: Generate unit tests using Copilot Agent System standards — routes to @backend-tests (.NET/C#) or @frontend-tests (React/TypeScript) automatically based on file type
argument-hint: Leave blank to test the active file, or paste a file path to test a specific file
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [search/codebase, edit/editFiles, execute/getTerminalOutput, execute/runInTerminal, read/terminalLastCommand, read/terminalSelection, todo, vscode/memory, vscode/askQuestions]
---

Generate unit tests for the following code using Copilot Agent System standards.

**Target**: `${input:filePath:Leave blank for active file, or enter file path e.g. src/Services/UserService.cs}`

---

## Step 1 — Identify file type

Read the target file (or use `${selection}` if a selection was made). Determine the file extension:

- `.cs` → **Backend (.NET 10)** — use `@backend-tests` rules (NUnit + Moq + MockQueryable)
- `.ts` / `.tsx` → **Frontend (React/TypeScript)** — use `@frontend-tests` rules (Vitest + React Testing Library)

---

## Step 2 — For .cs files: invoke @backend-tests

If the file is a `.cs` file, hand off to `@backend-tests`:

> Invoke `@backend-tests` with the following context:
>
> Generate NUnit unit tests for the file above. Cover:
> - Every public method — happy path + error/exception path
> - Controller tests: mock Service, assert HTTP status codes
> - Service tests: mock Repository, assert business logic
> - Repository tests: use MockQueryable.Moq, assert EF Core calls
> - Minimum **95% coverage** floor
> - No real I/O — no DB connections, no HTTP calls
> - Controllers disposed in `[TearDown]`
> - No invented class/method names — verify against source file
> - Follow `GUARDRAILS-code.instructions.md` § 7f and `testing-standards.instructions.md`

---

## Step 3 — For .ts / .tsx files: invoke @frontend-tests

If the file is a `.ts` or `.tsx` file, hand off to `@frontend-tests`:

> Invoke `@frontend-tests` with the following context:
>
> Generate Vitest + React Testing Library unit tests for the file above. Cover:
> - Every exported function, hook, and component — happy path + error path
> - Controller hooks (`useXxxController`): test state changes and handler outcomes
> - Components: render, interaction, conditional display
> - Use `vi.mock()` for direct mocking — no `QueryClientProvider` wrapping
> - All async operations: `await act(async () => { ... })` and `waitFor`
> - Assert on **behavior** not existence — `toBeDefined()` alone is forbidden
> - Minimum **90% coverage** floor
> - No PII or real credentials in test data
> - Follow `GUARDRAILS-code.instructions.md` § 7g and `testing-standards.instructions.md`

---

## Step 4 — Output

After tests are generated:
1. Run the test suite and confirm it compiles/passes
2. Report coverage achieved
3. Flag any gaps below the coverage floor
