#!/bin/bash

# Log session start event + show last session context

set -euo pipefail

# Skip if logging disabled
if [[ "${SKIP_LOGGING:-}" == "true" ]]; then
  exit 0
fi

# Read input from Copilot
INPUT=$(cat)

# Create logs directory if it doesn't exist
mkdir -p logs/copilot

# Extract timestamp and session info
TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
CWD=$(pwd)

# Log session start (use jq for proper JSON encoding)
jq -Rn --arg timestamp "$TIMESTAMP" --arg cwd "$CWD" '{"timestamp":$timestamp,"event":"sessionStart","cwd":$cwd}' >> logs/copilot/session.log

# --- Context Continuity: show last session summary ---
SUMMARY_DIR=".copilot/memories/repo/session-summaries"
if [[ -d "$SUMMARY_DIR" ]]; then
  LAST_SUMMARY=$(ls -t "$SUMMARY_DIR"/*.md 2>/dev/null | head -1 || true)
  if [[ -n "$LAST_SUMMARY" ]]; then
    LAST_DATE=$(basename "$LAST_SUMMARY" .md)
    echo "📋 Last session: $LAST_DATE — check $LAST_SUMMARY for context"
  fi
fi

# Show gotcha count if accumulated
GOTCHA_FILE=".copilot/memories/repo/discovered-gotchas.md"
if [[ -f "$GOTCHA_FILE" ]]; then
  GOTCHA_COUNT=$(grep -c "^- " "$GOTCHA_FILE" 2>/dev/null || echo "0")
  if [[ "$GOTCHA_COUNT" -gt 0 ]]; then
    echo "⚠️  $GOTCHA_COUNT gotchas accumulated — review $GOTCHA_FILE"
  fi
fi

echo "📝 Session logged"
exit 0
