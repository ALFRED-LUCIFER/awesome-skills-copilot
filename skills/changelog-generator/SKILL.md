---
name: changelog-generator
description: 'Auto-generate CHANGELOG.md from conventional commits — groups by type (feat/fix/breaking), links to commits and PRs, supports monorepo scoping'
---

# Changelog Generator Skill

Generate a CHANGELOG.md from git history using conventional commits.

## When to Use

- Preparing a release and need changelog entries
- Keeping CHANGELOG.md up to date with recent changes
- Generating release notes for GitHub/GitLab releases
- Auditing what changed between two versions/tags

## Rules

1. Only include conventional commits (feat, fix, perf, refactor, docs, etc.)
2. Group by: Breaking Changes → Features → Bug Fixes → Performance → Other
3. Each entry: description + commit hash link + optional PR link
4. Unreleased changes go under `## [Unreleased]` heading
5. Follow Keep a Changelog format (keepachangelog.com)
6. NEVER manually edit generated sections — regenerate instead
7. Include contributor attribution if open source

## Steps

1. Find the last version tag: `git describe --tags --abbrev=0`
2. Get commits since last tag: `git log {tag}..HEAD --format='%H %s' --no-merges`
3. Parse each commit message for type, scope, description, and breaking change footer
4. Group by type and format as markdown list items
5. Generate comparison link: `[X.Y.Z]: https://github.com/{owner}/{repo}/compare/{prev}...{new}`
6. Prepend new version section to CHANGELOG.md (or update Unreleased section)
7. Include date in ISO format: `## [X.Y.Z] — YYYY-MM-DD`
8. Validate: every entry links to a real commit hash

## Reference

See `./templates/changelog-template.md` for the standard CHANGELOG format.
