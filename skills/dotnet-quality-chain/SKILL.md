---
name: dotnet-quality-chain
description: >
  Executes the mandatory backend quality chain: build → migration auto-detect →
  unit tests → code review. Enforces GUARDRAILS § 12b. Portable across VS Code,
  Copilot CLI, and cloud agents.
---

# Mandatory Backend Chain

> **Portable Skill** — implements GUARDRAILS § 12b as a reusable workflow.

## Chain Steps

```
@backend → @migration (if schema change) → @backend-tests → @reviewer --full
```

### Step 1 — Build
1. Run `dotnet build` in the correct project directory
2. Must produce 0 errors and 0 warnings (treat warnings as errors)
3. If errors: classify as `COMPILE_ERROR`, fix, re-build

### Step 2 — Migration Auto-Detection
1. Check if the entity is **new**: `grep -r "CreateTable.*{EntityName}" Migrations/`
2. Check if columns/types changed vs existing migration snapshots
3. If schema change detected → delegate to `@migration`
4. Skip if `MIGRATION_AUTO_DETECT: false` override is set

### Step 3 — Unit Tests
- Delegate to `@backend-tests`
- Must cover: happy path + error paths for every CRUD operation
- Minimum coverage: `BACKEND_COVERAGE_MIN` (default 95%)
- Patterns: NUnit + Moq + MockQueryable
- **Persona-centric testing**: Tests MUST cover operator, admin, and viewer personas with realistic permission scenarios
- **Value data**: Use realistic business data (material names, cutting dimensions, order IDs) — not generic "test123" or "foo"

### Step 4 — Code Review
- Delegate to `@reviewer --full`
- Pass threshold: `REVIEW_PASS_THRESHOLD` (default ≤ 5)
- On failure: route findings to `@backend` → fix → re-review
- Max iterations: `MAX_REVIEW_ITERATIONS` (default 3)

## Response Contract

When invoked as a sub-agent, return:

```json
{
  "chain": "backend",
  "status": "PASS | FAIL",
  "steps": {
    "build": { "status": "PASS", "errors": 0, "warnings": 0 },
    "migration": { "status": "SKIPPED | PASS", "reason": "no schema change", "operations": [] },
    "unitTests": { "status": "PASS", "testCount": 18, "coverage": "96%" },
    "review": { "status": "PASS", "score": 4, "iterations": 1 }
  },
  "filesGenerated": ["*Tests.cs", "*.migration.cs"],
  "overridesApplied": []
}
```

## Quality Threshold Overrides

Read from the project's `copilot-instructions.md`:
- `BACKEND_COVERAGE_MIN` — minimum test coverage
- `MIGRATION_AUTO_DETECT` — whether to auto-check for schema changes
- `REVIEW_PASS_THRESHOLD` — review score gate
- `MAX_REVIEW_ITERATIONS` — fix/re-review loop limit
