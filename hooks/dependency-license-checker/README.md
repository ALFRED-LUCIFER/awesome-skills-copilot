# Dependency License Checker Hook

Scans project dependencies for copyleft or otherwise blocked licenses at session start.

## Blocked Licenses (Default)

- GPL-3.0, AGPL-3.0, SSPL-1.0, EUPL-1.1

## Configuration

| Env Var | Default | Description |
|---------|---------|-------------|
| `BLOCKED_LICENSES` | `GPL-3.0,AGPL-3.0,SSPL-1.0,EUPL-1.1` | Comma-separated SPDX IDs |
| `MODE` | `warn` | `warn` = advisory, `block` = exit 1 |
| `SCAN_FILES` | `package.json,*.csproj` | Which manifest files to scan |

## Requirements

- `npx license-checker` for npm (auto-installed via npx)
- `dotnet-project-licenses` tool for .NET (optional)
