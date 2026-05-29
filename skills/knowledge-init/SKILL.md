---
name: knowledge-init
description: Build or refresh a living knowledge base for any application repo — creates per-domain AGENTS.md navigation indexes and docs/{domain}/ knowledge folders (with per-feature files) so LLMs can find domain knowledge without exhausting tokens. App/repo level — not tied to any specific tech stack.
argument-hint: "[domain-folder] | --update | --meta-only"
---

# Knowledge Init

## When to Use

- First time onboarding a new repository
- After significant code changes (new domains/features)
- When `knowledge-drift` hook flags stale domains
- To refresh project metadata (`--meta-only`)

## Rules

1. **Root `AGENTS.md` is mandatory** — always create/update a top-level `AGENTS.md` at the project root, regardless of project type or stack. This is the single source of truth for AI navigation.
2. AGENTS.md = navigation index only — never duplicate deep knowledge from docs/
3. Domain knowledge only (what code *does*) — never coding standards, test patterns, or deployment docs
4. Preserve `<!-- manual -->` sections on updates — never overwrite them
5. Max 5 parallel subagent explorations to avoid token overload
6. Deduplication: scan existing docs/ files before creating — update in-place if overlap found
7. Tables over prose — cut everything not needed to orient an LLM
8. No copy-paste code — describe what exists, never reproduce source
9. Language-agnostic — adapt discovery to whatever stack the repo uses
10. Classify folders as bounded-context (deep docs) vs infrastructure (brief mention)
11. On `--update`: only process domains in drift log, then clear processed entries
12. **Claude/Copilot config alignment** — if `CLAUDE.md`, `.claude/settings.json`, `copilot-instructions.md`, `.github/copilot-instructions.md`, or `.copilot-instructions.md` exist, update them to reference the root `AGENTS.md` as the canonical navigation index. Never duplicate the directory map in these files — they should point to `AGENTS.md` only.

## Steps

1. **Detect mode** — check for `docs/INDEX.md` (first run?), read `knowledge-drift.md` for stale domains, determine scope (full/single-domain/update/meta-only)
2. **Collect metadata** (first run only) — ask user for app name, value stream, Confluence URL, Jira keys/epics; store in INDEX.md metadata block
3. **Discover domains** — scan `src/features/`, `src/Domain/`, `apps/`, `libs/`, `packages/` etc.; exclude noise (node_modules, dist, bin, Migrations)
4. **Analyse each domain** — read Controllers, Services, Entities, DTOs, hooks, queries; extract purpose, key entities, entry points, external deps, business rules, gotchas
5. **Write `docs/{domain}/_overview.md`** — bounded context, entity table, business rules, external contracts, gotchas
6. **Write `docs/{domain}/{feature}.md`** — one per distinct feature (only if ≥2 features exist in domain)
7. **Write root `AGENTS.md`** — top-level project navigation index at repo root. Links to all domain docs/, lists directory map, key files, and purpose. This file is the single source of truth for all AI agents.
8. **Write `{folder}/AGENTS.md`** — per-domain navigation index linking to docs/ (fully auto-generated, no manual sections)
9. **Write `docs/INDEX.md`** — master table of all domains with metadata and links
10. **Align AI config files** — scan for `CLAUDE.md`, `copilot-instructions.md`, `.github/copilot-instructions.md`, `.copilot-instructions.md`. If found, ensure they contain a pointer to `AGENTS.md` (e.g., `See [AGENTS.md](AGENTS.md) for repository navigation and architecture.`). Remove any duplicated directory maps or domain listings — `AGENTS.md` is the single source of truth.
11. **Clear drift entries** — remove processed STALE entries from knowledge-drift.md
12. **Report** — print summary table of files created/updated/skipped

## Reference

See [./examples.md](./examples.md) for full file templates (AGENTS.md, _overview.md, feature.md, INDEX.md) and discovery commands per tech stack.
