---
name: gherkin-format
description: Complete Gherkin format specification for jira-planner. Defines required structure, rules G1-G11, Jira-specific constraints, and worked examples for all ticket types.
---

# Gherkin Format Specification

All acceptance criteria MUST use **complete Gherkin syntax** with proper structure. Never output bare `Given/When/Then` lines without a `Feature` and `Scenario` wrapper.

## Required Structure

Every AC output MUST include ALL of these elements:

```gherkin
Feature: [NG-##### AC#] — [Short feature description]
  As a [role]
  I want [goal]
  So that [business value]

  Background:                          # Optional — shared preconditions across all scenarios in Feature
    Given [common precondition]

  # Use Rule: to group scenarios under a distinct business rule (Gherkin 6, G12)
  Rule: [Business rule description]

    Background:                        # Optional — shared preconditions scoped to this Rule only
      Given [rule-specific precondition]

    Scenario: [Descriptive scenario name — happy path]
      Given [specific precondition / system state]
        And [additional precondition if needed]
      When [user action / system event]
        And [additional action if needed]
      Then [expected outcome]
        And [additional assertion if needed]
        But [negative assertion if needed]

    Scenario: [Descriptive scenario name — edge case or error path]
      Given [specific precondition / system state]
      When [action that triggers edge case]
      Then [expected handling / error message / fallback]

  Scenario Outline: [Name — when testing variations]
    Given [precondition with <variable>]
    When [action with <variable>]
    Then [outcome with <expected>]

    Examples:
      | variable   | expected       |
      | value_1    | result_1       |
      | value_2    | result_2       |
```

### Step Arguments (G14)

**Doc Strings** — pass multi-line content to a step:
```gherkin
  Scenario: Submit JSON payload
    Given the request body is
      """json
      {
        "name": "Storage Area A",
        "capacity": 100
      }
      """
    When I POST to "/api/storage-areas"
    Then the response status is 201
```

**Data Tables** — pass structured tabular data to a step:
```gherkin
  Scenario: Multiple items are displayed
    Given the following storage areas exist
      | Name             | Capacity | Status   |
      | Storage Area A   | 100      | Active   |
      | Storage Area B   | 50       | Inactive |
    When I view the storage areas list
    Then all rows are displayed with correct values
```

> **Jira note**: Do NOT use Doc Strings or Data Tables inside Jira ticket descriptions — they will not render correctly. Paste them as plain indented text or code blocks for readability.

## Rules G1–G14

| # | Rule | Detail |
|---|------|--------|
| G1 | **Feature per AC / per ticket** | Stories: each AC gets its own `Feature:` block. Bugs/Tasks/Sub-tasks/Spikes: one `Feature:` per ticket. Epics: one `Feature:` for epic-level acceptance + one per child. |
| G2 | **User story line** | Every Feature MUST include `As a / I want / So that` lines — for Tasks/Spikes use developer role if no user role exists |
| G3 | **Minimum scenarios** | Stories: min 2 (happy + edge). Bugs/Sub-bugs: min 3 (bug + fix + edge). Tasks: min 2 (success + failure). Spikes: min 2 (found + inconclusive). Epics: min 2 (all complete + partial). |
| G4 | **Named scenarios** | Every `Scenario:` MUST have a descriptive name — never leave it blank or generic |
| G5 | **And / But steps** | Use `And` for additional preconditions/assertions and `But` for negative assertions within a scenario |
| G6 | **Background** | Use `Background:` when multiple scenarios share the same preconditions — avoid duplicating Given steps |
| G7 | **Scenario Outline** | Use `Scenario Outline:` with `Examples:` table when the same flow is tested with different data |
| G8 | **Concrete values** | Use specific, realistic test data in steps — not vague descriptions (e.g. `"2.5.18"` not `"latest version"`) |
| G9 | **Traceability** | Feature title format varies by type: Story `[NG-##### AC#]`, Bug `[NG-##### BUG]`, Task `[NG-##### TASK#]`, Sub-task `[NG-##### SUB#]`, Sub-bug `[NG-##### SUB-BUG]`, Epic `[NG-##### EPIC]`, Spike `[NG-##### SPIKE]`, Improvement `[NG-##### IMP#]` |
| G10 | **No invented ACs** | Only create scenarios from what exists in the ticket — edge cases are allowed as they test the stated AC |
| G11 | **No `gherkin` language tag in Jira** | When writing Gherkin to a Jira ticket description, use plain text or a code block with NO language identifier. `gherkin` is NOT supported by Jira's ADF renderer — it throws _"Unable to find source-code formatter for language: gherkin"_. You may use ` ```gherkin ` only when previewing to the user in chat. |
| G12 | **Rule keyword** | Use `Rule:` (Gherkin 6) inside a `Feature:` to group scenarios that share the same business rule. Add a `Background:` inside the `Rule:` block for shared preconditions scoped to that rule only. Use when a single Feature has distinct sub-rules that each need their own set of scenarios. |
| G13 | **Asterisk (*) step** | Use `*` instead of `Given/When/Then/And/But` when a step is part of a list and forcing a keyword would read unnaturally (e.g. enumerating items). Keep sparingly — prefer named keywords for clarity. |
| G14 | **Step arguments** | Use **Doc Strings** (triple `"""` delimiters) to pass multi-line content (JSON, XML, markdown) to a step. Use **Data Tables** (pipe-delimited `\| col \| col \|`) to pass structured tabular data. Both are part of the Gherkin spec and are supported by Cucumber test runners. Do NOT use these in Jira ticket descriptions — paste them as code blocks for readability only. |

## Example — Package Upgrade Ticket

```gherkin
Feature: [NG-37346 AC1] — Update all @myorg platform packages to latest stable versions
  As a developer
  I want all @myorg/ng-lib-* packages updated to their latest stable versions
  So that the Cutting Management app benefits from bug fixes and new features

  Background:
    Given the Cutting Management frontend repository is checked out
      And the current branch is up to date with main

  Scenario: Successfully update all @myorg platform packages
    Given package.json contains "@myorg/ng-lib-react-platform-common" at version "2.5.3"
      And package.json contains "@your-org/platform-lib" at version "2.5.3"
      And package.json contains "@myorg/ng-lib-react-masterdata-api" at version "2.1.18"
      And package.json contains "@myorg/ng-lib-react-masterdata-mui" at version "2.1.18"
      And package.json contains "@myorg/ng-lib-react-shapes-mui" at version "2.1.5"
    When I update all @myorg/ng-lib-* package versions to their latest stable releases
      And I run "pnpm install"
    Then pnpm-lock.yaml reflects the updated versions
      And no peer dependency warnings are reported
      And "node_modules" contains the correct package versions

  Scenario: Package registry is unreachable
    Given the npm registry for @myorg packages is unavailable
    When I run "pnpm install" after updating package.json
    Then the install fails with a network error
      And the original pnpm-lock.yaml is unchanged
      But no partial updates are left in node_modules

  Scenario Outline: Each package resolves to the expected latest version
    Given package.json contains "<package>" at version "<current>"
    When I update "<package>" to its latest stable version
    Then the resolved version in pnpm-lock.yaml is "<latest>"

    Examples:
      | package                                  | current | latest |
      | @myorg/ng-lib-react-masterdata-api       | 2.1.18  | 2.1.25 |
      | @myorg/ng-lib-react-masterdata-mui       | 2.1.18  | 2.1.25 |
      | @myorg/ng-lib-react-platform-common      | 2.5.3   | 2.5.18 |
      | @your-org/platform-lib         | 2.5.3   | 2.5.18 |
      | @myorg/ng-lib-react-shapes-mui           | 2.1.5   | 2.1.13 |

Feature: [NG-37346 AC2] — Application builds successfully after upgrades
  As a developer
  I want the application to compile without errors after package upgrades
  So that I can verify no breaking API changes were introduced

  Scenario: Build succeeds with updated packages
    Given all @myorg/ng-lib-* packages are updated to their latest stable versions
      And "pnpm install" completed successfully
    When I run "pnpm build"
    Then the build completes with exit code 0
      And no TypeScript compilation errors are reported

  Scenario: Build fails due to breaking API change
    Given a package update introduced a renamed export
    When I run "pnpm build"
    Then the build fails with a TypeScript error referencing the changed import
      And the error message identifies the affected file and line number
```

---

## Ticket-Type Extraction Patterns (used by `@jira-planner`)

Each pattern names a `Feature:` title format, a minimum scenario count, and a worked Gherkin example. Use the classification matrix in `agents/jira-planner.agent.md` to pick the right pattern.

### Pattern 1 — Story with `Given/When/Then` already in description

Wrap each AC's existing G/W/T in `Feature:` + `Scenario:` and add at least one edge-case scenario.

```gherkin
Feature: [NG-##### AC#] — [title from AC]
  As a [role from ticket]
  I want [goal from AC]
  So that [business value]

  Scenario: [Happy path — descriptive name]
    Given [context from AC]
    When [action from AC]
    Then [expected result from AC]

  Scenario: [Edge case / error path]
    Given [context variation]
    When [action that fails or edge case]
    Then [expected error handling / fallback]
```

### Pattern 2 — Story with numbered ACs

Convert each numbered AC to its own `Feature:` block with min 2 scenarios.

```
AC1: User can...    → Feature: [NG-##### AC1] — User can...
AC2: System displays... → Feature: [NG-##### AC2] — System displays...
```

### Pattern 3 — Story with checkbox lists

Each checkbox becomes a `Scenario:` within a single `Feature:`. Add an edge-case scenario for each.

### Pattern 4 — Story with DoD items

Convert each DoD item to a verification scenario.

### Pattern 5 — Bug / Defect

Bug tickets do NOT use numbered ACs — they describe a defect. Convert using this mapping:

| Bug Section | Gherkin Mapping |
|---|---|
| **Steps to Reproduce** | `Background:` preconditions + `Given/When` steps |
| **Current Behaviour** | `Scenario: Bug — [description]` → `Then` with the **wrong** outcome |
| **Expected Behaviour** | `Scenario: Fix — [description]` → `Then` with the **correct** outcome |
| **Affected Files** | Subtask file hints (NOT part of Gherkin) |
| **Proposed Fix** | Subtask implementation hints (NOT part of Gherkin) |

```gherkin
Feature: [NG-##### BUG] — [Bug title from ticket]
  As a [role]
  I want [the component/feature] to work correctly
  So that [business value / user impact]

  Background:
    Given [precondition from Steps to Reproduce]
      And [additional setup step]

  Scenario: Bug — [describes the defect]
    Given [state that triggers the bug]
    When [user action from Steps to Reproduce]
    Then [wrong outcome from Current Behaviour]
      And [additional wrong outcome if any]

  Scenario: Fix — [describes the correct behaviour]
    Given [same state as bug scenario]
    When [same user action]
    Then [correct outcome from Expected Behaviour]
      And [additional correct assertion]
      But [the old defective behaviour no longer occurs]

  Scenario: Edge case — [boundary or regression scenario]
    Given [variation of the triggering state]
    When [similar action under different conditions]
    Then [correct behaviour still holds]
```

**Rules for bug Gherkin:**
- Minimum 3 scenarios: **Bug** (documents defect), **Fix** (expected behaviour), **Edge case** (regression guard)
- The Bug scenario preserves the defect description for traceability — do NOT omit it
- Use concrete values from the ticket (e.g., "15+ navigation items", not "many items")
- `Affected Files` and `Proposed Fix` go into subtask descriptions, not into Gherkin steps

### Pattern 6 — Task / Improvement

Task tickets describe technical work without user-facing ACs. Convert checklist items or description goals into Gherkin.

| Task Section | Gherkin Mapping |
|---|---|
| **Description / Goal** | `Feature:` title + `As a / I want / So that` (use developer role if no user role) |
| **Checklist items** | Each item → one `Scenario:` (success path) |
| **Prerequisites / Dependencies** | `Background:` preconditions |
| **Verification steps** | `Then` assertions |

```gherkin
Feature: [NG-##### TASK1] — [Task goal from description]
  As a developer
  I want [technical goal]
  So that [technical benefit / unblocks something]

  Background:
    Given [prerequisite from description]

  Scenario: Successfully [complete the task]
    Given [starting state]
    When [action performed]
    Then [expected technical outcome]
      And [verification step]

  Scenario: Failure — [what could go wrong]
    Given [starting state with issue]
    When [same action attempted]
    Then [error or failure is handled gracefully]
```

### Pattern 7 — Sub-task / Sub-bug

Sub-tasks inherit context from their parent ticket. The agent MUST fetch the parent to understand full scope.

**Sub-task structure:**

```gherkin
Feature: [NG-##### SUB1] — [Sub-task title] (parent: NG-#####)
  As a [role from parent ticket]
  I want [focused goal of this sub-task]
  So that [contribution to parent goal]

  Background:
    Given parent ticket NG-##### requires [parent goal summary]
      And [precondition specific to this sub-task]

  Scenario: [Sub-task completed successfully]
    Given [starting state for this piece]
    When [action]
    Then [outcome for this sub-task]

  Scenario: Edge case — [boundary within this sub-task's scope]
    Given [variation]
    When [action under variation]
    Then [correct handling]
```

**Sub-bug structure:**

```gherkin
Feature: [NG-##### SUB-BUG] — [Fix area] (parent bug: NG-#####)
  As a [role]
  I want [this specific component] to work correctly
  So that [parent bug is resolved for this area]

  Background:
    Given parent bug NG-##### reports [parent bug summary]
      And this sub-bug addresses [specific component/file]

  Scenario: Bug — [defect in this specific area]
    Given [state from parent STR relevant to this component]
    When [action]
    Then [wrong outcome specific to this component]

  Scenario: Fix — [correct behaviour for this component]
    Given [same state]
    When [same action]
    Then [correct outcome]
      But [defect no longer occurs]

  Scenario: Edge case — [regression guard for this component]
    Given [boundary condition]
    When [action]
    Then [correct behaviour holds]
```

### Pattern 8 — Epic

Epics are NOT planned as single tickets. The agent decomposes them into child story/task plans.

```
1. Fetch the Epic and all linked child tickets (stories, tasks, bugs)
2. If no children exist → ask user to break down or describe deliverables
3. For each child ticket → apply the appropriate pattern (1-9) based on its type
4. Create a master TODO list grouping children by dependency order
5. Output a dependency graph showing which children block others
6. Feature title format: Feature: [NG-##### EPIC] — [Epic goal]
```

Epic Gherkin covers the overarching acceptance:

```gherkin
Feature: [NG-##### EPIC] — [Epic title]
  As a [role]
  I want [high-level goal]
  So that [business outcome]

  Scenario: All child deliverables are complete
    Given child story NG-##### "[title]" is implemented and tested
      And child story NG-##### "[title]" is implemented and tested
      And child task NG-##### "[title]" is complete
    When all children pass their acceptance criteria
    Then the epic goal "[goal]" is fully delivered
      And no child ticket remains in "Open" or "In Progress" status

  Scenario: Partial delivery — some children incomplete
    Given child story NG-##### is implemented
      But child story NG-##### is still in progress
    When the sprint ends
    Then the epic remains open
      And a status summary identifies the blocking children
```

### Pattern 9 — Spike / Research

Spikes produce knowledge, not code. Gherkin documents the investigation outcomes.

```gherkin
Feature: [NG-##### SPIKE] — [Investigation topic]
  As a [role]
  I want to investigate [topic]
  So that [we can make an informed decision about X]

  Background:
    Given the investigation is timeboxed to [X hours/days from ticket]

  Scenario: Investigation — Answer found for [question 1]
    Given [context / current understanding]
    When the spike investigates [specific question]
    Then a documented answer is provided in [output format: ADR / wiki / ticket comment]
      And the answer includes [pros/cons / benchmarks / PoC results]

  Scenario: Investigation — Inconclusive for [question 2]
    Given [context]
    When the spike investigates [question] within the timebox
    Then an "inconclusive" status is documented
      And follow-up questions or a new spike is recommended
      And the time spent is logged
```

### Worked Examples (per type)

**Story** — "plan NG-36060": Fetch → type Story → ACs AC1, AC2, AC3 → patterns 1-4 → 3 Feature blocks (min 2 scenarios each) → todos `AC1: ...`, `AC2: ...`, `AC3: ...`.

**Bug** — "plan NG-41234": Fetch → type Bug → pattern 5 → 1 Feature, min 3 scenarios (Bug + Fix + Edge) → todos `BUG-FIX: <file> — <fix area>`.

**Task** — "plan NG-40001": Fetch → type Task → pattern 6 → Feature per goal, min 2 scenarios → todos `TASK1: ...`.

**Sub-task** — "plan NG-40002": Fetch → type Sub-task, parent NG-40001 → fetch parent for context → pattern 7 → Feature with parent ref, min 2 scenarios → todos `SUB1: ... (parent: NG-40001)`.

**Epic** — "plan NG-39000": Fetch Epic + all 5 children → detect each child type → apply per-type pattern → epic-level Feature + per-child plans → todos `EPIC-GOAL1: NG-39001 — ...` plus dependency graph.
