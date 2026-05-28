---
name: sprint-status
description: Instant sprint health snapshot — counts by status, blockers, unassigned, and % done
argument-hint: Optional sprint name — leave blank for the current open sprint
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [jira-azure/*]
---

Generate a sprint health snapshot.
Sprint: `${input:sprintName:optional — leave blank for the current open sprint}`

## Step 1 — Fetch sprint issues

Call the Jira MCP search with JQL:

**If sprint name is blank** (default):
```
project = NG AND sprint in openSprints() ORDER BY status ASC
```

**If sprint name is provided**:
```
project = NG AND sprint = "${input:sprintName}" ORDER BY status ASC
```

Retrieve all issues. If there are more than 50, paginate to get all of them.

> **MCP fallback**: If Jira MCP is unavailable, report:
> _"Jira MCP is unreachable. Provide a CSV or list of tickets manually and I'll format the sprint report."_

## Step 2 — Group and analyse

Group issues by status:
- **To Do** / Backlog
- **In Progress**
- **In Review** / In Code Review
- **Done** / Closed

For each issue, also check:
- **Blocked**: has label `impediment` OR linked issue of type "is blocked by"
- **Unassigned**: `assignee` is null
- **Overdue**: if the sprint has an end date and the issue is not Done

## Step 3 — Calculate metrics

- **Total issues**: count
- **% Done**: `(Done count / Total count) × 100` — round to nearest integer
- **Story points done vs total**: sum if story points field is present
- **Blocked count**: issues with impediment label
- **Unassigned count**: issues with no assignee

## Step 4 — Identify top risks

Flag these as risks:
1. Any 🔴 blocked ticket (impediment label or blocked-by link)
2. Any In Progress ticket that has been in that status for >3 days without a recent comment
3. More than 30% of In Progress tickets are unassigned

## Output

Produce this report:

---

## Sprint: [sprint name]

**Health**: [🟢 On track / 🟡 At risk / 🔴 Off track]
**Progress**: [n]% done · [done] of [total] issues · [done SP] of [total SP] story points

### Status breakdown

| Status | Count | Story Points |
|--------|-------|-------------|
| ✅ Done | [n] | [SP] |
| 🔄 In Progress | [n] | [SP] |
| 👀 In Review | [n] | [SP] |
| 📋 To Do | [n] | [SP] |

### 🔴 Blocked ([n])

| Key | Summary | Assignee | Blocked since |
|-----|---------|----------|--------------|
| [NG-XXXX] | [Summary] | [Name] | [date or "unknown"] |

### ⚠️ Unassigned ([n])

| Key | Summary | Status |
|-----|---------|--------|
| [NG-XXXX] | [Summary] | [Status] |

### Risks

[Bullet list of top risks — or "No risks identified" if all is well]

### In Progress ([n])

| Key | Summary | Assignee |
|-----|---------|----------|
| [NG-XXXX] | [Summary] | [Name] |

---

> **Health determination**: 🟢 if ≥50% done and 0 blocked · 🟡 if <50% done OR 1–2 blocked · 🔴 if >3 blocked OR <25% done in last quarter of sprint
