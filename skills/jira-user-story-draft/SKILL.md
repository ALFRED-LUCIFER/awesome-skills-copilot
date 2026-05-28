---
name: jira-user-story-draft
description: Draft Jira user stories with Gherkin ACs, T-shirt estimates, and optional Epic linking — create via MCP after confirmation
---

# Jira User Story Draft Skill

Draft ready-to-create Jira user stories from plain text ideas.

## Step 1 — Parse Idea

Extract:
- **Persona**: who wants this (default to "user" if unclear)
- **Action**: what they want to do
- **Outcome**: business value

Format: `As a [persona], I want [action], so that [outcome]`

## Step 2 — Search Related Epics

JQL: `project = NG AND issuetype = Epic AND text ~ "[key terms]" ORDER BY updated DESC`

Return top 3 matches. MCP fallback: skip and note "assign manually."

## Step 3 — Draft Gherkin ACs

Apply ALL rules from `#skill:gherkin-format` (G1–G14):
- Each AC gets its own `Feature:` block
- Every Feature has `As a / I want / So that`
- Minimum 2 scenarios per Feature (happy + edge)
- Use specific, realistic test data
- Traceability prefix: `[NG-DRAFT AC#]`

Draft 2–4 ACs covering: happy path, permissions, error/edge, data validation.

## Step 4 — Estimate

| Size | Criteria | Points |
|------|---------|--------|
| S | 1–2 ACs, single layer, no migration | 2 |
| M | 2–3 ACs, 2 layers, possible migration | 3 |
| L | 4+ ACs, full-stack, migration required | 5 |
| XL | Cross-service, architecture change | 8 |

## Step 5 — Collect Confluence Source URL

Before creating the ticket, check whether this draft originated from Confluence research:

- If invoked by `@docs-planner`: extract `sourceConfluencePages` from its sub-agent contract — use the first entry as the primary source URL.
- If invoked directly: ask the user: _"Is there a Confluence requirements page for this feature? Paste the URL or press Enter to skip."_
- MCP fallback: if Confluence was searched but MCP failed, skip the link and note _"⚠️ Confluence link unavailable — add manually after creation."_

## Step 6 — Create (after user confirmation only)

Project: `NG`, Type: `Story`, Description: user story + Gherkin ACs (plain text, no gherkin tag per G11).

**Append the following section at the end of every description** whenever a Confluence source URL is available:

```
---
📚 Related Documentation
- [Requirements](<confluenceUrl>)
```

If additional ADR or system design pages were referenced by `@docs-planner`, list each one:

```
📚 Related Documentation
- [Requirements](<requirementsUrl>)
- [ADR-NNN: <title>](<adrUrl>)
- [System Design: <domain>](<systemDesignUrl>)
```

When creating an **Epic**, also append the same section to the Epic description.

**Never create without explicit user confirmation.**
