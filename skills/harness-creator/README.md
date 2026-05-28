# Harness Creator

A validation and scaffolding skill for auditing and bootstrapping agent harnesses in your project project repositories.

Scores the five harness subsystems and creates any missing files from templates calibrated for the `.NET 10 + React/TypeScript` stack.

## Install

Already available via `awesome-skills-copilot` — no separate install needed.

## Use

Invoke via chat:

```
@orchestrator validate this project's harness
```

or invoke the skill directly:

```
#skill:harness-creator
```

## What It Checks (5 Subsystems)

1. **Instructions** — `AGENTS.md` or `CLAUDE.md` exists; references GUARDRAILS; lists verification commands
2. **State** — `progress.md` and `session-handoff.md` exist in `.copilot/memories/repo/`
3. **Verification** — build/test commands present; CI config detected; quality gates defined
4. **Scope** — GUARDRAILS reference exists; feature boundary defined; `maxSprints` limit set
5. **Lifecycle** — session-logger, knowledge-drift hooks wired; gotcha file initialised

## What It Creates (if missing)

- `AGENTS.md` — project-level agent instructions (from template)
- `.copilot/memories/repo/progress.md` — sprint feature tracker
- `.copilot/memories/repo/session-handoff.md` — context-reset handoff artifact
- `.copilot/memories/repo/discovered-gotchas.md` — gotcha accumulator

## Score Output

```
Harness Health: 4/5 subsystems passing
✅ Instructions
✅ State
✅ Verification
⚠️  Scope — missing maxSprints limit
✅ Lifecycle

Verdict: WARN — fix Scope before running Long Build mode
```

Pass threshold: 5/5 for Long Build mode; 4/5 for standard feature builds.
