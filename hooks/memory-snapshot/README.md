# Memory Snapshot Hook

Automatically captures session context at session end for continuity across conversations.

## What It Does

- Records files changed during the session
- Captures recent commit messages (architectural decisions)
- Stores in `memories/repo/sessions/` with timestamp
- Auto-prunes to keep last 20 snapshots

## Why

Eliminates re-discovery overhead. Next session starts with prior context available in repo memory.

## Configuration

| Env Var | Default | Options |
|---------|---------|---------|
| `SNAPSHOT_SCOPE` | `decisions,files-changed,key-findings` | Comma-separated |
| `MEMORY_PATH` | `memories/repo/sessions` | Any valid path |
