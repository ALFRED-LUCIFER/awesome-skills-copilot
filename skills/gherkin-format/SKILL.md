---
name: gherkin-format
description: Complete Gherkin format specification for jira-planner. Defines required structure, rules G1-G11, Jira-specific constraints, and worked examples for all ticket types.
---

# Gherkin Format

## When to Use

- @jira-planner converting ticket descriptions to Gherkin ACs
- Writing acceptance criteria for any Jira ticket type
- Validating existing Gherkin structure in tickets

## Rules

1. **G1 — Feature per AC/ticket**: Stories get one `Feature:` per AC; Bugs/Tasks/Spikes get one `Feature:` per ticket
2. **G2 — User story line**: Every Feature MUST include `As a / I want / So that`
3. **G3 — Minimum scenarios**: Stories min 2 (happy+edge), Bugs min 3 (bug+fix+edge), Tasks min 2, Spikes min 2
4. **G4 — Named scenarios**: Every `Scenario:` MUST have a descriptive name
5. **G5 — And/But**: Use `And` for additional steps, `But` for negative assertions
6. **G6 — Background**: Shared preconditions across scenarios — avoid duplicating Given steps
7. **G7 — Scenario Outline**: Use with `Examples:` table for data-driven variations
8. **G8 — Concrete values**: Use specific test data, not vague descriptions
9. **G9 — Traceability**: Title format: `[NG-##### AC#]`, `[NG-##### BUG]`, `[NG-##### TASK#]`, `[NG-##### SUB#]`, `[NG-##### SPIKE]`, `[NG-##### EPIC]`
10. **G10 — No invented ACs**: Only create scenarios from ticket content; edge cases allowed
11. **G11 — No gherkin tag in Jira**: Use plain code blocks (no language identifier) in Jira ADF
12. **G12 — Rule keyword**: Use `Rule:` (Gherkin 6) to group scenarios sharing a business rule
13. **G13 — Asterisk step**: Use `*` when forcing a keyword reads unnaturally (sparingly)
14. **G14 — Step arguments**: Doc Strings (`"""`) for multi-line, Data Tables (`| |`) for tabular — don't use in Jira descriptions

## Steps

1. **Classify ticket type** — Story/Bug/Task/Sub-task/Sub-bug/Epic/Spike/Improvement
2. **Select pattern** — Match type to pattern (1-9) from examples reference
3. **Extract ACs** — Pull acceptance criteria, STR, DoD, checklist items from ticket
4. **Write Feature blocks** — Apply traceability format (G9), include user story line (G2)
5. **Write Scenarios** — Meet minimum count (G3), use concrete values (G8), name descriptively (G4)
6. **Add Background/Outline** — Factor shared preconditions (G6), parameterize variations (G7)
7. **Validate** — Check all G1-G14 rules satisfied

## Ticket-Type Pattern Map

| Type | Pattern | Feature Title | Min Scenarios |
|------|---------|---------------|---------------|
| Story (has G/W/T) | 1 | `[NG-##### AC#]` | 2 per AC |
| Story (numbered ACs) | 2 | `[NG-##### AC#]` | 2 per AC |
| Story (checkboxes) | 3 | `[NG-##### AC#]` | 2 per AC |
| Story (DoD items) | 4 | `[NG-##### AC#]` | 2 per AC |
| Bug / Defect | 5 | `[NG-##### BUG]` | 3 (bug+fix+edge) |
| Task / Improvement | 6 | `[NG-##### TASK#]` | 2 |
| Sub-task | 7 | `[NG-##### SUB#] (parent: NG-#####)` | 2 |
| Sub-bug | 7 | `[NG-##### SUB-BUG] (parent: NG-#####)` | 3 |
| Epic | 8 | `[NG-##### EPIC]` | 2 (all-complete + partial) |
| Spike | 9 | `[NG-##### SPIKE]` | 2 (found + inconclusive) |

## Reference

See [./examples.md](./examples.md) for required structure template, worked examples per ticket type, and pattern details.
