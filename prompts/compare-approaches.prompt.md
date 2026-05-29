---
name: compare-approaches
description: Compare 2-3 technical approaches with a tradeoffs matrix covering complexity, performance, maintainability, and team familiarity
argument-hint: Describe the approaches to compare, e.g. "Redis vs Memcached vs in-memory cache"
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [search/codebase]
---

Compare these approaches: `${input:approaches:Describe the 2-3 approaches to compare}`

## Analysis

For each approach, evaluate:

| Dimension | Approach A | Approach B | Approach C |
|-----------|-----------|-----------|-----------|
| Complexity | | | |
| Performance | | | |
| Maintainability | | | |
| Scalability | | | |
| Team familiarity | | | |
| Ecosystem maturity | | | |
| Migration effort | | | |

## Recommendation

Provide a clear recommendation with rationale, and conditions under which you'd choose differently.
