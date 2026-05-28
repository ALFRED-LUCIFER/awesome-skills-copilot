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

1. AGENTS.md = navigation index only — never duplicate deep knowledge from docs/
2. Domain knowledge only (what code *does*) — never coding standards, test patterns, or deployment docs
3. Preserve `<!-- manual -->` sections on updates — never overwrite them
4. Max 5 parallel subagent explorations to avoid token overload
5. Deduplication: scan existing docs/ files before creating — update in-place if overlap found
6. Tables over prose — cut everything not needed to orient an LLM
7. No copy-paste code — describe what exists, never reproduce source
8. Language-agnostic — adapt discovery to whatever stack the repo uses
9. Classify folders as bounded-context (deep docs) vs infrastructure (brief mention)
10. On `--update`: only process domains in drift log, then clear processed entries

## Steps

1. **Detect mode** — check for `docs/INDEX.md` (first run?), read `knowledge-drift.md` for stale domains, determine scope (full/single-domain/update/meta-only)
2. **Collect metadata** (first run only) — ask user for app name, value stream, Confluence URL, Jira keys/epics; store in INDEX.md metadata block
3. **Discover domains** — scan `src/features/`, `src/Domain/`, `apps/`, `libs/`, `packages/` etc.; exclude noise (node_modules, dist, bin, Migrations)
4. **Analyse each domain** — read Controllers, Services, Entities, DTOs, hooks, queries; extract purpose, key entities, entry points, external deps, business rules, gotchas
5. **Write `docs/{domain}/_overview.md`** — bounded context, entity table, business rules, external contracts, gotchas
6. **Write `docs/{domain}/{feature}.md`** — one per distinct feature (only if ≥2 features exist in domain)
7. **Write `{folder}/AGENTS.md`** — navigation index linking to docs/ (fully auto-generated, no manual sections)
8. **Write `docs/INDEX.md`** — master table of all domains with metadata and links
9. **Clear drift entries** — remove processed STALE entries from knowledge-drift.md
10. **Report** — print summary table of files created/updated/skipped

## Reference

See [./examples.md](./examples.md) for full file templates (AGENTS.md, _overview.md, feature.md, INDEX.md) and discovery commands per tech stack.
