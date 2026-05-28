# gherkin-format

> Complete Gherkin format specification — rules G1–G14, Jira-specific constraints, and worked examples for all ticket types.

## Purpose

Defines the canonical Gherkin format for all acceptance criteria in the your project project. Reference specification for agents and prompts that generate or validate Gherkin.

## When to Use

- `@jira-planner` agent generating ACs
- `/draft-user-story` prompt
- `/convert-to-gherkin` prompt
- Any Gherkin generation or validation

## Key Rules

| Rule | Description |
|------|-------------|
| G1 | Feature title must match Jira summary |
| G2 | One Scenario per AC |
| G3 | Given-When-Then order is mandatory |
| G4 | Steps must be declarative, not imperative |
| G5 | Use Background for shared preconditions |
| G6 | Scenario Outline for parameterized tests |
| G7–G14 | Additional formatting, tagging, and structure rules |

## Supported Structures

- `Feature:` / `Scenario:` (mandatory)
- `Rule:` / `Background:` (optional)
- `Scenario Outline:` + `Examples:` (for parameterized)
- Doc Strings and Data Tables

## Used By

- `@jira-planner` agent
- `/draft-user-story` prompt
- `/convert-to-gherkin` prompt
