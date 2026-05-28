---
name: diagnose
description: AI workflow health check — verifies agent configuration, skill availability, MCP connectivity, and GUARDRAILS compliance
---

# Diagnose Skill

Run a comprehensive health check on the Copilot agent system to verify everything is correctly configured and operational.

## When to Use

- After setting up a new workspace
- When agents behave unexpectedly
- When MCP tools fail silently
- Before a major implementation session
- To verify skill/hook/instruction completeness

## Step 1 — Agent Configuration Check

```bash
# List all agent files
find . -name '*.agent.md' -path '*/agents/*' | sort

# Verify frontmatter has required fields (name, description, tools)
for f in agents/*.agent.md; do
  echo "--- $f ---"
  head -10 "$f" | grep -E 'name:|description:|tools:'
done
```

### Verify
- [ ] Every agent has `name:` in frontmatter
- [ ] Every agent has `description:` in frontmatter
- [ ] Every agent has `tools:` array (or inherits defaults)
- [ ] No orphan agents (referenced but file missing)

## Step 2 — Skill Availability Check

```bash
# List all skills
find . -name 'SKILL.md' -path '*/skills/*' | sort

# Verify each skill has name + description
for f in skills/*/SKILL.md; do
  echo "--- $f ---"
  head -5 "$f" | grep -E 'name:|description:'
done
```

### Verify
- [ ] Every skill folder has `SKILL.md`
- [ ] Every SKILL.md has `name:` matching folder name
- [ ] Every SKILL.md has `description:`
- [ ] No broken skill references in agents (grep for `#skill:` and `skills/`)

## Step 3 — Hook Availability Check

```bash
# List all hooks
find . -name 'hook.md' -path '*/hooks/*' | sort
```

### Verify
- [ ] Each hook has `name:` and `event:` in frontmatter
- [ ] Events are valid: `onSave`, `onAgentAction`, `onSessionEnd`, `onToolCall`

## Step 4 — MCP Connectivity Check

Test each configured MCP server:

```bash
# Check MCP config
cat .vscode/mcp.json 2>/dev/null || cat copilot/mcp.json 2>/dev/null
```

### Verify
- [ ] Jira MCP: `jira-azure` server configured and accessible
- [ ] Confluence MCP: `confluence-azure` server configured and accessible
- [ ] Any custom MCP servers referenced in agents are configured

## Step 5 — GUARDRAILS Compliance Check

```bash
# Verify instruction files exist
find . -name '*.instructions.md' | sort

# Check for required guardrail files
for f in GUARDRAILS-core GUARDRAILS-code GUARDRAILS-orchestration; do
  if [ -f ".github/instructions/${f}.instructions.md" ]; then
    echo "✅ ${f}"
  else
    echo "❌ ${f} MISSING"
  fi
done
```

## Step 6 — Cross-Reference Audit

Check that all skill references in agents resolve:
```bash
# Find all skill references in agent files
grep -roh '#skill:[a-z-]*' agents/ | sort | uniq | while read ref; do
  skill=$(echo "$ref" | sed 's/#skill://')
  if [ -d "skills/${skill}" ]; then
    echo "✅ ${ref}"
  else
    echo "❌ ${ref} — skill folder not found"
  fi
done

# Find all skills/ path references
grep -roh 'skills/[a-z-]*/SKILL.md' agents/ | sort | uniq | while read ref; do
  if [ -f "${ref}" ]; then
    echo "✅ ${ref}"
  else
    echo "❌ ${ref} — file not found"
  fi
done
```

## Output Format

```markdown
# 🏥 Agent System Health Report

| Component | Count | Status |
|-----------|-------|--------|
| Agents | {N} | ✅ All valid / ⚠️ {N} issues |
| Skills | {N} | ✅ All valid / ⚠️ {N} issues |
| Hooks | {N} | ✅ All valid / ⚠️ {N} issues |
| Instructions | {N} | ✅ All valid / ⚠️ {N} issues |
| MCP Servers | {N} | ✅ Connected / ⚠️ {N} unreachable |

## Issues Found
{list of specific issues with fix suggestions}

## Recommendations
{suggestions for improvements}
```
