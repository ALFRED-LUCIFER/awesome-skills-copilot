#!/usr/bin/env bash
# Test Coverage Gate — Enforce minimum test coverage before push
set -euo pipefail

MIN_COVERAGE="${MIN_COVERAGE:-80}"
FAIL_MODE="${FAIL_MODE:-warn}"

echo "🧪 Checking test coverage (minimum: ${MIN_COVERAGE}%)..."

COVERAGE=""

# Detect ecosystem and run coverage
if [ -f "package.json" ]; then
  # Node.js — try vitest, jest, or nyc
  if grep -q '"vitest"' package.json 2>/dev/null; then
    npx vitest run --coverage --reporter=json 2>/dev/null || true
  elif grep -q '"jest"' package.json 2>/dev/null; then
    npx jest --coverage --coverageReporters=json-summary 2>/dev/null || true
  fi
  # Read coverage from json-summary
  if [ -f "coverage/coverage-summary.json" ]; then
    COVERAGE=$(node -e "console.log(JSON.parse(require('fs').readFileSync('coverage/coverage-summary.json')).total.lines.pct)" 2>/dev/null || echo "")
  fi
elif [ -f "*.csproj" ] || find . -name "*.csproj" -maxdepth 3 -print -quit 2>/dev/null | grep -q .; then
  # .NET
  dotnet test --collect:"XPlat Code Coverage" --results-directory ./coverage 2>/dev/null || true
fi

if [ -n "$COVERAGE" ]; then
  echo "📊 Coverage: ${COVERAGE}%"
  if (( $(echo "$COVERAGE < $MIN_COVERAGE" | bc -l) )); then
    if [ "$FAIL_MODE" = "block" ]; then
      echo "❌ Coverage ${COVERAGE}% is below minimum ${MIN_COVERAGE}%. Push blocked."
      exit 1
    else
      echo "⚠️  Coverage ${COVERAGE}% is below minimum ${MIN_COVERAGE}%. Warning only."
    fi
  else
    echo "✅ Coverage meets threshold"
  fi
else
  echo "⚠️  Could not determine coverage. Skipping gate."
fi
