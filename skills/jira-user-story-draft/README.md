# jira-user-story-draft

> Draft Jira user stories with Gherkin ACs, T-shirt estimates, and optional Epic linking — create via MCP after confirmation.

## Purpose

Takes a feature idea and produces a complete Jira user story with properly formatted Gherkin acceptance criteria, story point estimates, and optional Epic linking. Creates the ticket via Jira MCP only after user confirmation.

## When to Use

- `/draft-user-story` command
- Product Owner story creation workflow
- Sprint planning preparation

## Workflow

1. **Parse Idea** — Extract feature intent and scope
2. **Search Related Epics** — Find existing Epics for linking
3. **Draft Gherkin ACs** — Generate acceptance criteria following `gherkin-format` rules
4. **Estimate** — T-shirt sizing: S=2, M=3, L=5, XL=8 story points
5. **Create** — Submit to Jira after user confirmation

## Tools Used

- Jira MCP (`search_issues`, `create_issue`)

## Used By

- `/draft-user-story` prompt
