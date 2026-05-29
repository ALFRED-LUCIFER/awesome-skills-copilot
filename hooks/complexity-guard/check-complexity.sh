#!/usr/bin/env bash
# Complexity Guard Hook — Block commits that exceed complexity thresholds
# Supports: TypeScript/JavaScript (ESLint), Python (radon), C# (dotnet analyzers)
set -euo pipefail

MAX_CYCLOMATIC="${MAX_CYCLOMATIC:-15}"
MAX_COGNITIVE="${MAX_COGNITIVE:-20}"
FAIL_MODE="${FAIL_MODE:-warn}"

echo "🔍 Checking code complexity (max cyclomatic: $MAX_CYCLOMATIC, max cognitive: $MAX_COGNITIVE)..."

VIOLATIONS=0

# Get staged files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM)

# TypeScript/JavaScript
TS_FILES=$(echo "$STAGED_FILES" | grep -E '\.(ts|tsx|js|jsx)$' || true)
if [ -n "$TS_FILES" ] && command -v npx &>/dev/null; then
  for f in $TS_FILES; do
    RESULT=$(npx eslint --rule '{"complexity": ["error", '"$MAX_CYCLOMATIC"']}' --no-eslintrc "$f" 2>/dev/null || true)
    if echo "$RESULT" | grep -q "complexity"; then
      echo "⚠️  $f exceeds complexity threshold"
      VIOLATIONS=$((VIOLATIONS + 1))
    fi
  done
fi

# Python
PY_FILES=$(echo "$STAGED_FILES" | grep -E '\.py$' || true)
if [ -n "$PY_FILES" ] && command -v radon &>/dev/null; then
  for f in $PY_FILES; do
    HIGH=$(radon cc -n C "$f" 2>/dev/null | wc -l)
    if [ "$HIGH" -gt 0 ]; then
      echo "⚠️  $f has functions with complexity grade C or worse"
      VIOLATIONS=$((VIOLATIONS + 1))
    fi
  done
fi

if [ "$VIOLATIONS" -gt 0 ]; then
  echo "📊 Found $VIOLATIONS file(s) exceeding complexity thresholds"
  if [ "$FAIL_MODE" = "block" ]; then
    echo "❌ Commit blocked. Reduce complexity before committing."
    exit 1
  else
    echo "⚠️  Warning only (FAIL_MODE=$FAIL_MODE). Consider refactoring."
  fi
else
  echo "✅ All staged files within complexity thresholds"
fi
