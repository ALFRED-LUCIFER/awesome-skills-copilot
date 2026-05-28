---
name: read-jira-ticket
description: Read any Jira ticket as a clean formatted card — summary, status, ACs, linked tickets, and recent comments
argument-hint: Jira ticket key, e.g. NG-1234
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [jira-azure/*]
---

Fetch and display Jira ticket: `${input:ticketKey:e.g. NG-1234}`

## Step 1 — Fetch the ticket

Call the Jira MCP tool to retrieve the ticket with key `${input:ticketKey}`.

> **MCP fallback**: If the Jira MCP tool is unavailable or returns an error, report:
> _"Jira MCP is unreachable. Paste the ticket content manually and I'll format it as a card."_
> Then accept the pasted content and continue with Step 2.

## Step 2 — Extract fields

From the Jira response, extract:
- Summary
- Issue type (Story / Bug / Task / Sub-task / Epic / Spike)
- Status
- Priority
- Assignee (display name)
- Reporter (display name)
- Sprint name
- Epic link / Epic name
- Description (plain text — strip ADF/JSON markup)
- Acceptance criteria (if in a dedicated field or in description)
- Linked issues (type + key + summary for each link)
- Last 3 comments (author, relative date, plain text body)
- Labels

## Step 3 — Format as a markdown card

**Never output raw JSON.** Format everything as readable markdown using the template below.

---

## [issue type emoji] `${input:ticketKey}` · [Issue Type] · [Status badge]

**[Summary]**

| Field | Value |
|-------|-------|
| Priority | [🔴 Critical / 🟠 High / 🟡 Medium / 🔵 Low] |
| Assignee | [Name or ⚠️ Unassigned] |
| Reporter | [Name] |
| Sprint | [Sprint name or —] |
| Epic | [Epic name or —] |
| Labels | [comma-separated or —] |

### Description

[Plain-text description — remove ADF markup, preserve paragraph breaks]

### Acceptance criteria

[If Gherkin: render as a code block. If bullet list: render as bullets. If empty: "No ACs defined."]

### Linked issues

| Type | Key | Summary |
|------|-----|---------|
| [e.g. blocks] | [NG-XXXX] | [Summary] |

### Recent comments

**[Author]** · [relative date, e.g. 2 days ago]
> [Comment text — truncated to 300 chars if longer]

**[Author]** · [relative date]
> [Comment text]

---

**Issue type emojis**: Story = 📖 · Bug = 🐛 · Task = 🔧 · Sub-task = 🔩 · Epic = 🏔 · Spike = 🔬 · Improvement = ⬆️

**Status badges**: 🔵 To Do · 🟡 In Progress · 🟢 Done · 🔴 Blocked · ⬜ Backlog
