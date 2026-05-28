# knowledge-init Skill

Builds and maintains a **living knowledge base** for any application repository — domain by domain, feature by feature.

## What it produces

For every domain/feature folder in the target repo:

- **`{folder}/AGENTS.md`** — navigation index (entities, entry points, key files, links to docs). VS Code Copilot reads this automatically when you open a file in that folder. **No deep knowledge here — navigation only.**
- **`docs/{domain}/`** — a folder containing:
  - **`_overview.md`** — bounded context, key entities, business rules, external contracts, known gotchas
  - **`{feature-name}.md`** — one file per distinct feature/flow (only created if ≥ 2 distinct features exist)
- **`docs/INDEX.md`** — master table across all domains with optional project metadata.

> **No duplication**: AGENTS.md is a navigational index only. Deep knowledge lives exclusively in `docs/{domain}/`.

## Invocation

```bash
/knowledge-init                  # full scan — create all missing files
/knowledge-init Orders           # scope to one domain folder
/knowledge-init --update         # refresh only stale domains (from drift log)
/knowledge-init --meta-only      # update project metadata in INDEX.md only
```

## Project metadata (first run)

On first run you are prompted for **optional** fields stored in `docs/INDEX.md`:

| Field | Example |
|-------|---------|
| Application name | `lis.inventory` |
| Value Stream | `Value Stream 3` |
| Confluence space URL | `https://confluence.example.com/display/NG` |
| Jira project key(s) | `NG, ELISE` |
| Jira Epic link(s) | `NG-100, NG-200` |

All fields are optional — press Enter to skip. On subsequent runs these are preserved and not re-prompted.

## Update safety

Sections marked `<!-- manual -->` in any generated doc are **never overwritten** on `--update`. Only auto-generated sections are refreshed.

## Companion hook

The `knowledge-drift` hook runs at `sessionEnd` and detects which source files changed during the session. It maps changed files to their domain folder and writes a `STALE:` entry to `.copilot/memories/repo/knowledge-drift.md`. The next `/knowledge-init --update` reads this log to know what to refresh.

## Scope: knowledge only

This skill captures **what the code does** — domain knowledge, entity relationships, business rules, flows. It does **not** duplicate:

- Coding standards → `GUARDRAILS-code.instructions.md`
- Test patterns → `testing-standards.instructions.md`
- Deployment / CI docs → repo-specific docs

## AGENTS.md format

```markdown
# {Domain} — Agent Index
> Full knowledge: docs/{domain}/

## Purpose
{1-2 sentence bounded context}

## Key Entities
| Entity | File | Role |

## Entry Points
| Type | File | Description |

## External Dependencies
| Dependency | Direction | Purpose |

## Key Files
| File | Role |

## Navigation
- 📂 docs/{domain}/ — full knowledge docs
- 📄 docs/{domain}/_overview.md — overview
- 🗂️ docs/INDEX.md — master index
```

## docs/{domain}/ structure

```
docs/
  {domain}/
    _overview.md          # bounded context, entities, rules, gotchas
    {feature-name}.md     # one per distinct feature (only if ≥2 features)
    {another-feature}.md
```

Sections in `_overview.md`: **Bounded Context · Key Entities · Business Rules · External Contracts · Known Gotchas**

Sections in `{feature}.md`: **What this feature does · Flow · Rules & Constraints · Files involved**

## Files

| File | Purpose |
|------|---------|
| `SKILL.md` | Full 8-step workflow for agents to follow |
| `README.md` | This file — user-facing reference |
