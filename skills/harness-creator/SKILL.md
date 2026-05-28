---
name: harness-creator
description: Validates and scaffolds the five harness subsystems (Instructions, State, Verification, Scope, Lifecycle) for a project repository. Run before Long Build mode or when onboarding a new project. Scores each subsystem and creates missing files from templates.
version: "1.0.0"
---

# Harness Creator

## When to Use

- Before enabling Long Build mode (autonomous multi-sprint builds)
- Onboarding a new project repository for agent usage
- Auditing agent harness completeness

## Rules

1. Run against the TARGET project repo — not against awesome-skills-copilot
2. Score each subsystem as PASS/PARTIAL/FAIL based on criteria below
3. Create missing files from templates — never overwrite existing files
4. A complete harness requires all 5 subsystems at PASS
5. PARTIAL = file exists but missing required content; scaffold the missing parts
6. Based on Anthropic "Harness design for long-running application development" (2026-03-24)

## Steps

1. **Score Instructions** — check for AGENTS.md/CLAUDE.md/copilot-instructions.md with stack info + build commands + GUARDRAILS reference
2. **Score State** — check for memories/repo/ or .state/ with project context, decisions, known issues
3. **Score Verification** — check for test commands that exit non-zero on failure, CI config, lint config
4. **Score Scope** — check for .gitignore patterns, file-level instructions (applyTo), folder boundaries defined
5. **Score Lifecycle** — check for hooks (session start/end), commit conventions, branch strategy docs
6. **Report** — print 5-subsystem scorecard (PASS/PARTIAL/FAIL + reason)
7. **Scaffold** — for each FAIL/PARTIAL, create missing files from templates with project-specific values

## Scoring Criteria

| Subsystem | PASS requires |
|-----------|--------------|
| Instructions | Agent file exists + has stack + has build/test commands + references standards |
| State | Memory/state folder exists + has project context file |
| Verification | Test command defined + CI config exists + lint config exists |
| Scope | .gitignore exists + agent scope boundaries defined |
| Lifecycle | At least 1 hook configured OR commit convention documented |

## Reference

See [./examples.md](./examples.md) for scaffold templates, scoring script, and worked audit example.
