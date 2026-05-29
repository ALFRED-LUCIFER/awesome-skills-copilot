---
name: estimate-effort
description: T-shirt estimate (S/M/L/XL) a feature with breakdown by layer and risk factors
argument-hint: Describe the feature or paste the ticket summary
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [search/codebase]
---

Estimate effort for: `${input:feature:Describe the feature or paste the ticket}`

## Step 1 — Decompose

Break the feature into layers: API, business logic, data, frontend, tests, infrastructure.

## Step 2 — Estimate per layer

| Layer | Changes Needed | Estimate | Risk |
|-------|---------------|----------|------|
| API | | S/M/L/XL | Low/Med/High |
| Business Logic | | | |
| Data/Schema | | | |
| Frontend | | | |
| Tests | | | |
| Infrastructure | | | |

## Step 3 — Overall estimate

- **T-shirt size**: S (1-2d) / M (3-5d) / L (1-2w) / XL (2-4w)
- **Confidence**: High / Medium / Low
- **Risks**: list unknowns that could increase the estimate
- **Suggestion**: any scope reduction that would lower the estimate
