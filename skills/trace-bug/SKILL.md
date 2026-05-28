---
name: trace-bug
description: Structured root-cause analysis from error messages or stack traces — ranks causes by likelihood and provides targeted fixes
---

# Trace Bug Skill

Perform a structured root-cause analysis from a pasted error message or stack trace.

## Step 1 — Parse the Error

Extract:
- **Error type**: e.g. `NullReferenceException`, `TypeError`, `500 Internal Server Error`, `EF Core migration failed`
- **Error message**: the human-readable description
- **File references**: every `at FileName.cs:line` or `at FileName.ts:line` mentioned
- **Innermost exception**: if nested, start from the deepest cause

## Step 2 — Read Referenced Source Files

For each file:line reference:
1. Read the file at that location (±20 lines around the referenced line)
2. Identify what the code is doing at that exact point
3. Note the method signature and what it receives/returns

## Step 3 — Trace the Call Chain Upward

From the innermost frame, walk up the stack:
1. Identify the calling method for each frame
2. Read each calling file if not already read
3. Map: `A calls B calls C → error thrown at C`
4. Identify where incorrect data or a wrong assumption first enters the chain

## Step 4 — Search for Related Patterns

```bash
# Search for the same method name used elsewhere
grep -r "[method_name_from_error]" --include="*.cs" --include="*.ts" --include="*.tsx" -n | head -15

# Check recent changes to affected files
git log --oneline -10 -- [affected_file]
```

## Step 5 — Rank Root Cause Candidates

| Rank | Candidate | Evidence | Confidence |
|------|-----------|----------|-----------|
| 1 | [description] | [what in the code supports this] | High / Medium / Low |
| 2 | [description] | [evidence] | High / Medium / Low |
| 3 | [description] | [evidence] | High / Medium / Low |

## Step 6 — Suggest Targeted Fixes

For the top 2–3 candidates, provide concrete fixes with exact file:line references:

```markdown
### Root-Cause Analysis

**Error**: [type] — [message]
**Location**: [file:line]

### Call Chain
ControllerMethod (file:line)
  → ServiceMethod (file:line)
    → RepositoryMethod (file:line)  ← error here

### #1 (Most likely) — [short title]
> [1–2 sentence explanation]
> **Fix** — `[file]` line [n]:
> Before: [problematic code]
> After: [fixed code]
```
