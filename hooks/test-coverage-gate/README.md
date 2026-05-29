# Test Coverage Gate Hook

Enforces minimum test coverage before allowing `git push`.

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `MIN_COVERAGE` | 80 | Minimum line coverage percentage |
| `FAIL_MODE` | warn | `warn` (log only) or `block` (reject push) |

## Supported Ecosystems

- **Node.js**: Vitest, Jest (reads coverage-summary.json)
- **.NET**: dotnet test with XPlat Code Coverage
- **Python**: pytest-cov (planned)
