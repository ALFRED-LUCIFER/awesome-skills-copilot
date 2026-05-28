# jira-gherkin-convert

> Convert Jira ticket descriptions to full Gherkin ACs — detects existing Gherkin, supports all ticket types, writes back via MCP.

## Purpose

Reads a Jira ticket, analyzes its description for existing acceptance criteria, converts them to proper Gherkin format, and writes back via Jira MCP. Handles all ticket types with type-specific patterns.

## When to Use

- `/convert-to-gherkin NG-xxxx` command
- Batch AC conversion for sprint planning
- Standardizing existing tickets

## Features

- **Smart Detection**: Full Gherkin / Partial / None — adapts strategy accordingly
- **8 Ticket Type Patterns**: Story, Bug, Task, Sub-task, Epic, Spike, Improvement, Tech Debt
- **6 AC Extraction Strategies**: Description parsing, comment scanning, linked ticket analysis
- **12 Quality Gates**: Validates output before writing back
- **Jira-safe Write-back**: No gherkin fences in Jira format

## Tools Used

- Jira MCP (`get_issue`, `update_issue`)

## Used By

- `/convert-to-gherkin` prompt
