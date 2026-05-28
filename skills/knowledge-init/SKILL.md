---
name: knowledge-init
description: Build or refresh a living knowledge base for any application repo — creates per-domain AGENTS.md navigation indexes and docs/{domain}/ knowledge folders (with per-feature files) so LLMs can find domain knowledge without exhausting tokens. App/repo level — not tied to any specific tech stack.
argument-hint: "[domain-folder] | --update | --meta-only"
---

# Knowledge Init Skill

Systematically maps every domain/feature folder of the target repository into these artefacts:

1. **`{folder}/AGENTS.md`** — 1-page navigation index (key entities, entry points, files, links to docs). VS Code Copilot reads this automatically when working in that folder.
2. **`docs/{domain}/`** — a folder containing:
   - **`_overview.md`** — bounded context, data model, business rules, external contracts, known gotchas
   - **`{feature-name}.md`** — one file per distinct feature/sub-domain (only when ≥ 2 features exist)
3. **`docs/INDEX.md`** — master table across all domains with optional project metadata (Jira, Confluence, Value Stream).

> **No duplication rule**: AGENTS.md is a navigational index only — it must NOT duplicate deep knowledge from docs/{domain}/. Link to it instead.

> **Scope**: domain knowledge only — what the code *does*. Never coding standards, never test patterns, never deployment docs. Those live in GUARDRAILS and instructions files.

---

## Invocation Modes

| Command | Behaviour |
|---------|-----------|
| `/knowledge-init` | Full scan — create all missing AGENTS.md and docs/ files. Prompt for project metadata on first run. |
| `/knowledge-init [domain]` | Scope to one domain folder only (e.g. `/knowledge-init Orders`). |
| `/knowledge-init --update` | Diff-mode — refresh only domains flagged in `.copilot/memories/repo/knowledge-drift.md`, or domains where source files are newer than their docs. |
| `/knowledge-init --meta-only` | Update project metadata block in `docs/INDEX.md` without touching domain docs. |

---

## Step 0 — Detect Mode and Check Drift Log

```bash
# Check if this is an update run
DRIFT_FILE=".copilot/memories/repo/knowledge-drift.md"
INDEX_FILE="docs/INDEX.md"

# On --update: read stale domains from drift log
if [[ -f "$DRIFT_FILE" ]]; then
  echo "=== Stale domains flagged by knowledge-drift hook ==="
  grep "STALE:" "$DRIFT_FILE" | tail -20
fi

# Check if this is first run (no INDEX.md yet)
if [[ ! -f "$INDEX_FILE" ]]; then
  echo "FIRST_RUN=true"
fi
```

On first run (`FIRST_RUN=true`): prompt the user for optional project metadata (Step 1).  
On `--update`: only process domains listed in the drift log, then clear those entries.  
Otherwise: process all discovered domains.

---

## Step 1 — Collect Project Metadata (First Run Only / `--meta-only`)

Ask the user for the following **optional** fields. If the user skips, leave as `TBD`.

```
Project metadata (all optional — press Enter to skip each):

1. Application / Repo name: ___________
2. Value Stream name (e.g. "Value Stream 3"): ___________
3. Confluence space URL (e.g. https://confluence.example.com/display/PROJ): ___________
4. Jira project key(s) (comma-separated, e.g. NG,ELISE): ___________
5. Jira Epic link(s) (comma-separated, e.g. NG-100,NG-200): ___________
```

Store this in the metadata block at the top of `docs/INDEX.md` (see Step 6 template).  
On subsequent runs (`--update`), skip this step if the block already has non-TBD values.

---

## Step 2 — Discover Domain Folders

Use parallel subagent exploration. Look for domain/feature folder patterns in this order:

```bash
# Pattern A — feature-based (React / NestJS / modular)
ls -d src/features/*/ src/modules/*/ src/pages/*/ 2>/dev/null | sort

# Pattern B — domain-driven (DDD / .NET)
ls -d src/Domain/*/ src/*/Domain/ 2>/dev/null | sort
find . -maxdepth 4 -name 'Domain' -type d 2>/dev/null

# Pattern C — flat service folders (microservices monorepo)
ls -d src/*/ 2>/dev/null | sort

# Pattern D — top-level modules (NestJS, Nx)
ls -d apps/*/ libs/*/ packages/*/ 2>/dev/null | sort

# Exclude noise folders
EXCLUDE="node_modules|dist|build|obj|bin|.git|Migrations|wwwroot|coverage|test|spec"
```

Classify each discovered folder as a **bounded context** (domain with business meaning) vs **infrastructure** (shared utilities, config, logging — document briefly, not deeply).

---

## Step 3 — Analyse Each Domain (up to 5 parallel subagents)

For each domain folder, read the following file types (adapt to tech stack found):

### .NET domains
```bash
find {domain}/ -name '*.cs' | grep -E 'Controller|Service|Repository|Entity|Dto|Event|Command|Query|Constants|Configuration' | head -30
```

### React / TypeScript domains
```bash
find {domain}/ -name '*.ts' -o -name '*.tsx' | grep -E 'Controller|Service|hook|api|query|mutation|type|interface|constant|slice|store' | head -30
```

### Extract from these files:
- **Purpose** — what business problem does this domain solve?
- **Key entities** — data objects and their relationships (do not copy code — describe in plain English)
- **Entry points** — API routes, event handlers, queue consumers, UI routes
- **External dependencies** — which other domains does this depend on? Which external services/queues/DBs?
- **Business rules** — constraints, validations, workflows that are non-obvious
- **Known gotchas** — things that surprised you or are easy to get wrong

---

## Step 4 — Write `docs/{domain}/` folder

Create the `docs/{domain}/` folder (if it doesn't exist). Then:

**Before creating any file**: scan the existing files in `docs/{domain}/` for overlapping content. If a file already covers the same entities or flows, update it rather than create a duplicate.

On update: preserve any section marked `<!-- manual -->` verbatim. Regenerate all other sections.

### `docs/{domain}/_overview.md`

Always create/update this file — it is the master summary for the domain.

```markdown
# {Domain} — Overview

<!-- meta: generated={date} | reviewed=false -->
> Status: auto-generated | Last updated: {date}  
> Source folder: `{relative-path}/`  
> AGENTS.md: [{relative-path}/AGENTS.md]({relative-path}/AGENTS.md) | Index: [docs/INDEX.md](../INDEX.md)

---

## Bounded Context

{1-3 sentences: what business problem this domain owns, what it does NOT own}

---

## Key Entities

| Entity | Description | Key Fields |
|--------|-------------|------------|
| {Entity} | {what it represents} | {important fields, not all fields} |

---

## Business Rules

<!-- manual -->
{List the non-obvious constraints and invariants. E.g.: "An Order cannot be cancelled after it enters Dispatched status."}
<!-- /manual -->

---

## External Contracts

| Dependency | Type | What this domain does with it |
|------------|------|-------------------------------|
| {ServiceName} | REST API / Queue / DB Table / Domain | {read/write/subscribe + purpose} |

---

## Known Gotchas

<!-- manual -->
{List things that are easy to get wrong or surprised the team. E.g.: "TenantId must always be scoped — raw queries bypass this."}
<!-- /manual -->

---

*Auto-generated by `#knowledge-init`. Edit sections marked `<!-- manual -->` to preserve on next update.*
```

### `docs/{domain}/{feature-name}.md` (one per distinct feature — only if ≥ 2 features exist)

Create one file per distinct user-facing feature or significant sub-domain flow. Skip if the domain has only one cohesive feature (put everything in `_overview.md` instead).

**Deduplication check**: before creating, run `ls docs/{domain}/` and read existing files. If a file already covers this feature, update it in-place.

```markdown
# {Domain} — {Feature Name}

<!-- meta: generated={date} -->
> Overview: [_overview.md](./_overview.md) | Index: [docs/INDEX.md](../INDEX.md)

## What this feature does

{1-2 sentence summary — do NOT repeat the bounded context from _overview.md}

---

## Flow

**{FlowName}**
1. {trigger}
2. {what happens step by step}
3. {outcome / side effects}

---

## Rules & Constraints

{Feature-specific business rules only — no duplication of _overview.md Business Rules section}

---

## Files involved

| File | Role |
|------|------|
| `{relative-path}` | {1-line description} |

---

*Auto-generated by `#knowledge-init`.*
```

---

## Step 5 — Write/Update `{folder}/AGENTS.md`

Create or update `{folder}/AGENTS.md` using this template.

**Navigation index only** — do NOT copy or repeat knowledge from `docs/{domain}/`. Link to it.

On update: replace the entire file (it is fully auto-generated — no manual sections).

```markdown
# {Domain} — Agent Index

> Memory map for AI agents. Last updated: {date}  
> Full knowledge: [docs/{domain}/](../../docs/{domain}/)  
> _(This file is auto-generated by `#knowledge-init`. Do not edit manually.)_

---

## Purpose

{1-2 sentence bounded context — what this domain owns}

---

## Key Entities

| Entity | File | Role |
|--------|------|------|
| {EntityName} | `{relative-file-path}` | {1-line role} |

---

## Entry Points

| Type | File | Description |
|------|------|-------------|
| {REST / Event / UI Route / Queue} | `{file}` | {what triggers it} |

---

## External Dependencies

| Dependency | Direction | Purpose |
|------------|-----------|---------|
| {Domain/Service} | in / out / both | {why this domain needs it} |

---

## Key Files

| File | Role |
|------|------|
| `{relative-path}` | {1-line description of what this file does} |

---

## Quick Navigation

- � [Full Knowledge Docs](../../docs/{domain}/)
- 📋 [Domain Overview](../../docs/{domain}/_overview.md)
- 🗂️ [Master Index](../../docs/INDEX.md)
```

---

## Step 6 — Write/Update `docs/INDEX.md`

Create or update `docs/INDEX.md` as the master knowledge index.

On update: refresh the domain table and last-updated dates; preserve the metadata block.

```markdown
# Application Knowledge Index

<!-- project-metadata
application: {name | TBD}
value-stream: {name | TBD}
confluence: {url | TBD}
jira-projects: {comma-separated keys | TBD}
jira-epics: {comma-separated links | TBD}
generated: {date}
-->

> Master knowledge base index. Generated by `#knowledge-init`.  
> To update: run `/knowledge-init --update` after code changes.

---

## Project Context

| Field | Value |
|-------|-------|
| Application | {name} |
| Value Stream | {name} |
| Confluence | [{url}]({url}) |
| Jira Projects | {keys} |
| Jira Epics | {links} |

---

## Domain Map

| Domain | Folder | AGENTS.md | Knowledge Docs | Last Updated |
|--------|--------|-----------|----------------|--------------|
| {Domain} | `{path}/` | [Index]({path}/AGENTS.md) | [docs/{domain}/](docs/{domain}/) | {date} |

---

## Infrastructure / Shared

| Module | Folder | Purpose |
|--------|--------|---------|
| {Module} | `{path}/` | {brief purpose} |

---

*Stale domain alerts: check [`.copilot/memories/repo/knowledge-drift.md`](.copilot/memories/repo/knowledge-drift.md)*
```

---

## Step 7 — Clear Processed Drift Entries

If running in `--update` mode, after successfully refreshing a domain, remove its entries from `.copilot/memories/repo/knowledge-drift.md`:

```bash
# Remove STALE entries for domains just refreshed
DRIFT_FILE=".copilot/memories/repo/knowledge-drift.md"
if [[ -f "$DRIFT_FILE" ]]; then
  # Mark refreshed entries with RESOLVED prefix
  sed -i "s/STALE: {domain}\//RESOLVED: {domain}\//g" "$DRIFT_FILE"
fi
```

---

## Step 8 — Report

Print a summary table:

```markdown
## Knowledge Init — Results

| File | Status | Domain |
|------|--------|--------|
| docs/INDEX.md | created / updated | — |
| docs/{domain}/_overview.md | created / updated / skipped | {domain} |
| docs/{domain}/{feature}.md | created / updated | {domain} |
| {folder}/AGENTS.md | created / updated / skipped | {domain} |

**Total**: {N} domains processed | {N} files created | {N} files updated | {N} skipped (unchanged)

Next: run `/knowledge-init --update` after significant code changes, or let the `knowledge-drift` hook flag stale domains automatically.
```

---

## Notes for the Agent

- **Token efficiency is the goal** — AGENTS.md files must be scannable in < 50 tokens. Prefer tables over prose. Cut everything not needed to orient an LLM.
- **No coding standards** — standards live in GUARDRAILS. Do not duplicate them here.
- **No copy-paste code** — describe what exists, never reproduce it.
- **Language-agnostic** — adapt the discovery bash commands to whatever stack the repo uses (.NET, React, Node, Python, etc.).
- **Depth over breadth per domain** — it is better to deeply understand 3 domains than to shallowly skim 10.
- **Parallelism cap** — spawn max 5 subagent explorations simultaneously to avoid token overload.
- **`<!-- manual -->` sections** are sacred — never overwrite them on `--update`.
