# create-adr

> Create an Architectural Decision Record following the Copilot Agent System template — integrates with Confluence for persistence.

## Purpose

Generates structured ADR documents when architectural decisions need to be recorded. Follows the standard template and can publish to Confluence via the `@docs-writer` agent.

## When to Use

- Choosing between competing architectures or patterns
- Adding a new dependency or library
- Deviating from established patterns
- Making a trade-off that future developers need to understand

## ADR Template Structure

1. **Context** — Why this decision was needed
2. **Options Considered** — Each option with pros/cons
3. **Decision** — The chosen option
4. **Rationale** — Why this option was selected
5. **Consequences** — Impact on future work
6. **Reversibility** — Easy / Medium / Hard

## Used By

- `@docs-writer` agent
- Manual invocation for architecture decisions
