---
name: harness-creator
description: Validates and scaffolds the five harness subsystems (Instructions, State, Verification, Scope, Lifecycle) for a Copilot Agent System project repository. Run before Long Build mode or when onboarding a new project. Scores each subsystem and creates missing files from templates.
version: "1.0.0"
stack: [".NET 10", "React 19", "TypeScript", "Vitest", "NUnit", "Cypress"]
---

# Harness Creator Skill

## Purpose

Evaluate whether a project repository has a complete agent harness, and scaffold any missing parts.
A complete harness is required for Long Build mode (autonomous multi-sprint builds).

Based on:
- Anthropic "Harness design for long-running application development" (2026-03-24)
- walkinglabs/learn-harness-engineering — five-subsystem model

---

## Workflow

### Step 1 — Score the Five Subsystems

Run this audit against the **target project repository** (not `.github-private`).

#### Subsystem 1: Instructions

Check for an agent instruction file:

```bash
ls AGENTS.md CLAUDE.md .github/copilot-instructions.md 2>/dev/null | head -1
```

Score PASS if:
- File exists
- Contains a reference to GUARDRAILS (or equivalent coding standards)
- Lists at least one build/test verification command
- Defines the technology stack

#### Subsystem 2: State

Check for state-continuity files:

```bash
ls .copilot/memories/repo/progress.md \
   .copilot/memories/repo/session-handoff.md 2>/dev/null
```

Score PASS if both files exist with non-placeholder content.

#### Subsystem 3: Verification

Check that executable quality gates exist:

```bash
# .NET backend
ls *.sln **/*.csproj 2>/dev/null | head -1 && echo "dotnet build + dotnet test gates"

# Frontend
ls package.json 2>/dev/null && grep -q '"test"' package.json && echo "npm test gate"

# CI
ls .github/workflows/*.yml .github/workflows/*.yaml 2>/dev/null | head -1
```

Score PASS if at least one build gate and one test gate are verifiable.

#### Subsystem 4: Scope

Check for boundary definitions:

```bash
grep -r "maxSprints\|MAX_SPRINTS\|sprint.*limit\|max.*sprint" \
  AGENTS.md CLAUDE.md .github/copilot-instructions.md 2>/dev/null | head -5
```

Score PASS if:
- A sprint/feature limit is defined (prevents runaway autonomous builds)
- Tech stack scope is explicitly stated (e.g., ".NET 10 + React only")

Score WARN (not FAIL) if missing — add a `maxSprints` note to AGENTS.md.

#### Subsystem 5: Lifecycle

Check hooks are wired in the parent `.github-private` repo (not the project repo):

```bash
# From .github-private
cat hooks/session-logger/hooks.json
cat hooks/knowledge-drift/hooks.json
ls .copilot/memories/repo/discovered-gotchas.md 2>/dev/null
```

Score PASS if session-logger and knowledge-drift hooks fire at `sessionEnd`.

---

### Step 2 — Create Missing Files

For each failing subsystem, scaffold the missing artifact.

#### Missing: AGENTS.md

Create `AGENTS.md` in the project root:

```markdown
# AGENTS.md — {{PROJECT_NAME}}

## Stack
- Backend: .NET 10, C#, EF Core, PostgreSQL
- Frontend: React 19, TypeScript, MUI 7
- Tests: NUnit + Moq (backend), Vitest + RTL (frontend), Cypress (E2E)

## Build Gates
```bash
dotnet build --configuration Release
dotnet test --no-build
cd frontend && npm run build && npm test
```

## Verification Commands
```bash
dotnet build 2>&1 | tail -5         # expect: Build succeeded
dotnet test  2>&1 | grep -E "Passed|Failed"
npm test     2>&1 | grep -E "passed|failed"
```

## Scope
- Stack: .NET 10 + React/TypeScript only. Stop if Python, Go, or other.
- maxSprints: 8 (warn user before sprint 6 of autonomous builds)
- Domain boundary: `src/domain/` — zero cross-domain imports

## Standards
See `.github-private/.github/instructions/GUARDRAILS-core.instructions.md`
```

#### Missing: progress.md

Copy template from `.github-private/hooks/session-logger/templates/progress.md`, substituting:
- `{{PROJECT_NAME}}` ← `basename $(pwd)`
- `{{TODAY}}` ← current ISO date
- `{{SPRINT_ID}}` ← `1`
- `{{TOTAL_FEATURES}}` ← `0` (user fills in)
- `{{COMPLETED_COUNT}}` ← `0`
- `{{REMAINING_COUNT}}` ← `0`

Save to: `.copilot/memories/repo/progress.md`

#### Missing: session-handoff.md

Copy template from `.github-private/hooks/session-logger/templates/session-handoff.md`, substituting:
- `{{SESSION_ID}}` ← current datetime `YYYY-MM-DD-HHMM`
- `{{TODAY}}` ← current ISO date
- `{{WORKING_DIR}}` ← `$(pwd)`
- `{{PROMPT_COUNT}}` ← `0`
- `{{CHANGED_FILES_SECTION}}` ← `_No changes yet — first session_`
- `{{GOTCHAS_SECTION}}` ← `_None yet_`

Save to: `.copilot/memories/repo/session-handoff.md`

#### Missing: discovered-gotchas.md

```bash
mkdir -p .copilot/memories/repo
cat > .copilot/memories/repo/discovered-gotchas.md << 'EOF'
# Discovered Gotchas

> Auto-captured from sessions. Review before promoting to org-level anti-patterns.

EOF
```

#### Missing: Scope limit in AGENTS.md

Append to existing AGENTS.md:
```
## Scope Limits
- maxSprints: 8
- Cost warning threshold: warn user if estimated session cost > $50
- Context reset: write session-handoff.md before ending any session > 30 prompts
```

---

### Step 3 — Output Harness Health Report

```
## Harness Health Report — {{PROJECT_NAME}}
**Date**: {{TODAY}}

| Subsystem | Status | Detail |
|-----------|--------|--------|
| Instructions | ✅ PASS / ⚠️ WARN / ❌ FAIL | [detail] |
| State | ✅ / ⚠️ / ❌ | [detail] |
| Verification | ✅ / ⚠️ / ❌ | [detail] |
| Scope | ✅ / ⚠️ / ❌ | [detail] |
| Lifecycle | ✅ / ⚠️ / ❌ | [detail] |

**Score**: N/5

**Verdict**:
- 5/5 ✅ — READY for Long Build mode
- 4/5 ⚠️ — OK for standard feature builds; fix warnings before Long Build
- ≤3/5 ❌ — SCAFFOLD required before any autonomous build

**Actions Taken**: [list of files created/updated]
**Remaining Actions**: [list of manual steps required from developer]
```

---

## Notes

- This skill evaluates **structure only** — it does not run a real agent session to test before/after behaviour
- For full validation, run a test session and verify the session-logger produces `session-handoff.md` and `session-summaries/*.md`
- Re-run after adding new features or onboarding a new developer
- Stack constraint: .NET 10 + React/TypeScript. For other stacks, adapt the verification commands in AGENTS.md manually
