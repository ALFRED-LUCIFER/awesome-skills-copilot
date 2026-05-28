---
name: update-copilot-instructions
description: Maintain  files — scan for duplications vs agents, or update a specific section
argument-hint: "--scan  OR  [filename] [section]  e.g. GUARDRAILS-code.instructions.md §10"
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [edit/editFiles, search/codebase]
---

Mode: `${input:mode:--scan to find duplicates across instructions + agents, OR [filename] [section] to update a section}`

---

## Mode A — `--scan` (deduplication and health check)

Run this mode when `${input:mode}` is `--scan` or empty.

### A1 — Inventory all instruction files

Read every file in ``:
- `GUARDRAILS-core.instructions.md`
- `GUARDRAILS-code.instructions.md`
- `GUARDRAILS-orchestration.instructions.md`
- `GUARDRAILS.instructions.md`
- `auth-patterns.instructions.md`
- `backend-patterns.instructions.md`
- `cypress-patterns.instructions.md`
- `ef-migration-patterns.instructions.md`
- `filters.instructions.md`
- `platform-common.instructions.md`
- `platform-dev.instructions.md`
- `platform-mrt.instructions.md`
- `platform-mui.instructions.md`
- `testing-standards.instructions.md`

### A2 — Inventory all agent definitions

Read every `.agent.md` file in `agents/`.

### A3 — Detect duplicate rules

For each rule in the instruction files, check if:
1. An **identical rule** already appears in an agent definition (word-for-word or paraphrased)
2. A **conflicting rule** exists (instruction says X, agent says not-X)
3. A **broken cross-reference** exists (e.g. "see § 12" but § 12 does not exist, or agent name has changed)

### A4 — Detect stale content

Check for:
- Section numbers referenced that no longer exist
- Agent names referenced that no longer match `agents/*.agent.md` filenames
- `applyTo:` globs that no longer match the actual file patterns in the repo

### A5 — Produce deduplication report

---

## Deduplication Report

### Duplicate rules

| Instruction file + section | Agent file + section | Recommendation |
|--------------------------|---------------------|---------------|
| [file:§] | [agent:section] | Remove from instruction / strengthen agent ref |

### Conflicting rules

| Rule | Instruction says | Agent says | Recommended resolution |
|------|-----------------|-----------|----------------------|

### Broken cross-references

| File | Reference | Issue | Fix |
|------|-----------|-------|-----|

### Stale content

[List any agent names, section numbers, or globs that are out of date]

### Proposed actions

[Ordered list of recommended consolidation steps — do NOT apply any changes automatically]

> ⚠️ No changes are written in `--scan` mode. Review this report and re-run with a targeted update if you want to apply any of the proposed actions.

---

## Mode B — Targeted section update

Run this mode when `${input:mode}` is `[filename] [section]`, e.g. `GUARDRAILS-code.instructions.md §10`.

### B1 — Read the target file

Read the full content of the instruction file named in `${input:mode}`.

### B2 — Locate the section

Find the section heading that matches the section identifier from `${input:mode}`.

### B3 — Ask for new content

Ask the user:
> "I've read section `[section]` in `[filename]`. Please provide the updated content for this section — I'll show you a diff before writing."

### B4 — Show diff before writing

Present the before/after as a unified diff and ask for confirmation:
> "Here is what will change. Confirm to apply, or provide corrections."

**Do NOT write the file until the user explicitly confirms.**

### B5 — Apply the change (only after confirmation)

1. Update only the target section — leave all other content untouched
2. Keep existing section numbering intact
3. Keep the `applyTo:` frontmatter glob unchanged unless explicitly asked to change it
4. Fix any cross-references that break as a result of the change

### B6 — Update the cross-reference table

If the change affects a section that is listed in the Section → File quick reference table in `GUARDRAILS.instructions.md`, update that table entry too.

### B7 — Confirm

Report: `✅ [filename] [section] updated. No other files modified.`
