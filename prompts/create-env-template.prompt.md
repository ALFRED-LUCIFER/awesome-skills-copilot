---
name: create-env-template
description: Scan codebase for environment variable references and generate a documented .env.example file
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [search/codebase, edit, execute/runInTerminal]
---

Generate a .env.example from this project's codebase.

## Step 1 — Scan for env vars

```bash
# Find all environment variable references
grep -rn "process\.env\.\|os\.environ\|Environment\.GetEnvironmentVariable\|env::\|std::env::" --include="*.ts" --include="*.js" --include="*.cs" --include="*.py" --include="*.rs" --include="*.go" . | grep -v node_modules | grep -v bin/
```

## Step 2 — Categorize

Group variables by concern (DATABASE, AUTH, CACHE, FEATURE, LOG, etc.) and determine which are required vs optional.

## Step 3 — Generate .env.example

Create .env.example with grouped variables, comments explaining each, and placeholder values. Add .env to .gitignore if missing.
