# Complexity Guard Hook

Blocks or warns when staged files exceed cyclomatic/cognitive complexity thresholds.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `MAX_CYCLOMATIC` | 15 | Max cyclomatic complexity per function |
| `MAX_COGNITIVE` | 20 | Max cognitive complexity per function |
| `FAIL_MODE` | warn | `warn` (log only) or `block` (reject commit) |

## Supported Languages

- **TypeScript/JavaScript**: ESLint complexity rule
- **Python**: radon complexity checker
- **C#**: dotnet analyzers (if configured)

## Installation

Copy `hooks.json` and `check-complexity.sh` to `.github/hooks/complexity-guard/`.
