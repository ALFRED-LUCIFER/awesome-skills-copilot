---
name: incident-postmortem
description: Generate a structured blameless postmortem from an incident timeline with root cause analysis and action items
argument-hint: Describe the incident or paste the timeline
agent: agent
model: Claude Sonnet 4.6 (copilot)
tools: [edit]
---

Generate a postmortem for: `${input:incident:Describe the incident or paste the timeline}`

## Template

```markdown
# Incident Postmortem — [Title]

**Date**: YYYY-MM-DD
**Duration**: Xh Ym
**Severity**: SEV-1/2/3/4
**Author**: [name]
**Status**: Draft / Reviewed / Complete

## Summary
[1-2 sentence description of what happened and impact]

## Impact
- Users affected: X
- Revenue impact: $X (if applicable)
- SLA violation: Yes/No

## Timeline (UTC)
| Time | Event |
|------|-------|
| HH:MM | ... |

## Root Cause
[Technical explanation of the root cause]

## Contributing Factors
1. [Factor that made the incident possible or worse]

## What Went Well
1. [Things that worked during response]

## What Went Wrong
1. [Things that hindered response]

## Action Items
| # | Action | Priority | Owner | Due Date | Status |
|---|--------|----------|-------|----------|--------|
| 1 | [prevention action] | P1/P2/P3 | | | TODO |

## Lessons Learned
1. [Key takeaway]
```

Fill in based on the provided incident details. Ensure blameless language throughout — focus on systems, not individuals.
