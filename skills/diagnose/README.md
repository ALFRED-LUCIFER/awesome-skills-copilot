# diagnose

> AI workflow health check — verifies agent configuration, skill availability, MCP connectivity, and GUARDRAILS compliance.

## Purpose

Diagnostic tool for verifying the entire Copilot agent system is correctly configured and operational. Checks agent files, skill references, hook availability, and MCP server connectivity.

## When to Use

- After workspace setup or plugin installation
- When agents behave unexpectedly or fail to invoke
- MCP connection failures (Jira/Confluence)
- Before major implementation sessions
- Troubleshooting skill reference errors

## Diagnostic Steps

1. **Agent Config Check** — Verify all `.agent.md` files parse correctly, frontmatter is valid
2. **Skill Availability** — Confirm all `#skill:xxx` references resolve to existing `SKILL.md` files
3. **Hook Availability** — Check all hooks have valid `hooks.json` and scripts
4. **MCP Connectivity** — Test Jira and Confluence MCP server connections

## Tools Used

`find`, `grep`, shell commands, MCP config verification

## Used By

- Tech Lead diagnostics
- Pre-session health checks
