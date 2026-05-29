# Changelog Auto Hook

Automatically appends conventional commit messages to CHANGELOG.md after each commit.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `CHANGELOG_FILE` | CHANGELOG.md | Path to changelog file |

## Behavior

- Only processes conventional commits (feat, fix, perf, etc.)
- Groups entries by type (Features, Bug Fixes, Performance, etc.)
- Includes commit hash for traceability
- Creates CHANGELOG.md if it doesn't exist
