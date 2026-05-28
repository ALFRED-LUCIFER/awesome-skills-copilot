---
name: skill-telemetry
description: 'Track skill invocation metrics — frequency, token cost, success/failure rates, duration. Use when: optimizing skill library, identifying unused skills, measuring token efficiency, session retrospective.'
---

# Skill Telemetry

Tracks and reports skill usage metrics to optimize the agent library.

## When to Use

- End-of-sprint retrospective on AI agent efficiency
- Identifying skills that are never invoked (candidates for removal)
- Measuring token cost per skill to find optimization targets
- Comparing skill effectiveness across sessions

## Data Collection

After each skill invocation, log to `/memories/repo/telemetry.jsonl`:

```jsonl
{"ts":"2026-05-29T10:00:00Z","skill":"dotnet-crud-scaffold","tier":"full","tokens_est":1200,"duration_ms":3400,"status":"success","agent":"backend","session":"abc123"}
```

## Fields

| Field | Type | Description |
|-------|------|-------------|
| ts | ISO 8601 | Invocation timestamp |
| skill | string | Skill name |
| tier | string | Load tier (full/standard/summary) |
| tokens_est | int | Estimated tokens consumed |
| duration_ms | int | Wall-clock time |
| status | enum | success / failure / partial |
| agent | string | Invoking agent name |
| session | string | Session identifier |

## Report Generation

### Usage Frequency Report

```bash
# Top 10 most-used skills
cat memories/repo/telemetry.jsonl | jq -r '.skill' | sort | uniq -c | sort -rn | head -10
```

### Token Cost Report

```bash
# Total tokens per skill (descending)
cat memories/repo/telemetry.jsonl | jq -r '[.skill, .tokens_est] | @tsv' | \
  awk '{sum[$1]+=$2} END {for(k in sum) print sum[k], k}' | sort -rn
```

### Success Rate Report

```bash
# Failure rate per skill
cat memories/repo/telemetry.jsonl | jq -r '[.skill, .status] | @tsv' | \
  awk '{total[$1]++; if($2!="success") fail[$1]++} END {for(k in total) printf "%s: %.1f%% fail (%d/%d)\n", k, (fail[k]+0)/total[k]*100, fail[k]+0, total[k]}' | sort -t: -k2 -rn
```

### Optimization Recommendations

After collecting 50+ data points, generate recommendations:

1. **Remove**: Skills with 0 invocations in 30 days
2. **Compress**: Skills with avg tokens > 1500 and success rate > 90%
3. **Fix**: Skills with failure rate > 20%
4. **Promote**: Skills invoked > 10x/week → consider making them always-loaded instructions
5. **Merge**: Skills always invoked together → create a combined skill

## Dashboard Output

```
═══ Skill Telemetry Dashboard ═══
Period: {start} → {end}
Total invocations: {n}
Total tokens consumed: ~{sum}

Top 5 by frequency:        Top 5 by token cost:
1. {skill} ({n}x)          1. {skill} (~{tokens} avg)
2. ...                     2. ...

⚠️ Optimization targets:
- {skill}: high cost, consider compression
- {skill}: 0 usage in 30d, consider removal
- {skill}: 35% failure rate, needs fix
```
