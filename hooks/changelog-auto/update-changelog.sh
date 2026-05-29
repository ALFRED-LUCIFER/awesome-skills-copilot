#!/usr/bin/env bash
# Changelog Auto Hook — Appends latest conventional commit to CHANGELOG.md
set -euo pipefail

CHANGELOG_FILE="${CHANGELOG_FILE:-CHANGELOG.md}"
LAST_MSG=$(git log -1 --format='%s')

# Only process conventional commits
if ! echo "$LAST_MSG" | grep -qE '^(feat|fix|perf|refactor|docs|chore|test|ci|build|style)(\(.+\))?!?:'; then
  exit 0
fi

TYPE=$(echo "$LAST_MSG" | sed -E 's/^([a-z]+)(\(.+\))?!?:.*/\1/')
SCOPE=$(echo "$LAST_MSG" | sed -nE 's/^[a-z]+\(([^)]+)\)!?:.*/\1/p')
DESC=$(echo "$LAST_MSG" | sed -E 's/^[a-z]+(\([^)]+\))?!?:\s*//')
HASH=$(git log -1 --format='%h')
DATE=$(date +%Y-%m-%d)

# Create changelog if it doesn't exist
if [ ! -f "$CHANGELOG_FILE" ]; then
  echo -e "# Changelog\n\n## [Unreleased]\n" > "$CHANGELOG_FILE"
fi

# Map type to section
case "$TYPE" in
  feat)     SECTION="### ✨ Features" ;;
  fix)      SECTION="### 🐛 Bug Fixes" ;;
  perf)     SECTION="### ⚡ Performance" ;;
  docs)     SECTION="### 📚 Documentation" ;;
  *)        SECTION="### 🏗️ Maintenance" ;;
esac

ENTRY="- ${DESC}"
[ -n "$SCOPE" ] && ENTRY="- **${SCOPE}**: ${DESC}"
ENTRY="${ENTRY} (${HASH})"

echo "📝 Added to $CHANGELOG_FILE: $ENTRY"
