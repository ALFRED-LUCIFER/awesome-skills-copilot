# Planning Suite Plugin

Complete planning, review, and documentation toolkit.

## Included Agents

| Agent | Purpose |
|-------|---------|
| `@orchestrator` | Single entry-point — plan → approve → execute |
| `@planner` | Read-only planning with Gherkin ACs |
| `@jira-planner` | Jira read+write with Gherkin conversion |
| `@docs-planner` | Jira + Confluence bridge planner |
| `@docs-writer` | Confluence documentation writer |
| `@reviewer` | 7-dimension code review with auto-fix |

## Included Skills

| Skill | Purpose |
|-------|---------|
| `create-adr` | Architectural Decision Records |
| `conventional-commit` | Conventional Commits enforcement |
| `gherkin-format` | Gherkin format rules G1–G11 |
| `jira-gherkin-convert` | Jira → Gherkin conversion |
| `jira-user-story-draft` | User story drafting |
| `code-review-pipeline` | Multi-model panel review |
| `review-and-fix` | Fix-first code review |
| `confluence-content-guide` | Documentation templates |

## Usage

```
# Plan a feature from a Jira ticket
@orchestrator plan PROJ-1234

# Plan with Confluence context
@docs-planner plan PROJ-1234 with Confluence context

# Review code
@reviewer review staged changes --full

# Write documentation
@docs-writer create API Standards page
```
