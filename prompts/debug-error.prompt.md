---
name: debug-error
description: Paste an error message or stack trace and get a structured root cause analysis with ranked hypotheses and fixes
argument-hint: Paste the error message or stack trace
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [search/codebase, edit, execute/runInTerminal]
---

Debug this error: `${input:error:Paste the error message or stack trace}`

## Step 1 — Parse Error

Extract the error type, message, file references, and innermost exception from the input.

## Step 2 — Read Source Files

Read every file:line referenced in the stack trace (±20 lines context).

## Step 3 — Check Recent Changes

```bash
# Recent commits to affected files
git log --oneline -10 -- ${affectedFiles}
```

## Step 4 — Rank Root Causes

Present a table of hypotheses ranked by likelihood with evidence for/against.

## Step 5 — Suggest Fix

For the top 2 candidates, provide concrete fixes with exact file:line references. If confident, apply the fix directly.
