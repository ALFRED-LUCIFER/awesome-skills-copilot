---
name: token-budget-loader
description: 'Token-aware skill loading — estimates context budget, loads skills in tiered detail (summary/standard/full), prevents window overflow. Use when: loading multiple skills, large context sessions, orchestrator planning, Long Build mode.'
---

# Token Budget Loader

Meta-skill that manages context window utilization when loading other skills.

## When to Use

- Before loading 3+ skills in a single session
- During orchestrator planning phases with many delegations
- In Long Build mode where context must span many files
- When a skill load fails due to context overflow

## Strategy

### Tier System

| Tier | Token Budget Remaining | Action |
|------|----------------------|--------|
| Full | > 60% remaining | Load complete SKILL.md |
| Standard | 30–60% remaining | Load skill minus examples/templates |
| Summary | 10–30% remaining | Load only frontmatter + step headers |
| Refuse | < 10% remaining | Skip load, log warning |

### Estimation Formula

```
estimated_tokens = file_bytes / 4
remaining_budget = model_context_limit - current_usage
tier = classify(remaining_budget / model_context_limit)
```

## Step 1 — Assess Current Budget

Before loading a skill, estimate current context usage:

```
Context indicators:
- Number of files already read
- Number of tool calls made (each adds ~200-500 tokens overhead)
- Conversation length (user messages + assistant messages)
- Approximate: short session (<5 turns) = ~20% used
                medium session (5-15 turns) = ~40% used
                long session (15+ turns) = ~60% used
```

## Step 2 — Classify Load Tier

Based on remaining budget, determine how to load the requested skill:

- **Full**: Read entire SKILL.md as-is
- **Standard**: Read SKILL.md but stop before example/template sections (look for `## Example`, `## Template`, `## Worked Example` headers)
- **Summary**: Read only lines 1–30 (frontmatter + first section)
- **Refuse**: Return message: "⚠️ Context budget insufficient to load skill '{name}'. Complete current work first."

## Step 3 — Load with Tier

```pseudocode
function loadSkill(skillPath, tier):
  if tier == "full":
    return read_file(skillPath, 1, EOF)
  elif tier == "standard":
    content = read_file(skillPath, 1, EOF)
    return truncate_at_examples(content)
  elif tier == "summary":
    return read_file(skillPath, 1, 30)
  else:
    return "⚠️ Budget exceeded"
```

## Step 4 — Report Budget Status

After loading, report:
```
📊 Skill loaded: {name} @ {tier} tier
   Estimated tokens used: ~{estimate}
   Session load count: {n} skills loaded this session
```

## Multi-Skill Batch Loading

When orchestrator needs multiple skills, prioritize by relevance:

1. Sort requested skills by relevance to current task
2. Load highest-priority skill at full tier
3. Load remaining at progressively lower tiers
4. Skip any that would exceed budget

## Integration with Orchestrator

The orchestrator should invoke this skill's logic before any `read_file` call on a SKILL.md:

```
Before: read_file(skill_path)
After:  assess_budget() → classify_tier() → load_at_tier(skill_path, tier)
```
