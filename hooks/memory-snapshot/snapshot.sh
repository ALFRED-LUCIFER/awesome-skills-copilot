#!/usr/bin/env bash
# memory-snapshot hook — captures session decisions for future context
# Runs at session end to persist key decisions and findings

set -euo pipefail

SNAPSHOT_SCOPE="${SNAPSHOT_SCOPE:-decisions,files-changed,key-findings}"
MEMORY_PATH="${MEMORY_PATH:-memories/repo/sessions}"
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_FILE="${MEMORY_PATH}/session-$(date -u +%Y%m%d-%H%M%S).md"

mkdir -p "$MEMORY_PATH"

# Build snapshot from git state
{
  echo "# Session Snapshot"
  echo "Date: $TIMESTAMP"
  echo ""
  
  if [[ "$SNAPSHOT_SCOPE" == *"files-changed"* ]]; then
    echo "## Files Changed"
    git diff --name-only HEAD~1 2>/dev/null || git diff --name-only --cached 2>/dev/null || echo "No changes detected"
    echo ""
  fi
  
  if [[ "$SNAPSHOT_SCOPE" == *"decisions"* ]]; then
    echo "## Recent Commits"
    git log --oneline -5 2>/dev/null || echo "No commits"
    echo ""
  fi
} > "$SESSION_FILE"

# Prune old snapshots (keep last 20)
ls -t "$MEMORY_PATH"/session-*.md 2>/dev/null | tail -n +21 | xargs rm -f 2>/dev/null || true

echo "✅ Session snapshot saved: $SESSION_FILE"
