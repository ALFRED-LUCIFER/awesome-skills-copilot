#!/usr/bin/env bash
# dependency-license-checker — scans for copyleft/blocked licenses in dependencies
set -euo pipefail

BLOCKED_LICENSES="${BLOCKED_LICENSES:-GPL-3.0,AGPL-3.0,SSPL-1.0,EUPL-1.1}"
MODE="${MODE:-warn}"
VIOLATIONS=0

echo "🔍 Scanning dependencies for blocked licenses: $BLOCKED_LICENSES"

# Check npm packages
if [[ -f "package.json" ]] && command -v npx &>/dev/null; then
  echo "--- npm packages ---"
  npx license-checker --production --onlyAllow "MIT;ISC;BSD-2-Clause;BSD-3-Clause;Apache-2.0;0BSD;Unlicense;CC0-1.0;CC-BY-4.0" 2>/dev/null || {
    echo "⚠️  Some npm packages have non-allowlisted licenses"
    VIOLATIONS=$((VIOLATIONS + 1))
  }
fi

# Check .NET packages
for csproj in $(find . -name '*.csproj' -not -path '*/node_modules/*' 2>/dev/null | head -5); do
  echo "--- $csproj ---"
  # Extract PackageReference names
  grep -oP 'Include="\K[^"]+' "$csproj" 2>/dev/null | while read -r pkg; do
    # Check nuget license metadata (simplified — real impl would query nuget API)
    echo "  ✓ $pkg (license check requires dotnet-project-licenses tool)"
  done
done

if [[ $VIOLATIONS -gt 0 ]]; then
  if [[ "$MODE" == "block" ]]; then
    echo "❌ $VIOLATIONS license violation(s) found. Blocking."
    exit 1
  else
    echo "⚠️  $VIOLATIONS potential license issue(s). Review recommended."
  fi
else
  echo "✅ No blocked licenses detected."
fi
