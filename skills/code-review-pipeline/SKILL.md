---
name: code-review-pipeline
description: >
  Multi-model panel review system with cross-examination, conflict resolution,
  auto-fix delegation, and iteration control. Enforces GUARDRAILS § 12e.
  Portable across VS Code, Copilot CLI, and cloud agents.
version: 2.0.0
---

# Multi-Model Panel Review Pipeline

> **Portable Skill** — implements GUARDRAILS § 12e (Review Failure Protocol) as a reusable workflow.
> This is the primary review mechanism for `--full` mode and all mandatory chain invocations.

## Chain Overview

```
@reviewer --full → [4 panelists in parallel] → cross-examination → coordinator synthesis → [if score > 5] → auto-fix → re-review → loop (max 3)
```

---

## Panel Composition

| Role | Model | Responsibility | Bias Direction |
|------|-------|---------------|----------------|
| **Security Auditor** | `GPT-5.5 (copilot)` | OWASP Top 10, SEC-1–24, auth, input validation, data exposure, secrets, XSS, IDOR | Strict — flags aggressively |
| **Architecture Judge** | `Claude Opus 4.6 (copilot)` | Layer violations, SOLID, DDD, controller pattern, cross-domain imports, coupling, YAGNI | Conservative — questions necessity |
| **Quality Enforcer** | `Claude Sonnet 4.5 (copilot)` | Readability, duplication (DUP-1–5), tests, accessibility (WCAG 2.2 AA), naming, i18n | Thorough — exhaustive checklist |
| **Codex Code Agent** | `GPT-5.3-Codex (copilot)` | Compile/type correctness, API misuse, regression risk, patch feasibility, minimal fix diffs | Pragmatic — validates fixability |
| **Coordinator** | `Claude Sonnet 4.6 (copilot)` _(the reviewer agent)_ | Synthesizes panel, resolves conflicts, computes final score, drives auto-fix loop | Balanced — resolves disagreements |

---

## Panel Workflow

```
STEP 1 — PARALLEL DEEP SCAN (all 4 specialists run simultaneously via runSubagent)
  ├── Security Auditor  → Scans for SEC-1–SEC-24, OWASP, auth, secrets, injection vectors
  ├── Architecture Judge → Scans for layer violations, coupling, SOLID, DDD, YAGNI
  ├── Quality Enforcer  → Scans for DUP-1–5, WCAG, readability, test coverage, naming
  └── Codex Code Agent  → Scans for compile/type failures, API misuse, regression risk, patch feasibility

STEP 2 — CROSS-EXAMINATION (specialists review each other's findings)
  Each panelist receives the other reports and MUST:
  ├── Confirm: "I agree — here is supporting evidence from my domain"
  ├── Escalate: "This is worse than flagged — severity should be 🔴 because…"
  ├── Dispute: "I disagree — this is intentional/acceptable because…"
  └── Add: "Related issue the other panelist missed: [finding]"

STEP 3 — COORDINATOR SYNTHESIS
  Coordinator receives all 4 reports + cross-examination responses and:
  ├── Resolves every disputed finding (applies tiebreaker rules below)
  ├── Deduplicates overlapping findings across panelists
  ├── Computes final unified score across all 7 dimensions
  ├── Produces ranked issue list (Critical → High → Medium → Low)
  └── Emits final review output in standard § 2 format

STEP 4 — AUTO-FIX LOOP (if score > 5)
  └── Coordinator delegates fixes → re-runs full panel → max 3 iterations
```

---

## Panelist Prompt Templates

When `--full` or mandatory chain triggers the panel, invoke each specialist via `runSubagent`:

### Security Auditor prompt:
```
You are a Security Auditor performing a focused security review.
Review the following [frontend/backend] code for ALL SEC-1 through SEC-24 violations
from GUARDRAILS-code.instructions.md, plus OWASP Top 10.
Specifically check: input validation, auth/authz on every endpoint, SQL injection,
XSS (dangerouslySetInnerHTML, unescaped output), IDOR, hardcoded secrets, insecure storage,
CSRF, missing rate limiting, exposed stack traces.
For each finding: file, line, severity (🔴/🟠/🟡/🔵), OWASP category, concrete fix.
Do NOT check readability, architecture, or test coverage — security ONLY.
Return JSON: { panelist: "security", findings: [...], summary: "..." }
```

### Architecture Judge prompt:
```
You are an Architecture Judge performing a focused architecture review.
Review the following [frontend/backend] code against the Copilot Agent System platform patterns:
- Backend: Controller→Service→Repository layering, BaseResponse<T>, AsNoTracking, dual DbContext
- Frontend: useXxxController pattern, no state hooks in page components, no cross-domain imports,
  domain structure src/domain/{feature}/hooks|components|types
Check: SOLID violations, coupling, god classes/components, YAGNI, premature abstraction,
cross-domain imports, DI correctness, AutoMapper usage (backend), TanStack Query patterns (frontend).
For each finding: file, line, severity, violated principle, concrete restructuring fix.
Do NOT check security, readability scores, or test coverage — architecture ONLY.
Return JSON: { panelist: "architecture", findings: [...], summary: "..." }
```

### Quality Enforcer prompt:
```
You are a Quality Enforcer performing a focused quality review.
Review the following [frontend/backend] code for:
1. Duplicate code (DUP-1–DUP-5): method body >10 lines in 2+ files, DTO fields copy-pasted, test setup duplication
2. Readability: magic numbers, nested ternaries, dead code, misleading names
3. Test coverage: missing happy-path, error-path, boundary tests; no jest-axe / cy.checkA11y()
4. Accessibility (WCAG 2.2 AA): missing aria-label, form labels, focus trap, colour contrast
5. i18n compliance: hardcoded strings not wrapped in t('key')
6. Naming conventions: per platform-dev.instructions.md (no abbreviations, wrong prefixes)
For each finding: file, line, severity, specific rule violated, concrete fix.
Do NOT check security or architectural layering — quality ONLY.
Return JSON: { panelist: "quality", findings: [...], summary: "..." }
```

### Codex Code Agent prompt:
```
You are a Codex Code Agent performing a focused implementation correctness review.
Review the following [frontend/backend] code for compile/type errors, broken imports,
API misuse, signature mismatches, unreachable branches, async mistakes, test breakage risk,
and whether each suggested fix can be applied as a minimal, localized patch.
Specifically check: generated client/API shape mismatches, DTO/type drift, wrong overloads,
missing awaits, incorrect null handling, stale test expectations, and patch feasibility.
For each finding: file, line, severity, failing contract or compiler/type risk, minimal fix diff.
Do NOT check policy/security/style unless it creates a concrete compile or runtime defect.
Return JSON: { panelist: "codex", findings: [...], summary: "..." }
```

---

## Cross-Examination Protocol

After receiving all 4 panelist JSON reports, the Coordinator presents each panelist's findings to the other specialists:

```
Coordinator → Security Auditor:
  "Architecture Judge flagged: [finding]. Does this have security implications?"
  "Quality Enforcer flagged: [finding]. Is this a security concern too?"

Coordinator → Architecture Judge:
  "Security Auditor flagged: [finding]. Does this indicate an architectural root cause?"
  "Quality Enforcer flagged: [finding]. Is this a SOLID violation or just style?"

Coordinator → Quality Enforcer:
  "Security Auditor flagged: [finding]. Are there missing security tests needed?"
  "Architecture Judge flagged: [finding]. Is this also a duplication or readability issue?"

Coordinator → Codex Code Agent:
  "Security Auditor flagged: [finding]. Is the proposed fix compile-safe and minimal?"
  "Architecture Judge flagged: [finding]. What is the lowest-risk patch path?"
  "Quality Enforcer flagged: [finding]. Will the fix break tests or generated contracts?"
```

Each specialist replies with: `CONFIRM | ESCALATE | DISPUTE | ADD` + rationale.

---

## Conflict Resolution (Tiebreaker Rules)

| Conflict | Tiebreaker Rule |
|---|---|
| Security Auditor says 🔴, others say 🟡 | **Security wins** — security escalations are never downgraded without explicit evidence |
| Architecture Judge says 🟠, Security says 🔵 | **Security wins** for any finding with an attack vector |
| Quality Enforcer says 🔴, others say 🟡 | **Coordinator decides** — Quality rarely has Critical issues; assess actual user impact |
| Codex Code Agent says a fix cannot compile | **Codex blocks auto-fix** — require a compile-safe patch before delegation |
| Two panelists agree, one disputes | **Majority rules** — disputed panelist must provide new evidence to override |
| All three disagree | **Coordinator casts deciding vote** — must cite specific GUARDRAILS rule as justification |
| Finding appears in 2+ panelist reports | **Deduplicate** — use highest severity assigned; note which panelists flagged it |

---

## When to Use Panel vs Single Reviewer

| Trigger | Mode | Panel Used? |
|---|---|---|
| `--full` flag | Comprehensive | ✅ Full 4-panelist panel |
| Mandatory chain (§ 12) after code generation | Comprehensive | ✅ Full 4-panelist panel |
| `--security` flag | Focused | ✅ Security Auditor only |
| `--performance` flag | Focused | ❌ Single pass (Coordinator only) |
| `--coverage` flag | Focused | ✅ Quality Enforcer only |
| `--quality` (default) | Standard | ❌ Coordinator single pass (faster) |
| `--critique` flag | Adversarial | ✅ Architecture Judge + Coordinator |
| Re-review after auto-fix (iteration 2+) | Re-check | ✅ Full panel (changed files only) |

> **Performance note**: Full 4-panelist panel is thorough but takes longer. Use `--quality` for routine reviews and `--full` for pre-PR and mandatory chains.

---

## Auto-Fix Delegation

When the review score > 5 in a mandatory chain:
1. Panel completes and Coordinator synthesizes final issue list
2. Categorize issues by technology (frontend → `@frontend`, backend → `@backend`)
3. **Auto-delegate fixes** — pass ranked issue list with file:line:fix to the appropriate builder
4. Builder fixes ONLY the flagged issues (no unrelated refactoring)
5. Coordinator re-runs full panel on changed files only (not entire codebase)
6. Repeat until score ≤ 5 or max 3 iterations (then escalate to user)

```
Iteration 1: Full panel → score 22 → delegate to @backend (8 issues) + @frontend (4 issues)
Iteration 2: Full panel on changed files → score 8 → delegate remaining 3 issues
Iteration 3: Full panel on changed files → score 3 → PASS ✅
```

---

## Score & Gate

- Compute overall score using severity weights: 🔴=10, 🟠=5, 🟡=2, 🔵=1
- **PASS**: score ≤ `REVIEW_PASS_THRESHOLD` (default 5)
- **FAIL**: score > threshold → auto-fix loop

**Dimension scoring (1–10)**: Each of 7 dimensions scored independently. 10 = no issues. Deduct: 🔴 −4, 🟠 −2, 🟡 −1, 🔵 −0.5. Minimum is 1.

---

## Architecture Debt Tracking

If architectural issues are found (not just code quality):
1. Flag as `ARCHITECTURE_DEBT`
2. Recommend Jira sub-task creation (§ 12l)
3. Include in chain metrics output

---

## Response Contracts

### Success:
```json
{
  "chain": "review",
  "status": "PASS | FAIL | MAX_ITERATIONS_REACHED",
  "score": 3,
  "iterations": 1,
  "panelMode": "full-panel",
  "panelVerdict": {
    "securityAuditor":    { "model": "GPT-5.5",          "findingsCount": 1, "highestSeverity": "🟡" },
    "architectureJudge":  { "model": "Claude Opus 4.6", "findingsCount": 0, "highestSeverity": null },
    "qualityEnforcer":    { "model": "Sonnet 4.5",      "findingsCount": 3, "highestSeverity": "🟡" },
    "codexCodeAgent":     { "model": "GPT-5.3-Codex",   "findingsCount": 1, "highestSeverity": "🔵" },
    "disputedFindings": 0,
    "escalatedFindings": 0,
    "tiebreakersApplied": []
  },
  "findings": { "critical": 0, "high": 0, "medium": 2, "low": 1, "info": 3 },
  "architectureDebt": [],
  "autoFixesApplied": 0
}
```

### Escalation (max iterations reached):
```json
{
  "chain": "review",
  "status": "MAX_ITERATIONS_REACHED",
  "escalation": "MAX_ITERATIONS",
  "iteration": 3,
  "score": 18,
  "remainingIssues": [...],
  "recommendation": "Auto-fix loop exhausted after 3 iterations. Manual review required."
}
```
