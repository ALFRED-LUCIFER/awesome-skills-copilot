---
name: describe-pr
description: Generate a complete PR title and body from git history — optionally enriched with Jira ticket ACs
argument-hint: Optional Jira ticket key, e.g. NG-1234 — or leave blank for git-only
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [execute/getTerminalOutput, execute/runInTerminal, read/terminalSelection, read/terminalLastCommand, search/codebase, 'jira-azure/*']
---

Generate a structured pull request description for the current branch.
Optional Jira context: `${input:ticketKey:optional — e.g. NG-1234, or leave blank}`

## Step 1 — Get git history and diff

```bash
# Commits on this branch vs main
git log main...HEAD --oneline

# Files changed (stat only — not full diff)
git diff main...HEAD --stat

# Branch name (may contain ticket key)
git rev-parse --abbrev-ref HEAD

# Number of commits
git log main...HEAD --oneline | wc -l
```

## Step 2 — Fetch Jira ticket (if ticket key provided)

If `${input:ticketKey}` is not blank, call the Jira MCP tool to fetch the ticket.

Extract:
- Summary (becomes context for PR title)
- Acceptance criteria (used to build the test plan checklist)
- Issue type (Story / Bug / Task)
- Epic name

> **MCP fallback**: If Jira MCP is unavailable, continue with git data only — note "(no Jira context)" in the output.

## Step 3 — Determine change type

Classify the change based on commit messages and file patterns:

| Indicator | Type |
|-----------|------|
| `feat:`, new files, new endpoints | `feat` |
| `fix:`, bug corrections | `fix` |
| `refactor:`, no behaviour change | `refactor` |
| `test:`, only test file changes | `test` |
| `chore:`, `build:`, config/deps | `chore` |

## Step 4 — Generate PR description

Apply these rules:
- **Title**: ≤70 characters · format: `[type]([scope]): [summary]` · if ticket available: prefix with ticket key, e.g. `feat(machine): NG-1234 Add export to PDF`
- **Summary**: bullet list of what changed — technical and precise
- **Why**: derive from Jira description/ACs if available, otherwise from commit messages
- **Test plan**: checklist aligned to ACs if available, otherwise to the changed behaviour

---

## PR: [generated title]

### Summary

[3–6 bullet points describing what changed — technical, precise, no filler]

### Why

[1–2 sentences — what problem this solves or what feature this delivers. Source: Jira description if available, otherwise commit messages.]

### Changes

| Area | What changed |
|------|-------------|
| [e.g. Backend / Frontend / DB / Config] | [brief description] |

### Test plan

- [ ] [AC or behaviour 1 — e.g. "Export button appears for Manager role only"]
- [ ] [AC or behaviour 2]
- [ ] [AC or behaviour 3]
- [ ] Unit tests pass (`dotnet test` / `npm test`)
- [ ] No lint errors (`npm run lint`)
- [ ] Tested in DEV environment

### Related

[Jira ticket link if available: `[NG-XXXX](https://myorg.atlassian.net/browse/NG-XXXX)` — or omit]

---

> **Usage tip**: Copy the output above and paste into your PR description, or pipe it to `gh pr create --body "$(copilot prompt pr-describe)"`.
