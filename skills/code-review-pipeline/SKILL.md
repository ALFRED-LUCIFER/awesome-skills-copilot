---
name: code-review-pipeline
description: >
  Multi-model panel review system with cross-examination, conflict resolution,
  auto-fix delegation, and iteration control. Enforces GUARDRAILS § 12e.
  Portable across VS Code, Copilot CLI, and cloud agents.
version: 2.0.0
---

# Multi-Model Panel Review Pipeline

## When to Use

- @reviewer in `--full` mode
- Mandatory chain invocations (backend/frontend quality chains)
- Any review requiring multi-perspective analysis

## Rules

1. 4 panelists run in parallel via `runSubagent`, then coordinator synthesizes
2. Panel: Security Auditor (GPT-5.5), Architecture Judge (Opus 4.6), Quality Enforcer (Sonnet 4.5), Codex Agent (GPT-5.3-Codex)
3. Coordinator (Sonnet 4.6) resolves conflicts by majority — ties broken by Security Auditor
4. Score: 🔴=10, 🟠=5, 🟡=2, 🔵=1 — pass threshold ≤ 5
5. If score > 5: auto-fix via Codex Agent, then re-review (max 3 iterations)
6. Cross-examination: panelists challenge each other's findings before synthesis
7. Each panelist returns structured JSON: `{findings[], severity, confidence}`
8. Coordinator merges, deduplicates, and produces final verdict
9. Auto-fix must not introduce new issues — verify with targeted re-scan
10. If 3 iterations fail to reach ≤ 5, escalate to human with full panel transcript

## Steps

1. **Collect diff** — gather changed files (staged or PR diff)
2. **Parallel scan** — spawn 4 panelist subagents with diff + file context
3. **Cross-examination** — each panelist reviews others' findings, flags disagreements
4. **Coordinator synthesis** — merge findings, resolve conflicts, compute score
5. **Gate check** — if score ≤ 5: PASS → return verdict; if > 5: continue
6. **Auto-fix** — Codex Agent generates minimal fix patches for flagged issues
7. **Re-review** — re-run panel on fixed code (iteration counter++)
8. **Final verdict** — return JSON contract (score, scoreLevel, panelVerdict, issues, summary)

## Panel Responsibilities

| Panelist | Focus Areas |
|----------|-------------|
| Security Auditor | OWASP Top 10, SEC-1–24, auth, secrets, injection, XSS, IDOR |
| Architecture Judge | Layer violations, SOLID, DDD, coupling, YAGNI, controller pattern |
| Quality Enforcer | Readability, duplication DUP-1–5, tests, a11y WCAG 2.2 AA, naming |
| Codex Agent | Compile correctness, type safety, API misuse, regression risk, fix feasibility |

## Output Contract

```json
{"score": 3, "scoreLevel": "🟡", "panelVerdict": "PASS", "iterations": 1, "issues": [], "summary": "..."}
```

## Reference

See [./examples.md](./examples.md) for panelist prompt templates, cross-examination protocol, and worked review examples.
