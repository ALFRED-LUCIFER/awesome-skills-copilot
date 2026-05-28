---
name: generate-code
description: Generate production-ready code using your project standards — routes to @backend (.NET/C#) or @frontend (React/TypeScript) based on context
argument-hint: Describe what you want to generate, e.g. "CRUD for Machine entity" or "MachineTable component with filter"
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [search/codebase, edit/editFiles, execute/getTerminalOutput, execute/runInTerminal, read/terminalLastCommand, read/terminalSelection, todo, agent, vscode/memory, vscode/askQuestions]
---

Generate production-ready code following your project standards.

**Request**: `${input:request:Describe what to generate, e.g. "CRUD for Machine entity" or "MachineTable component"}`

---

## Step 1 — Detect context

Run the following to determine whether this is a backend (.NET) or frontend (React) workspace:

```bash
# Detect backend (.NET)
find . -name '*.csproj' -not -path '*/node_modules/*' | head -3

# Detect frontend
find . -name 'package.json' -not -path '*/node_modules/*' | head -3
ls src/features 2>/dev/null || ls src/components 2>/dev/null
```

---

## Step 2 — For .NET / C# projects: invoke @backend

If `.csproj` files are found, hand off to `@backend`:

> Invoke `@backend` with the following request:
>
> **Request**: ${input:request}
>
> Generate all required layers in order:
> - DTO(s)
> - AutoMapper Mapping Profile
> - Repository (interface + implementation)
> - Service (interface + implementation)
> - Controller (with JWT auth attributes)
> - Startup / DI registration
> - Constants class for error strings
>
> Enforce:
> - Auto-detect namespace from `.csproj` (never guess)
> - `BaseResponse<T>` on every service/repository method
> - `.ConfigureAwait(false)` on every `await`
> - `IUnitOfWork.CompleteAsync(userEmail)` after create/update/delete
> - JWT `[Authorize]` + role/permission checks on every endpoint
> - No hardcoded strings — use `{ServiceName}Constants`
> - SEC-1 through SEC-24 guardrails enforced
> - Follow `backend-patterns.instructions.md` and `GUARDRAILS-code.instructions.md`

---

## Step 3 — For React / TypeScript projects: invoke @frontend

If `package.json` and `src/features` or `src/components` are found, hand off to `@frontend`:

> Invoke `@frontend` with the following request:
>
> **Request**: ${input:request}
>
> Generate all required layers in order:
> - Types / interfaces (`.types.ts`)
> - TanStack Query hooks (`use*Query.ts`, `use*Mutation.ts`)
> - Controller hook (`useXxxController.ts`) — all state, handlers, business logic here
> - Page/Route component — thin, no logic
> - Table component using `PlatformMrt` (if applicable)
> - Dialog component using `PlatformDialog` / `FormDialog` (if applicable)
>
> Enforce:
> - `PlatformMrt` for all tables — raw MUI Table is **forbidden**
> - `useXxxController` pattern — no `useState`/`useEffect` in page components
> - `react-hook-form` for all forms
> - `data-testid` on every interactive element
> - All user-facing strings use `t('key')` — no hardcoded text
> - No `any` types in TypeScript
> - `theme.platformSpacing.static[n]` for spacing
> - Follow `platform-common.instructions.md`, `platform-mrt.instructions.md`, and `GUARDRAILS-code.instructions.md`

---

## Step 4 — Ambiguous context

If both backend and frontend projects exist, ask the user:

> "This workspace contains both a .NET backend and a React frontend. Should I generate:
> - **A** — Backend (.NET) code with `@backend`
> - **B** — Frontend (React) code with `@frontend`
> - **C** — Both (full-stack)"
