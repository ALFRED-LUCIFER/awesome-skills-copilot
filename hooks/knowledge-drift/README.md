# knowledge-drift Hook

Automatically flags domain knowledge docs as stale when source files change during a coding session.

## What it does

Runs at **sessionEnd**. Detects which source files (`.cs`, `.ts`, `.tsx`, `.js`, etc.) were modified, maps each file to its domain folder, and appends a `STALE:` entry to `.copilot/memories/repo/knowledge-drift.md`.

At the next session, agents can check this file (or it surfaces automatically in the memory bootstrap) to know which domains need their `AGENTS.md` and `docs/{domain}.md` refreshed.

## Drift log format

```
[2026-05-24] STALE: Orders — OrderService.cs, OrderDto.cs changed
[2026-05-24] STALE: Inventory — InventoryRepository.cs changed
[2026-06-01] RESOLVED: Orders — refreshed by knowledge-init --update
```

## How to refresh stale docs

```
/knowledge-init --update
```

The skill reads the drift log, processes only flagged domains, marks them RESOLVED, and prints a summary.

## Supported folder structures

| Structure | Example | Domain detected |
|-----------|---------|-----------------|
| Feature-based | `src/features/Orders/…` | `Orders` |
| Module-based | `src/modules/orders/…` | `orders` |
| DDD | `src/Domain/Orders/…` | `Orders` |
| Flat src | `src/Orders/…` | `Orders` |
| Monorepo apps | `apps/inventory/…` | `inventory` |
| Monorepo libs | `libs/shared-ui/…` | `shared-ui` |

## Configuration

| Env var | Default | Effect |
|---------|---------|--------|
| `SKIP_KNOWLEDGE_DRIFT` | `false` | Set to `true` to disable the hook entirely |

## Installation

The hook is registered in `hooks.json` and runs automatically when installed via `copilot plugin install`. No manual setup required.

## Files

| File | Purpose |
|------|---------|
| `hooks.json` | Registers the `sessionEnd` hook |
| `detect-drift.sh` | Bash script — detects changes and writes drift log |
| `README.md` | This file |
