---
name: find-confluence-page
description: Quick Confluence knowledge search — returns top 5 results with space, category, and excerpt
argument-hint: Search keywords, e.g. "deployment guide" or "MRT table patterns"
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [confluence-azure/*]
---

Search the Confluence knowledge base for: `${input:query:search keywords, e.g. deployment guide}`

## Step 1 — Run the search

Call the Confluence MCP search with the query: `${input:query}`

Retrieve up to 10 results. If fewer than 5 relevant results are found, also try a broader CQL search:
```
text ~ "${input:query}" AND label = "ai-consumable" ORDER BY lastModified DESC
```

> **MCP fallback**: If Confluence MCP is unavailable, report:
> _"Confluence MCP is unreachable. Try searching directly at `https://myorg.atlassian.net/wiki/search?text=[query]`"_

## Step 2 — Classify results by category

Using the NG Space page taxonomy, classify each result into its category:

| Label / Space path | Category |
|-------------------|---------|
| `engineering-standards` | 📋 Engineering Standards |
| `adr` | 🏗 Architecture Decision (ADR) |
| `system-design` | 🔧 System Design |
| `testing-standards` | 🧪 Testing Standards |
| `devops` | 🚀 DevOps & Deployment |
| `domain-knowledge` | 📚 Domain Knowledge |
| `runbook` | 🔥 Runbook |
| No label match | 📄 General |

If no label is present, infer from the page title or space path.

## Step 3 — Filter and rank

Keep only the top 5 most relevant results. Prefer:
1. Pages with the `ai-consumable` label (structured for AI consumption)
2. Pages with a recent modification date
3. Pages whose title directly matches the query terms

## Step 4 — Format results

**Never output raw JSON or API response objects.** Format as readable markdown.

---

## Confluence results for: "${input:query}"

[If no results found: "No pages found matching your query. Try broader terms or search directly in Confluence."]

---

### 1. [Page title]

**Space › Category**: [Space name] › [Category emoji + name]
**Last updated**: [relative date, e.g. 3 days ago]
**URL**: [[page title](page URL)]

> [Excerpt — 2–3 sentences of the most relevant content from the page. Strip HTML/wiki markup. Plain text only.]

---

### 2. [Page title]

**Space › Category**: [Space name] › [Category]
**Last updated**: [relative date]
**URL**: [[page title](page URL)]

> [Excerpt]

---

[Repeat for up to 5 results]

---

> **Tip**: If none of these pages answer your question, ask `@docs-writer` to create a new standards page, or use `/jira-read` to check if there is a ticket tracking this knowledge gap.
