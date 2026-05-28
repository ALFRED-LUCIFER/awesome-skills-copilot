---
name: jira-gherkin-convert
description: Convert Jira ticket descriptions to full Gherkin ACs — detects existing Gherkin, supports all ticket types (Story, Bug, Task, Sub-task, Epic, Spike), writes back via MCP
---

# Jira Gherkin Convert Skill

Convert any Jira ticket to **publication-quality** Gherkin format following all G1–G14 rules from `#skill:gherkin-format`.

## Quality Standard

Every Gherkin output MUST meet these quality gates before writing back to Jira:

| Gate | Requirement |
|------|-------------|
| **Structural completeness** | Every `Feature:` has `As a / I want / So that` lines (G2) |
| **Traceability** | Feature title matches format `[NG-XXXX TYPE#] — desc` (G9) |
| **Scenario coverage** | Minimum scenario count met per ticket type (G3) |
| **Named scenarios** | Every `Scenario:` has a unique, descriptive name — never blank or generic (G4) |
| **Concrete test data** | All values are specific and realistic — `"2.5.18"` not `"a version"` (G8) |
| **And/But usage** | Additional preconditions use `And`, negative assertions use `But` (G5) |
| **Background dedup** | Shared preconditions extracted to `Background:` — no duplicated `Given` across scenarios (G6) |
| **Scenario Outline** | Data-driven flows use `Scenario Outline:` + `Examples:` table (G7) |
| **Rule grouping** | Distinct business rules within a Feature use `Rule:` keyword (G12) |
| **No invention** | All scenarios derived from ticket content — edge cases allowed, invented business rules are not (G10) |
| **Jira-safe format** | No ` ```gherkin ` tag in write-back — plain text or untagged code block only (G11) |
| **No Doc Strings/Data Tables in Jira** | These don't render in Jira ADF — use indented plain text instead (G14 Jira note) |

## Gherkin Detection Check

Before converting, scan the existing description for:
- Line starting with `Feature:`
- Line starting with `Scenario:` or `Scenario Outline:`
- Lines containing `Given`, `When`, `Then`

| Condition | Action |
|-----------|--------|
| ALL 3 markers present | Already Gherkin — validate against quality gates above, fix deficiencies only |
| PARTIAL (some markers) | Note what is missing, complete it to full Gherkin |
| NONE | Full conversion from scratch |

## Ticket Type → Gherkin Pattern

| Jira Type | Has Parent? | Min Scenarios | Feature Title Format | Pattern from `#skill:gherkin-format` |
|-----------|-------------|---------------|----------------------|--------------------------------------|
| Story | No | 2 per AC (happy + edge) | `[NG-XXXX AC#] — desc` | Pattern 1–4 (based on AC format) |
| Bug | No | 3 (Bug + Fix + Edge) | `[NG-XXXX BUG] — desc` | Pattern 5 |
| Task | No | 2 (success + failure) | `[NG-XXXX TASK#] — desc` | Pattern 6 |
| Sub-task | Yes, parent ≠ Bug | 2 (happy + edge) | `[NG-XXXX SUB#] — desc (parent: KEY)` | Pattern 7 (sub-task) |
| Sub-bug | Yes, parent = Bug | 3 (Bug + Fix + Edge) | `[NG-XXXX SUB-BUG] — desc (parent: KEY)` | Pattern 7 (sub-bug) |
| Epic | No | N/A — list child keys, convert each individually | `[NG-XXXX EPIC] — desc` | Pattern 8 |
| Spike | No | 2 (found + inconclusive) | `[NG-XXXX SPIKE] — desc` | Pattern 9 |
| Improvement | No | 2 per AC (happy + edge) | `[NG-XXXX IMP#] — desc` | Pattern 6 (task variant) |

## Conversion Workflow

```
1. Fetch ticket via Jira MCP (get_issue)
2. Classify ticket type → select pattern
3. If Sub-task/Sub-bug → fetch parent ticket for context
4. If Epic → list children, report keys, convert each individually
5. Extract ACs / description / STR / checklists
6. Convert to Gherkin using the matched pattern
7. Run quality gate checklist (all 12 gates above)
8. Preview to user in chat (with ```gherkin tag for syntax highlighting)
9. On approval → write back via MCP (update_issue) using plain text / untagged code block
```

## AC Extraction Strategy

| Description Format | Extraction Method |
|--------------------|-------------------|
| Numbered ACs (`AC1:`, `AC2:`) | Each AC → separate `Feature:` block (Pattern 2) |
| Given/When/Then already present | Wrap in `Feature:` + `Scenario:`, add edge cases (Pattern 1) |
| Checkbox list (`- [ ] item`) | Each checkbox → `Scenario:` within one `Feature:` (Pattern 3) |
| DoD items | Each DoD item → verification `Scenario:` (Pattern 4) |
| Free-text description | Parse goals into `Feature:` + `Scenario:` pairs (Pattern 2) |
| Bug with STR/Current/Expected | Map to Bug/Fix/Edge scenarios (Pattern 5) |

## Jira Write-Back Rules

- Use plain text or code block with **NO** `gherkin` language tag — Jira ADF does not support it (G11)
- Preserve existing non-AC content in the description (don't overwrite the whole field)
- Replace only the AC section — keep headers like "Description", "Affected Files", "Proposed Fix"
- Add a separator line (`---`) between preserved content and Gherkin block
- If multiple `Feature:` blocks, separate with a blank line

## Output Preview Format

When showing Gherkin to the user in chat (before write-back), use:
````
```gherkin
Feature: [NG-XXXX AC1] — ...
```
````

When writing to Jira, strip the ` ```gherkin ` tags and use plain text.

## MCP Fallback

If Jira MCP is unreachable:
> "Jira MCP is unreachable. Paste the ticket content and I'll convert it — then copy the output back manually."
