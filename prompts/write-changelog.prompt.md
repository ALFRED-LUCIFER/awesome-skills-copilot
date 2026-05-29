---
name: write-changelog
description: Generate a CHANGELOG entry from conventional commits since the last git tag
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [execute/runInTerminal, edit]
---

Generate a CHANGELOG entry for the upcoming release.

## Step 1 — Get last tag and commits

```bash
git describe --tags --abbrev=0 2>/dev/null || echo "no tags"
git log $(git describe --tags --abbrev=0 2>/dev/null || echo "HEAD~50")..HEAD --format='%H|%s' --no-merges
```

## Step 2 — Group by type

Parse conventional commits and group into: Breaking Changes, Features, Bug Fixes, Performance, Maintenance.

## Step 3 — Generate entry

Format as Keep a Changelog markdown. Prepend to CHANGELOG.md under `## [Unreleased]` or a specific version if provided.
