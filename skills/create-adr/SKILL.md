---
name: create-adr
description: Create an Architectural Decision Record following the Copilot Agent System template — integrates with Confluence for persistence
---

# Create ADR Skill

Generates a structured Architectural Decision Record (ADR) for non-trivial design decisions.

## When to Use

Create an ADR when:
- Choosing between valid architectural approaches
- Adding a new dependency or library
- Deviating from established patterns
- Making a significant trade-off (performance vs. readability, etc.)
- Introducing a new integration pattern

## Template

```markdown
# ADR-{NNN}: {Title}

- **Date**: {YYYY-MM-DD}
- **Status**: Proposed | Accepted | Deprecated | Superseded by ADR-{NNN}
- **Deciders**: {names or roles}
- **Jira**: {NG-XXXX} (if applicable)

## Context

{Why this decision is needed. What problem are we solving?
Include relevant constraints, requirements, and business context.}

## Options Considered

### Option 1: {Name}
- **Pros**: {benefits}
- **Cons**: {drawbacks}
- **Effort**: {Low/Medium/High}

### Option 2: {Name}
- **Pros**: {benefits}
- **Cons**: {drawbacks}
- **Effort**: {Low/Medium/High}

### Option 3: {Name} (if applicable)
- **Pros**: {benefits}
- **Cons**: {drawbacks}
- **Effort**: {Low/Medium/High}

## Decision

{Which option was chosen and a clear statement of the decision.}

## Rationale

{Why this option was selected over others. Reference specific criteria:
- Alignment with existing patterns
- Team expertise
- Performance requirements
- Maintenance burden
- Security implications}

## Consequences

### Positive
- {What this enables or improves}

### Negative
- {What trade-offs are accepted}

### Risks
- {What could go wrong and how to mitigate}

## Reversibility

{Easy | Medium | Hard} — {How to reverse this decision if needed}

## Related

- ADR-{NNN}: {related decision}
- GUARDRAILS § {N}: {relevant guardrail}
- {Link to Confluence page if published}
```

## File Location

Save ADRs to `docs/adr/ADR-{NNN}-{kebab-case-title}.md` in the repo root.

## Numbering

Auto-detect the next number:
```bash
ls docs/adr/ADR-*.md 2>/dev/null | sort -t- -k2 -n | tail -1
```

If no ADRs exist, start at `ADR-001`.

## Confluence Sync

If Confluence MCP is available, also create/update a Confluence page:
- Space: Engineering Standards
- Parent: Architecture Decision Records
- Label: `adr`, `ai-consumable`
- Title: `ADR-{NNN}: {Title}`
