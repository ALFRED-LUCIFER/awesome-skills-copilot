# Org-Wide Tool Tips

> Copilot and MCP usage tips that help all developers work faster.

## Session Context Retention

- Use keywords like `gotcha:`, `lesson:`, `remember:`, `important:` in conversations — the session-logger hook auto-captures these.
- At session start, ask Copilot to read recent session summaries: "Check my last session summary"
- For complex multi-session work, write to `/memories/session/` during the session — it persists within that conversation.

## Agent Usage

- **@orchestrator** (Jarvis): Use for full feature implementation — delegates planning → coding → testing → review automatically.
- **@planner** (Veronica): Use for design-only — produces a plan without executing. Hand off to @orchestrator when approved.
- **@frontend** / **@backend**: Use for direct coding when you know exactly what's needed (skips planning).
- **@scaffold**: Use only for brand-new microservices, not for adding entities to existing ones.

## MCP Servers

- Jira and Confluence MCPs are org-level — no per-repo config needed.
- If MCP fails, agents degrade gracefully (work without external context).

## Hooks

- **tool-guardian**: Blocks destructive commands. If legitimately needed, set `TOOL_GUARD_ALLOWLIST` env var.
- **secrets-scanner**: Runs at session end. Set `SECRETS_ALLOWLIST` for false positives (e.g., test fixtures).
- **governance-audit**: Set `GOVERNANCE_LEVEL=open` for exploratory sessions (no blocking).

---
*Add tips as you discover them. Keep entries short and actionable.*
