# Copilot Agent System — GitHub Copilot Agent System v3.4.0

Organization-wide Copilot configuration for all Org repositories.  
**Stack:** .NET 10 · React 19 · TypeScript · MUI 7 · 15 agents · 15 slash commands · 28 skills · 14 instruction files · 2 MCP servers · 1 drift hook

---

## Contents

| # | Section |
|---|---------|
| [§ 1](#-1--repo-structure) | Repo Structure |
| [§ 2](#-2--quick-start-cheatsheet) | Quick-Start Cheatsheet |
| [§ 3](#-3--how-to-open-copilot-chat) | How to Open Copilot Chat |
| [§ 4](#-4--slash-commands--developer) | Slash Commands — Developer |
| [§ 5](#-5--slash-commands--tech-lead) | Slash Commands — Tech Lead |
| [§ 6](#-6--slash-commands--product-owner--ba) | Slash Commands — Product Owner / BA |
| [§ 7](#-7--slash-commands--scrum-master--pm) | Slash Commands — Scrum Master / PM |
| [§ 8](#-8--when-to-use-slash-command-vs-agent) | When to Use Slash Command vs Agent |
| [§ 9](#-9--agent--orchestrator-orchestrator) | Agent — `@orchestrator` (Orchestrator) |
| [§ 10](#-10--agents--planners) | Agents — Planners |
| [§ 11](#-11--agents--builders--reviewer) | Agents — Builders & Reviewer |
| [§ 12](#-12--agent--knowledge) | Agent — Knowledge |
| [§ 13](#-13--agents--hidden-workers) | Agents — Hidden Workers |
| [§ 14](#-14--mandatory-quality-chains) | Mandatory Quality Chains |
| [§ 15](#-15--handoff-buttons) | Handoff Buttons |
| [§ 16](#-16--workflow-recipes-ai) | Workflow Recipes A–I |
| [§ 17](#-17--portable-agent-skills) | Portable Agent Skills |
| [§ 18](#-18--mcp-servers--jira--confluence) | MCP Servers — Jira & Confluence |
| [§ 19](#-19--auto-injected-instruction-files) | Auto-Injected Instruction Files |
| [§ 20](#-20--quality-thresholds-reference) | Quality Thresholds Reference |
| [§ 21](#-21--mcp-environment-setup) | MCP Environment Setup |
| [§ 22](#-22--troubleshooting-guide) | Troubleshooting Guide |
| [§ 23](#-23--gherkin-rules-g1g11) | Gherkin Rules G1–G11 |
| [§ 24](#-24--all-agents--commands-summary) | All Agents & Commands Summary |
| [§ 25](#-25--changelog) | Changelog |

---

## § 1 · Repo Structure

This is an **enterprise `.github-private` repository** — recognized by GitHub Copilot for enterprise-wide custom agents per the [official enterprise spec](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/prepare-for-custom-agents). Only `/agents/*.agent.md` is read by GitHub's REST API; everything else (`instructions/`, `prompts/`, `skills/`) is consumed by the local VS Code Copilot extension and `@orchestrator` orchestration.

```
.github-private/
├── agents/                         ← 12 enterprise-wide Copilot agents (production)
│   ├── orchestrator.agent.md         ← Single entry-point orchestrator
│   ├── jira-planner.agent.md       ← Planner — Jira read+write
│   ├── docs-planner.agent.md ← Planner — enriched with Confluence
│   ├── backend.agent.md    ← Builder — .NET 10 / C#
│   ├── frontend.agent.md        ← Builder — React 19 / TS / MUI
│   ├── scaffold.agent.md
│   ├── migration.agent.md
│   ├── reviewer.agent.md           ← 7-dimension review (auto-fix loop)
│   ├── backend-tests.agent.md             ← Hidden — NUnit
│   ├── frontend-tests.agent.md          ← Hidden — Vitest + RTL
│   ├── e2e-tests.agent.md       ← Hidden — Cypress E2E
│   ├── playwright-e2e.agent.md  ← E.D.I.T.H. — Playwright E2E
│   └── docs-writer.agent.md
├── .github/
│   └── agents/                     ← Testing folder (visible only inside this repo)
│       └── README.md                    ← Promotion flow: .github/agents/ → agents/
├── instructions/                   ← 14 auto-injected guardrails (applyTo globs)
│   ├── GUARDRAILS.instructions.md           ← Master entry — always loaded
│   ├── GUARDRAILS-core.instructions.md      ← § 1–3, § 6, § 8–9
│   ├── GUARDRAILS-code.instructions.md      ← § 4–5, § 10, § 13 — .cs/.ts/.tsx
│   ├── GUARDRAILS-orchestration.instructions.md ← § 7, § 11–12 — agents/**
│   ├── testing-standards.instructions.md
│   ├── platform-common.instructions.md
│   ├── platform-dev.instructions.md
│   ├── platform-mrt.instructions.md
│   ├── platform-mui.instructions.md
│   ├── auth-patterns.instructions.md
│   ├── backend-patterns.instructions.md
│   ├── cypress-patterns.instructions.md
│   ├── ef-migration-patterns.instructions.md
│   └── filters.instructions.md
├── prompts/                        ← 16 slash commands (type / in Copilot Chat)
│   ├── explain-project.prompt.md / explain-file.prompt.md
│   ├── code-review-fix.prompt.md / bug-trace.prompt.md
│   ├── pr-describe.prompt.md / update-copilot-instruction.prompt.md
│   ├── jira-read.prompt.md / story-draft.prompt.md / sprint-status.prompt.md
│   ├── confluence-find.prompt.md
│   ├── tests.prompt.md / doc.prompt.md / generate.prompt.md / optimize.prompt.md
│   ├── gherkin-convert.prompt.md
│   └── product-flow-screenshots.prompt.md
├── skills/                         ← 28 Portable Agent Skills
│   ├── knowledge-init/SKILL.md         ← NEW: living knowledge base builder
│   ├── mandatory-frontend-chain/SKILL.md
│   ├── mandatory-backend-chain/SKILL.md
│   ├── mandatory-review-chain/SKILL.md
│   ├── frontend-crud-templates/SKILL.md
│   ├── frontend-test-templates/SKILL.md
│   ├── backend-crud-templates/SKILL.md
│   ├── nunit-test-templates/SKILL.md
│   ├── confluence-content-guide/SKILL.md
│   ├── namespace-detection/SKILL.md
│   ├── gherkin-format/SKILL.md
│   └── product-flow-screenshots/SKILL.md
├── docs/
│   ├── agents-guide.md             ← Full developer guide, workflows, recipes (was agents/README.md)
│   ├── INDEX.md                    ← Master domain knowledge index (auto-generated by /knowledge-init)
│   └── {domain}.md                 ← Per-domain knowledge docs (auto-generated by /knowledge-init)
├── hooks/
│   ├── session-logger/             ← Session logging + gotcha capture
│   ├── governance-audit/           ← Governance audit trail
│   ├── secrets-scanner/            ← Secret leak prevention
│   ├── tool-guardian/              ← Tool allowlist enforcement
│   └── knowledge-drift/            ← NEW: stale knowledge doc detection
├── profile/                        ← Organization profile (dormant — only renders for `.github` repos)
├── README.md                       ← This file
└── COPILOT-REFERENCE.html
```

> **Layout note.** `.github-private` is the enterprise's `.github` equivalent — the `agents/`, `instructions/`, `prompts/`, `skills/` folders sit at the **repo root**, mirroring the [`awesome-copilot`](https://github.com/github/awesome-copilot) template. New agents should be authored in `.github/agents/` first, validated, then promoted to `agents/` (see `.github/agents/README.md`).

---

## § 2 · Quick-Start Cheatsheet

> **No agent knowledge required.** Every workflow is accessible through slash commands (`/`) or by typing `@orchestrator` in Copilot Chat.

**Slash commands — type `/` in Copilot Chat:**

```bash
/explain-project
/explain-file src/Services/OrderService.cs
/code-review-fix
/code-review-fix src/Controllers/
/bug-trace                    # paste stack trace after the command
/pr-describe NG-1234
/story-draft managers want PDF export
/jira-read NG-5678
/sprint-status
/sprint-status Sprint 41
/confluence-find deployment guide
/generate CRUD for UserPreferences
/tests                        # active file
/doc                          # active file
/optimize                     # active file
/gherkin-convert NG-1234      # convert ticket description to Gherkin ACs + write back
```

**Agents — type `@` in Copilot Chat:**

```bash
# Feature from Jira ticket
@orchestrator plan NG-36060

# Build full-stack feature
@orchestrator build user preferences CRUD

# Enrich plan with Confluence
@docs-planner plan NG-36060 with Confluence context

# Write Confluence docs
@docs-writer create Frontend Standards page

# Direct code review
@reviewer --full src/

# Plan ticket only (no code)
@jira-planner plan NG-36060
```

---

## § 3 · How to Open Copilot Chat

| Action | Keyboard | Notes |
|--------|----------|-------|
| Open Copilot Chat panel | `Cmd`+`Shift`+`I` (macOS) · `Ctrl`+`Shift`+`I` (Win) | Main chat window — use here for agents and slash commands |
| Open inline chat in editor | `Cmd`+`I` (macOS) · `Ctrl`+`I` (Win) | Scoped to selected text / current file |
| Open quick chat | `Cmd`+`Shift`+`Alt`+`L` | Floating input — good for single questions |
| Invoke slash command | Type `/` in chat | Picker shows all 14 registered prompt files |
| Mention an agent | Type `@` in chat | Shows all user-invocable agents — all 14 agents are discoverable via `@` |

> **Tip:** If slash commands don't appear in the picker, restart VS Code. Commands live in `prompts/` and are auto-loaded org-wide by Copilot.

---

## § 4 · Slash Commands — Developer

### `/explain-project` · Developer · Tech Lead

> Instant onboarding — summarise any NG repo's stack, architecture, patterns, and test strategy. No argument needed.

**What you get:** Stack, service namespace, architecture layers, key patterns, test strategy table, MCP integrations, active instruction files.

```
/explain-project
```

**Detects automatically:** `.csproj` / `package.json` presence, namespace from source, test framework, MCP config.

---

### `/explain-file` · Developer

> Deep-dive any file — purpose, dependencies, callers, test counterpart, and relevant guardrail sections.

**Argument:** file path relative to workspace root

```
/explain-file src/Services/CuttingOrderService.cs
/explain-file src/features/machine-list/MachineTable.tsx
```

**What you get:** File type, purpose, injected dependencies/imports, key methods, test counterpart location, guardrail sections that apply.

---

### `/code-review-fix` · Developer · Tech Lead

> Review ALL uncommitted changes across 5 quality dimensions — and fix every issue immediately. No approval gate.

**Argument:** optional file or folder path — leave blank for all uncommitted changes

```bash
/code-review-fix                              # review all uncommitted
/code-review-fix src/Controllers/             # scope to folder
/code-review-fix src/Services/OrderService.cs # single file
```

**5 review lenses applied simultaneously:**

| Lens | What is checked |
|------|----------------|
| **Correctness** | Logic errors, null checks, broken `BaseResponse<T>` contracts |
| **Security** | SEC-1–24: SQL injection, hardcoded credentials, missing auth, XSS, IDOR |
| **Architecture** | Layer violations, coupling, pattern compliance |
| **Performance** | N+1 queries, missing `AsNoTracking`, blocking `.Result`/`.Wait()` |
| **Standards** | Naming, `async void`, missing `data-testid`, hardcoded strings |

**Severity scoring:**

| Severity | Score | Examples |
|----------|-------|---------|
| `Critical` | 10 | SQL injection, hardcoded secrets |
| `High` | 5 | Layer violation, missing AsNoTracking |
| `Medium` | 2 | Naming, missing data-testid |
| `Info` | 1 | Style notes |

_Every finding is fixed inline — no TODOs left behind. Build is verified after all fixes._

---

### `/bug-trace` · Developer

> Structured root-cause analysis from a pasted error message or stack trace — ranks causes and suggests file:line fixes.

**Argument:** paste your full error message or stack trace after the command

```
/bug-trace
System.NullReferenceException: Object reference not set.
   at Org.OrderService.Services.OrderService.GetByIdAsync(Int32 id)
      in OrderService.cs:line 87
   at Org.OrderService.Controllers.OrderController.Get(Int32 id)
      in OrderController.cs:line 34
```

**Steps performed:** Parse error → Read source files → Trace call chain → Search for patterns → Rank root causes → Suggest targeted fixes → Provide verification command.

**Output:** Ranked candidate table (High / Medium / Low confidence) + before/after code fix for each candidate.

---

### `/pr-describe` · Developer

> Generate a complete PR title and body from git history — optionally enriched with Jira ticket acceptance criteria.

**Argument:** optional Jira ticket key

```bash
/pr-describe              # git-only, no ticket
/pr-describe NG-1234      # enriched with Jira ACs
```

**Output format:** `feat(scope): NG-1234 Summary (≤70 chars)` title + Summary bullets + Why section + Changes table + Test plan checklist aligned to Jira ACs + Related ticket link.

_Reads: `git log main...HEAD`, `git diff --stat`, branch name, Jira MCP (if key provided)._

---

### `/generate` · Developer

> Generate production-ready code following Copilot Agent System standards — auto-routes to `@backend` (.NET) or `@frontend` (React) based on workspace.

**Argument:** describe what to generate

```
/generate CRUD for Machine entity
/generate MachineTable component with RSQL filter and export button
/generate UserPreferences service with full-stack (prompt will ask A/B/C)
```

**Backend generates:** DTO · AutoMapper Profile · Repository · Service · Controller (JWT auth) · DI registration · Constants class

**Frontend generates:** Types · TanStack Query hooks · Controller hook · Page · Table (PlatformMrt) · Dialog (FormDialog)

_If both backend + frontend detected: asks A (backend) / B (frontend) / C (both)._

---

### `/tests` · Developer

> Generate unit tests using Copilot Agent System standards — auto-routes to NUnit (`.cs`) or Vitest + RTL (`.ts/.tsx`).

**Argument:** leave blank for active file, or enter file path

```bash
/tests                                            # active file
/tests src/Services/UserService.cs                # NUnit + Moq + MockQueryable
/tests src/features/users/useUsersController.ts   # Vitest + RTL
```

**`.cs` output:** NUnit + Moq + MockQueryable — every public method, happy + error path, ≥95% coverage floor, no real I/O

**`.ts/.tsx` output:** Vitest + RTL — hooks, components, behavior assertions, ≥90% coverage floor

_After generation: runs test suite, reports coverage, flags gaps below floor._

---

### `/doc` · Developer

> Add XML doc comments (C#) or JSDoc (TypeScript) to all public/exported members — no logic changed.

**Argument:** leave blank for active file, or enter file path

```bash
/doc                                     # active file
/doc src/Services/OrderService.cs        # XML doc: summary, param, returns, exception
/doc src/hooks/useOrderController.ts     # JSDoc: @param, @returns, @example (if non-obvious)
```

_Never adds comments to private/internal members (C#) or non-exported functions (TS). Never adds TODOs. Never changes logic._

---

### `/optimize` · Developer · Tech Lead

> Analyze and fix performance issues — routes to `@reviewer --performance`. Fixes applied inline, no business logic touched.

**Argument:** leave blank for active file, or enter file path

```bash
/optimize                                        # active file
/optimize src/Services/ReportService.cs          # .NET performance
/optimize src/features/reports/ReportTable.tsx   # React performance
```

**Checks (.NET):** Missing `AsNoTracking`, N+1 queries, no pagination, `.Result`/`.Wait()`, missing indexes, `AutoMapper.Map` in loop, over-fetching

**Checks (React):** Missing `useMemo`/`useCallback`, re-renders, missing `staleTime`, large lists without virtualization, heavy imports not code-split

_SEC-1–24 violations flagged regardless of focus area._

---

## § 5 · Slash Commands — Tech Lead

### `/knowledge-init` · Developer · Tech Lead

> Build or refresh a living knowledge base for the current repo — creates per-domain `AGENTS.md` index files and `docs/{domain}.md` knowledge documents so any LLM can find domain knowledge without exhausting the context window.

**Argument:** optional domain folder, or flags

```bash
/knowledge-init                  # full scan — create all missing files
/knowledge-init Orders           # scope to one domain folder
/knowledge-init --update         # refresh only stale domains (reads drift log)
/knowledge-init --meta-only      # update project metadata in docs/INDEX.md only
```

**First run prompts (all optional):**

| Field | Example |
|-------|---------|
| Application name | `lis.inventory` |
| Value Stream | `Value Stream 3` |
| Confluence space URL | `https://confluence.example.com/display/NG` |
| Jira project key(s) | `NG, ELISE` |
| Jira Epic link(s) | `NG-100, NG-200` |

**What you get:**
- `{folder}/AGENTS.md` — 1-page memory-map index per domain (VS Code reads automatically)
- `docs/{domain}.md` — deep knowledge doc (bounded context, data model, business rules, flows, gotchas)
- `docs/INDEX.md` — master table across all domains with project metadata

**Update safety:** sections marked `<!-- manual -->` are never overwritten on `--update`.

_Companion hook: `knowledge-drift` runs at sessionEnd, detects changed source files, and flags stale domains in `.copilot/memories/repo/knowledge-drift.md` for the next `--update` run._

---

### `/update-copilot-instruction` · Tech Lead

> Maintain `instructions/` files — scan all 14 instruction files + all agents for duplicates, conflicts, and broken references; or update a specific section with diff preview.

**Mode A — scan (health check):**

```
/update-copilot-instruction --scan
```

Reads all instruction files + all agent files → produces deduplication report: duplicate rules, conflicting rules, broken cross-references, stale agent names / section numbers. **No writes in scan mode.**

**Mode B — targeted section update:**

```
/update-copilot-instruction GUARDRAILS-code.instructions.md §10
/update-copilot-instruction backend-patterns.instructions.md §3
```

Reads the target file → locates section → asks for new content → shows unified diff → writes **only after explicit confirmation**. Cross-references updated automatically.

**Use cases:** Monthly health check · updating security guardrails · adding new platform patterns · removing stale references

---

## § 6 · Slash Commands — Product Owner / BA

### `/story-draft` · Product Owner · BA

> Turn a plain-text idea into a full Jira user story with Gherkin acceptance criteria (G1–G11 compliant), T-shirt estimate, and Epic suggestion — confirm to create the ticket in Jira.

**Argument:** describe the feature in plain text

```
/story-draft managers want to export reports as PDF
/story-draft users need to filter the machine list by location and status
/story-draft allow operators to bulk-approve cutting orders
```

**Steps performed:**

1. Parse idea → derive Persona, Action, Outcome → format as _"As a [X], I want [Y], so that [Z]"_
2. Search Jira for related Epics (JQL: `project = NG AND issuetype = Epic AND text ~ "[terms]"`)
3. Draft 2–4 Gherkin ACs covering: happy path · permissions/roles · error path · data validation
4. Estimate T-shirt size (S/M/L/XL → 2/3/5/8 story points)
5. Present draft — **waits for confirmation**
6. Creates Jira Story (NG project) only after "yes" reply

**T-shirt size guide:**

| Size | Criteria | Points |
|------|----------|--------|
| **S** | 1–2 ACs · single layer · no DB migration | 2 |
| **M** | 2–3 ACs · 2 layers · possible migration | 3 |
| **L** | 4+ ACs · full-stack · migration required | 5 |
| **XL** | Cross-service · architecture change · multiple migrations | 8 |

---

### `/jira-read` · Product Owner · Developer

> Fetch any Jira ticket and display it as a clean, formatted card — no raw JSON, no noise.

**Argument:** Jira ticket key

```
/jira-read NG-1234
/jira-read NG-5678
```

**Output includes:** Issue type + status badge · Priority · Assignee / Reporter · Sprint · Epic · Labels · Description (plain text, ADF stripped) · Acceptance criteria (Gherkin or bullets) · Linked issues table · Last 3 comments

**Status badges:** 🔵 To Do · 🟡 In Progress · 🟢 Done · 🔴 Blocked · ⬜ Backlog

_MCP fallback: if Jira unreachable, paste ticket content manually and it will format it for you._

---

### `/gherkin-convert` · Developer · Product Owner · BA

> Convert any Jira ticket description to full Gherkin acceptance criteria (G1–G14 compliant) and write it back to Jira — skips tickets that are already in Gherkin format.

**Argument:** Jira ticket key

```
/gherkin-convert NG-1234
/gherkin-convert NG-5678
```

**Steps performed:**

1. Fetch ticket from Jira (type, summary, description, ACs)
2. **Gherkin detection** — if already Gherkin, stops without modifying the ticket
3. Detect ticket type and apply the matching conversion pattern
4. Convert to full Gherkin (G1–G14 rules from `skills/gherkin-format/SKILL.md`)
5. Preview in chat — **waits for confirmation before writing**
6. Write back to Jira as plain text (no `` ```gherkin `` fences per G11)
7. Report: type, Feature block count, Scenario count

**Smart detection:**

| Condition | Action |
|-----------|--------|
| All 3 markers present (`Feature:`, `Scenario:`, `Given/When/Then`) | ✅ Already Gherkin — stops, no changes made |
| Partial Gherkin (some markers, malformed) | ⚠️ Completes the missing parts |
| No Gherkin markers | ❌ Full conversion from scratch |

**Ticket type patterns:**

| Jira Type | Pattern | Min Scenarios | Feature Title Format |
|-----------|---------|--------------|---------------------|
| Story | AC-based (numbered ACs / checkboxes) | 2 per AC (happy + edge) | `[NG-# AC1] — desc` |
| Bug | STR-based (Current/Expected Behaviour, Steps to Reproduce) | 3 (bug + fix + edge) | `[NG-# BUG] — desc` |
| Task / Improvement | Checklist / description goals | 2 (success + failure) | `[NG-# TASK#] — desc` |
| Sub-task | Parent-aware scope | 2 (happy + edge) | `[NG-# SUB#] — desc (parent: PARENT-KEY)` |
| Sub-bug | Parent Bug + fix area | 3 (bug + fix + edge) | `[NG-# SUB-BUG] — desc (parent: PARENT-KEY)` |
| Epic | Decomposes to children — reports child keys only | — | Lists child keys to convert individually |
| Spike | Investigation outcomes | 2 (found + inconclusive) | `[NG-# SPIKE] — desc` |

**Bug write-back rule:** Original `Bug Description` + `Steps to Reproduce` are preserved at the top; Gherkin is appended below under `## Acceptance Criteria (Gherkin)`.

_Uses Jira MCP read+write. MCP fallback: paste ticket content manually and the command formats it — then copy the output back._

---

## § 7 · Slash Commands — Scrum Master / PM

### `/sprint-status` · Scrum Master · PM

> Instant sprint health snapshot — counts by status, blocked tickets, unassigned work, % done, and risk flags. Great for standup prep.

**Argument:** optional sprint name (leave blank for current open sprint)

```bash
/sprint-status                   # current open sprint
/sprint-status Sprint 41         # specific past sprint
```

**JQL used:** `project = NG AND sprint in openSprints() ORDER BY status ASC`

**Output:**

- Health indicator: 🟢 On track (≥50% done, 0 blocked) · 🟡 At risk (<50% OR 1–2 blocked) · 🔴 Off track (>3 blocked OR <25% done in last quarter)
- Status breakdown table (Done / In Progress / In Review / To Do) with story point counts
- Blocked tickets table with assignee and "blocked since" date
- Unassigned tickets table
- Top risks bullet list (stale In-Progress >3 days, >30% unassigned In-Progress)

---

### `/confluence-find` · PM · Developer · Tech Lead

> Quick Confluence knowledge search — returns top 5 results with Space › Category context and a plain-text excerpt.

**Argument:** search keywords

```
/confluence-find deployment guide
/confluence-find MRT table patterns
/confluence-find production incident runbook
/confluence-find EF Core migration naming
```

**Search strategy:** CQL search → fallback to `text ~ "[query]" AND label = "ai-consumable"` → top 5 ranked by relevance + recency

**Categories detected:** 📋 Engineering Standards · 🏗 ADR · 🔧 System Design · 🧪 Testing Standards · 🚀 DevOps · 📚 Domain Knowledge · 🔥 Runbook · 📄 General

_MCP fallback: if Confluence unreachable, direct search URL provided._

---

## § 8 · When to Use Slash Command vs Agent

| Situation | Use | Why |
|-----------|-----|-----|
| Understand a repo you just joined | `/explain-project` | One-shot, no orchestration needed |
| Understand a specific file before editing | `/explain-file path` | One-shot, scoped to file |
| Pre-commit quality gate | `/code-review-fix` | Fix-first, no iteration cap |
| Production error arrived in your inbox | `/bug-trace` | Immediate root-cause analysis |
| Open a pull request | `/pr-describe NG-xxxx` | git + Jira combined in seconds |
| Generate code to Copilot Agent System standards | `/generate` | Routes to correct builder automatically |
| Write tests for a file | `/tests` | Routes to NUnit or Vitest automatically |
| Add documentation comments | `/doc` | XML doc or JSDoc, no logic changed |
| Fix performance issues in a file | `/optimize` | Focused review + inline fixes |
| Quick Jira ticket lookup | `/jira-read NG-xxxx` | Formatted card, no raw JSON |
| Draft a user story from an idea | `/story-draft` | Gherkin ACs + estimate + Jira creation |
| Convert existing ticket to Gherkin ACs | `/gherkin-convert NG-xxxx` | Smart detection + write-back to Jira |
| Sprint health check | `/sprint-status` | Grouped status, blockers, risks |
| Find a Confluence page | `/confluence-find` | Top 5 results with excerpts |
| Build a full feature (frontend + backend) | `@orchestrator build …` | Multi-step orchestration + mandatory chains |
| Plan from a Jira ticket with Confluence context | `@docs-planner plan NG-xxxx` | Enriched plan with standards + ADRs |
| Write or update Confluence documentation | `@docs-writer` | Duplicate check + structured page creation |
| Scaffold a new microservice from scratch | `@orchestrator scaffold new …` | Routes to scaffold |

---

## § 9 · Agent — `@orchestrator` (Orchestrator)

> **This is the primary entry point for all feature work.** You never need to call builder or worker agents directly — the delivery engine handles delegation automatically.

| Property | Value |
|----------|-------|
| Role | Single entry-point orchestrator |
| Model | Claude Sonnet 4.6 (Copilot) — foreground, approval-gated |
| User-invocable | Yes — type `@orchestrator` |
| Workflow | Plan → Approve → Execute → Deliver |
| Guardrails | SEC-1–24, mandatory chains, 90%/95% coverage floors, workspace-strict routing |

### Invocation Patterns

```bash
# Plan from a Jira ticket (recommended path)
@orchestrator plan NG-36060

# Quick build — full-stack CRUD
@orchestrator build CRUD for UserPreferences with React UI

# Backend only
@orchestrator build CRUD for UserPreferences — backend only

# Frontend only
@orchestrator convert StorageAreas.tsx to Org platform patterns — frontend only

# Scaffold a brand-new microservice
@orchestrator scaffold new InventoryManagement microservice

# Skip steps (must be explicit)
@orchestrator build user preferences — skip tests
@orchestrator build user preferences — skip review

# Target specific repo in multi-repo workspace
@orchestrator build X in services/UserManagement
```

### What Happens Behind the Scenes

```
You say: "@orchestrator build user preferences CRUD with React UI"

@orchestrator
  ├── Phase 1: PLAN (internal — not shown)
  │     ├── @Explore → codebase research (parallel)
  │     ├── @jira-planner → ticket analysis (if ticket ID given)
  │     └── Presents plan + scope + risks → asks for approval
  │
  ├── Phase 2: APPROVE (hard gate — user MUST confirm before execution)
  │
  ├── Phase 3: EXECUTE
  │     ├── @backend → DTO · Service · Repo · Controller · Startup
  │     │     ├── @migration → auto-detects new entity → EF Core migration
  │     │     └── @backend-tests → NUnit tests (happy + error paths)
  │     ├── @frontend → React components · hooks · queries · types
  │     │     ├── @frontend-tests ─┐ run in PARALLEL
  │     │     └── @e2e-tests ┘
  │     └── @reviewer → 5-dimension review
  │           └── score > 5: auto-fix → re-review (max 3 iterations)
  │
  └── Phase 4: DELIVER → Cross-contract verification + Delivery Report
```

### Non-Goals (what it delegates, never does itself)

- Write production code → delegates to `@backend` / `@frontend`
- Write tests → delegates to `@backend-tests` / `@frontend-tests` / `@e2e-tests`
- Review code → delegates to `@reviewer`
- Create migrations → delegates to `@migration`

---

## § 10 · Agents — Planners

### `@jira-planner` · Developer · PO

> Convert a Jira ticket into Gherkin acceptance criteria, structured TODOs, and T-shirt estimates. Read-only — never writes code.

```
@jira-planner plan NG-36060
@jira-planner analyze NG-36060 and suggest subtasks
```

**Outputs:** User story line · Gherkin ACs (G1–G11) · Implementation TODOs (ordered) · T-shirt estimate · Risk flags · Suggested subtasks

_Uses Jira MCP read-only. Has `@Explore` for codebase research._

---

### `@docs-planner` · Developer · Tech Lead

> Enriches implementation plans with Confluence knowledge — searches standards, ADRs, and system design docs before planning.

```
@docs-planner plan NG-36060 with Confluence context
@docs-planner plan NG-36060 focus on security implications
```

**Outputs:** Enriched plan with citations from Confluence · Standards references · ADR context · Risk flags from existing docs

_Uses Jira MCP (read+write subset) + Confluence MCP (read+write subset)._

---

## § 11 · Agents — Builders & Reviewer

> **Builder agents (`@backend`, `@frontend`, `@scaffold`) are auto-delegated** by `@orchestrator`. They are not user-invocable — they won't appear when you type `@` in chat. The only builder you can call directly is `@reviewer`.

| Agent | Invoked By | Generates |
|-------|-----------|-----------|
| `@backend` _(auto-delegated)_ | `@orchestrator` | .NET 10 full layer: DTO → AutoMapper Profile → Repository (interface + impl) → Service (interface + impl) → Controller (JWT) → DI registration → Constants class. Auto-detects namespace from `.csproj`. Triggers migration + test chain. |
| `@frontend` _(auto-delegated)_ | `@orchestrator` | React 19 / MUI 7: Types (.types.ts) → TanStack Query hooks → Controller hook (useXxxController) → Page component → PlatformMrt table → FormDialog. Enforces: no useState/useEffect in pages, react-hook-form, data-testid on every interactive element, t('key') for all strings. |
| `@scaffold` _(auto-delegated)_ | `@orchestrator` | Scaffolds a complete .NET 10 microservice skeleton from scratch (Program.cs, DbContext, Startup, project files). Delegates entity CRUD to `@backend`. |
| `@reviewer` _(user-invocable)_ | `@orchestrator` (auto) or directly | **Multi-model panel review**: 4 specialist sub-reviewers (Security Auditor on GPT-5.5, Architecture Judge on Claude Opus 4.6, Quality Enforcer on Sonnet 4.5, Codex Code Agent on GPT-5.3-Codex) run in parallel, cross-examine each other's findings, then Coordinator on Sonnet 4.6 synthesizes and resolves conflicts. Scores 🔴=10, 🟠=5, 🟡=2, 🔵=1; passes at ≤ 5. Auto-fix loop max 3 iterations. |

### `@reviewer` — Direct Invocation

```bash
# Full 4-panelist panel review (Security Auditor + Architecture Judge + Quality Enforcer + Codex Code Agent)
@reviewer --full src/domain/user-preferences/

# Explicit panel alias
@reviewer --panel src/domain/user-preferences/

# Security Auditor only (GPT-5.5)
@reviewer --security src/Controllers/

# Architecture Judge + Coordinator (adversarial)
@reviewer --critique src/domain/user-preferences/

# Quality Enforcer only
@reviewer --coverage src/Services/ReportService.cs

# Single-pass quality review (faster — no panel)
@reviewer --quality src/Services/ReportService.cs
```

---

## § 12 · Agent — Knowledge

### `@docs-writer` · Tech Lead · PO · Developer

> Create or update structured Confluence documentation — standards pages, ADRs, system design docs. Checks for duplicates before creating. Full Confluence MCP access.

```
@docs-writer create Frontend Standards page in NG space
@docs-writer update ADR-007 with the new auth approach
@docs-writer create system design doc for InventoryManagement service
@docs-writer search and summarise all runbooks in NG space
```

**Workflow:**

1. Search Confluence for existing pages on the topic (prevents duplicates)
2. Preview content to user
3. Create page with proper labels (`engineering-standards`, `adr`, `system-design`, `ai-consumable`, etc.)
4. Reports page URL

**MCP tools used:** search · get_page · create_page · update_page · add_label · add_comment

---

## § 13 · Agents — Worker Agents

> These agents are part of mandatory quality chains and are **also directly invocable** by developers. All have `user-invocable: true` and `jira-azure/jira_get_issue` read access — you can call them directly with a file path or Jira ticket key. The orchestrator still delegates to them automatically in chains.

| Agent | Invoked By | What It Does |
|-------|-----------|--------------|
| `@backend-tests` | `@backend` chain or directly | NUnit + Moq + MockQueryable backend tests. Happy + error paths for every CRUD operation. ≥95% coverage floor. No real I/O, no DB connections. Can read Jira tickets for context. |
| `@frontend-tests` | `@frontend` chain or directly | Vitest + React Testing Library frontend tests. Hooks, components, behavior assertions. ≥90% coverage floor. `vi.mock()` for dependencies. Can read Jira tickets and check file errors. |
| `@e2e-tests` | `@frontend` chain or directly | Cypress E2E tests with strict Page Object Model (POM). No raw `cy.get()`. Proper setup/teardown. Can read Jira tickets and check file errors. |
| `@playwright-e2e` | `@frontend` chain or directly | E.D.I.T.H. — Playwright E2E tests with strict POM. Cross-browser (Chromium/Firefox/WebKit), `@axe-core/playwright` accessibility audits, `data-testid` selectors only. Auto-detects project setup. Can migrate from Cypress on request. |
| `@migration` | `@backend` chain or directly | EF Core migrations. Auto-detects when a new entity or schema change requires a migration. Idempotent, reversible Up/Down. Follows `ef-migration-patterns.instructions.md` templates. |

---

## § 14 · Mandatory Quality Chains

> **These chains are non-negotiable.** Every code generation triggers the appropriate chain automatically. The only way to skip a step is to say it explicitly (e.g. `— skip tests`), which is logged in the response.

### Backend Chain

```
@backend
      │
      ├── 1. Generate all layers: DTO → Mapping → Repo → Service → Controller → Startup
      ├── 2. dotnet build  ← must pass (0 errors, 0 warnings)
      ├── 3. @migration  ← auto-triggered if new entity or schema change detected
      ├── 4. @backend-tests  ← happy path + error paths for every CRUD operation
      └── 5. @reviewer --full  ← must score ≤ 5
              └── if score > 5: auto-fix → re-review (max 3 iterations → escalate to user)
```

### Frontend Chain

```
@frontend
      │
      ├── 1. Generate: Types · TanStack Query hooks · Controller hook · Page · Table · Dialog
      ├── 2. npm run build  ← 0 errors
      │   npm run lint   ← 0 errors
      ├── 3. PARALLEL:
      │     ├── @frontend-tests  ← ≥90% coverage (major features + branches)
      │     ├── @e2e-tests  ← strict POM, no raw cy.get()
      │     └── @playwright-e2e  ← E.D.I.T.H. — cross-browser POM, a11y audits
      └── 4. @reviewer --full  ← must score ≤ 5
              └── if score > 5: auto-fix → re-review (max 3 iterations → escalate to user)
```

### Full-Stack Chain

```
Backend chain (above) → Frontend chain (above) → Cross-contract verification
      │
      ├── API response shapes match frontend TypeScript types?
      ├── Query/mutation hook params align with controller endpoints?
      └── E2E tests exercise the full integration path?
```

### Post-Edit Quality Gate _(v1.5.0 — every file edit)_

| Project type | Auto-triggered sequence after every edit |
|-------------|------------------------------------------|
| Frontend | `prettier --write` → `eslint --fix` → `tsc --noEmit` → `npm run build` → `vitest run {file}` |
| Backend | `dotnet format` → `dotnet build` → `dotnet test --filter {ClassName}` |

> Pre-push hook enforcement has moved to CI. The local `hooks/install-hooks.sh` installer was removed; build / lint / typecheck failures are now blocked at the PR check stage rather than at `git push`.

---

## § 15 · Handoff Buttons

After agents complete work, clickable handoff buttons appear in the chat. Click to continue the workflow without typing a new prompt.

| Button | Appears After | Routes To | What It Does |
|--------|--------------|-----------|--------------|
| 🔍 Review All Code | `@orchestrator` | `@reviewer` | Full 5-dimension review of everything generated |
| 🧱 Scaffold New Service | `@orchestrator` | `@scaffold` | Scaffold new .NET 10 microservice skeleton |
| 📄 Export Plan | `@orchestrator` | File (untitled) | Exports plan to untitled file for offline editing |
| 🔍 Review Backend Code | `@backend` | `@reviewer` | Backend-focused 5-dimension review |
| 🧪 Generate Unit Tests | `@backend` | `@backend-tests` | NUnit tests for all backend layers generated above |
| 🗄️ Generate Migration | `@backend` | `@migration` | EF Core migration for the entity above |
| 🔍 Review Frontend Code | `@frontend` | `@reviewer` | Frontend-focused 5-dimension review |
| 🧪 Generate Unit Tests | `@frontend` | `@frontend-tests` | Vitest + RTL tests for all frontend code above |
| 🌲 Generate Cypress E2E Tests | `@frontend` | `@e2e-tests` | Cypress 13 POM E2E tests for the feature above |
| 🧱 Add CRUD Entity | `@scaffold` | `@backend` | Adds entity CRUD to the scaffolded service |
| 🔍 Review Scaffold | `@scaffold` | `@reviewer` | Reviews the generated service skeleton |
| 🧪 Generate Backend Tests | `@migration` | `@backend-tests` | NUnit tests for the entity whose migration was just created |
| 🔍 Review Migration | `@migration` | `@reviewer` | Reviews the EF Core migration for idempotency + completeness |
| 🔧 Fix Frontend Issues | `@reviewer` | `@frontend` | Routes findings to frontend builder for fixes |
| 🔧 Fix Backend Issues | `@reviewer` | `@backend` | Routes findings to backend builder for fixes |

---

## § 16 · Workflow Recipes A–I

### Recipe A — Build from Jira ticket ✅ Recommended

```
@orchestrator plan NG-36060
```
→ Reviews plan with scope, risks, delegation chain  
→ Approve → Implementation starts automatically (backend chain → frontend chain)

---

### Recipe B — Quick build (skip planning phase)

```
@orchestrator build CRUD for UserPreferences with React form
```
→ Skips explicit planning phase  
→ Goes directly to backend chain → frontend chain

---

### Recipe C — Backend only

```
@orchestrator build CRUD for UserPreferences entity — backend only
```
→ Routes to `@backend`  
→ Migration check → tests → review (no frontend)

---

### Recipe D — Frontend only

```
@orchestrator convert StorageAreas.tsx to Org platform patterns — frontend only
```
→ Routes to `@frontend`  
→ Unit tests + E2E (parallel) → review (no backend)

---

### Recipe E — Review existing code

```bash
@reviewer --full src/domain/user-preferences/
@reviewer --security src/Controllers/AuthController.cs
@reviewer --performance src/Services/ReportService.cs
```

---

### Recipe F — Parse and plan a Jira ticket (no code)

```
@jira-planner plan NG-36060
```
→ Gherkin ACs (G1–G11) · structured TODOs · T-shirt estimate  
→ No code generated — planning artifact only

---

### Recipe G — Enrich plan with Confluence knowledge

```
@docs-planner plan NG-36060 with Confluence context
```
→ Searches Confluence for standards, ADRs, system design  
→ Plan enriched with citations — then proceed to `@orchestrator`

---

### Recipe H — Write Confluence documentation

```
@docs-writer create Frontend Standards page in NG space
```
→ Duplicate check → content preview → page created with labels  
→ Reports page URL

---

### Recipe I — Scaffold a new microservice

```
@orchestrator scaffold new InventoryManagement microservice
```
→ Routes to `@scaffold`  
→ .NET 10 skeleton → delegate entity CRUD to `@backend`  
→ Migration + tests + review chain runs automatically

---

### PO / PM Workflow — Story to Delivery

```bash
# Step 1: Draft the story
/story-draft users need to filter machines by location and status
# → Review Gherkin ACs → reply "yes" → Jira story created (e.g. NG-37500)

# Step 2: Check sprint health before the sprint
/sprint-status
# → Blockers, unassigned, % done — in 5 seconds

# Step 3: Developer picks up the ticket
@orchestrator plan NG-37500
# → Developer reviews plan, approves, implementation starts

# Step 4: Pre-PR quality gate
/code-review-fix
# → All issues fixed, build verified

# Step 5: Write the PR description
/pr-describe NG-37500
# → Ready-to-paste title + body with AC checklist
```

---

## § 17 · Portable Agent Skills

Skills are reusable logic packages stored in `skills/`. They provide the same quality gates in VS Code, CLI, and cloud agents — the skill file travels with the repo.

| Skill | File | Purpose & What It Provides |
|-------|------|---------------------------|
| `knowledge-init` | `skills/knowledge-init/SKILL.md` | Builds a living knowledge base — per-domain `AGENTS.md` index files + `docs/{domain}.md` knowledge docs + `docs/INDEX.md` master index. Supports full scan, single-domain, and `--update` diff mode. Companion: `knowledge-drift` hook. |
| `mandatory-backend-chain` | `skills/mandatory-backend-chain/SKILL.md` | Backend chain (§ 14): build → migration → tests → review. Same gates as `@backend`. Used by any agent that builds backend code. |
| `mandatory-frontend-chain` | `skills/mandatory-frontend-chain/SKILL.md` | Frontend chain (§ 14): build → lint → parallel tests + E2E → review. Same gates as `@frontend`. |
| `mandatory-review-chain` | `skills/mandatory-review-chain/SKILL.md` | Review protocol: 5-dimension review + auto-fix loop (max 3 iterations) + escalation protocol. |
| `confluence-content-guide` | `skills/confluence-content-guide/SKILL.md` | Confluence page templates and labeling conventions. Used by `@docs-writer` and `@docs-planner`. |
| `namespace-detection` | `skills/namespace-detection/SKILL.md` | Auto-detect .NET service namespace from `.csproj` and source files. Used by `@backend`, `@backend-tests`, `@migration`, and `@scaffold`. |
| `gherkin-format` | `skills/gherkin-format/SKILL.md` | Complete Gherkin structure rules G1–G11 + worked examples for all ticket types (Story, Bug, Task, Sub-task, Spike, Epic, Improvement). Used by `@jira-planner` and `/story-draft`. |
| `product-flow-screenshots` | `skills/product-flow-screenshots/SKILL.md` | Generate or update `productFlowScreenshots.cy.ts` — publication-quality screenshot tour of every app screen. 10 rules (viewport enforcement, dual capture modes, network idle, graceful skip). Used by `/product-flow-screenshots` and `@e2e-tests`. |

---

## § 18 · MCP Servers — Jira & Confluence

MCP (Model Context Protocol) servers extend Copilot with external tool integrations. Configuration is **per-repo** in [`.vscode/mcp.json`](https://code.visualstudio.com/docs/copilot/customization/mcp-servers) — each consumer repo declares the MCP servers it needs (org-wide auto-loading from `.github-private/copilot/mcp.json` was removed).

### Jira MCP Server (`jira-azure`)

**Package:** `@myorg/ng-tool-jira-mcp` · **Used by:** `@jira-planner` (read+write) · `@orchestrator` (read-only)

| Tool | What It Does | Example |
|------|-------------|---------|
| `mcp_jira-azure_jira_get_issue` | Fetch a Jira ticket by ID | `NG-36060` |
| `mcp_jira-azure_jira_search_issues` | JQL search across Jira projects | `project = NG AND sprint in openSprints()` |
| `mcp_jira-azure_jira_create_issue` | Create new Jira tickets | Creates Story in NG project |
| `mcp_jira-azure_jira_update_issue` | Update existing tickets (fields, description) | Update ACs after review |
| `mcp_jira-azure_jira_add_comment` | Add comments to tickets | Post implementation notes |
| `mcp_jira-azure_jira_list_transitions` | List available status transitions | Get valid next statuses for NG-36060 |
| `mcp_jira-azure_jira_transition_issue` | Move ticket status | To Do → In Progress |
| `mcp_jira-azure_jira_import_checklist_template` | Import Definition of Done checklists | Add DoD to a Story |

### Confluence MCP Server (`confluence-azure`)

**Package:** `confluence-mcp` · **Used by:** `@docs-writer` (full) · `@docs-planner` (read+write) · `@orchestrator` (read-only)

| Tool | What It Does |
|------|-------------|
| `mcp_confluence-azure_confluence_search` | CQL search across Confluence spaces |
| `mcp_confluence-azure_confluence_get_page` | Read full page content |
| `mcp_confluence-azure_confluence_get_page_children` | Navigate page hierarchy |
| `mcp_confluence-azure_confluence_get_space` | Get space details and homepage |
| `mcp_confluence-azure_confluence_list_spaces` | Discover all available spaces |
| `mcp_confluence-azure_confluence_create_page` | Create new pages (Markdown input, auto-converts) |
| `mcp_confluence-azure_confluence_update_page` | Update existing pages (auto-versioning) |
| `mcp_confluence-azure_confluence_add_label` | Tag pages for discoverability (`ai-consumable`, `adr`, etc.) |
| `mcp_confluence-azure_confluence_add_comment` | Add review comments to pages |

> **Security:** Only `@docs-writer` (full access), `@docs-planner` (read+write subset), and `@orchestrator` (read-only) may use Confluence MCP tools. All other agents are blocked by GUARDRAILS § 11b.

---

## § 19 · Auto-Injected Instruction Files

Files in `instructions/` are automatically loaded by Copilot when editing matching files. Agents reference these instead of embedding the same content.

| File | Auto-Applied To | Content |
|------|----------------|---------|
| `GUARDRAILS-core.instructions.md` | `**` (all files) | § 1 Principles · § 2 Response Format · § 3 Output Contract · § 6 Do/Don't · § 8 Decision Log · § 9 Hallucination checklist |
| `GUARDRAILS-code.instructions.md` | `**/*.{cs,ts,tsx}` | § 4 Quality Gates · § 5 Migration Safety · § 10 Security (SEC-1–SEC-24) · § 13 Structured Logging Standard · § 14 Accessibility (ACC-1–8) |
| `GUARDRAILS-orchestration.instructions.md` | `agents/**` | § 7 Domain rules · § 11 Jira MCP · § 11b Confluence MCP · § 12 Mandatory Chains · § 12n Pre-Push Gate · § 12o Performance Targets · § 12p Concurrency Limits |
| `backend-patterns.instructions.md` | `*.cs`, `Controllers/**`, `Services/**` | .NET architecture, async patterns (`ConfigureAwait(false)`), error handling, `BaseResponse<T>` |
| `testing-standards.instructions.md` | `*.test.ts`, `*.spec.ts`, `*.cy.ts`, `*Test.cs` | Forbidden anti-patterns, correct test patterns, coverage floors |
| `auth-patterns.instructions.md` | `Controllers/**`, `Startup.cs`, `*Auth*` | Authentication, authorization, user info extraction from JWT |
| `filters.instructions.md` | `*Filter*`, `*RSQL*` | FiltersPanel, RSQL query building patterns |
| `cypress-patterns.instructions.md` | `cypress/**`, `*.cy.ts` | POM templates, API mocking, test cleanup, strict selectors |
| `platform-mui.instructions.md` | `src/**/*` | PlatformMrt, FormDialog, theme spacing conventions |
| `platform-common.instructions.md` | `src/**/*` | Auth, i18n (`t('key')`), RSQL, shared utilities |
| `platform-dev.instructions.md` | `src/**/*` | Dev tooling, build config, linting rules |
| `ef-migration-patterns.instructions.md` | `Migrations/**`, `*DbContext*` | EF Core migration templates, naming conventions, audit trail |

> **Token efficiency:** GUARDRAILS split into 3 focused files achieves ~75% token reduction vs the original monolith. Agents load only the guardrails relevant to their scope.

---

## § 20 · Quality Thresholds Reference

| Threshold | Default | Purpose | How to Override |
|-----------|---------|---------|----------------|
| `REVIEW_PASS_THRESHOLD` | **5** | Review score must be ≤ this to pass chain | Add to project's `copilot-instructions.md`: |
| `FRONTEND_COVERAGE_MIN` | **90%** | Minimum Vitest/RTL coverage (major features + branches) | `## Quality Overrides` |
| `BACKEND_COVERAGE_MIN` | **95%** | Minimum NUnit CRUD path coverage (persona-centric) | `- REVIEW_PASS_THRESHOLD: 8` |
| `MAX_REVIEW_ITERATIONS` | **3** | Auto-fix loop limit before escalating to user | `- CYPRESS_MANDATORY: false` |
| `CYPRESS_MANDATORY` | **true** | Whether E2E tests are auto-generated in frontend chain | |
| `MIGRATION_AUTO_DETECT` | **true** | Whether migrations are auto-checked after backend build | |

---

## § 21 · MCP Environment Setup

### Required Environment Variables

| Variable | Used For | Where to Set |
|----------|---------|--------------|
| `JIRA_MCP_API_KEY` | Shared API key for the Jira MCP server (`X-Api-Key` header) | `~/.zshrc` |
| `JIRA_PAT` | Your personal Jira PAT — operations run as your identity | `~/.zshrc` |
| `CONFLUENCE_MCP_API_KEY` | Shared API key for the Confluence MCP server | `~/.zshrc` |
| `CONFLUENCE_PAT` | Your personal Confluence PAT | `~/.zshrc` |
| `JIRA_BASE_URL` | Jira instance URL (e.g. `https://myorg.atlassian.net`) | `~/.zshrc` or `.env` |
| `JIRA_EMAIL` | Your Jira/Atlassian account email | `~/.zshrc` or `.env` |
| `JIRA_API_TOKEN` | Jira API token (create at id.atlassian.com) | `~/.zshrc` — never in repo |
| `CONFLUENCE_BASE_URL` | Confluence URL (e.g. `https://myorg.atlassian.net/wiki`) | `~/.zshrc` or `.env` |
| `CONFLUENCE_API_TOKEN` | Confluence API token (same Atlassian token works) | `~/.zshrc` — never in repo |

### Setup — add to `~/.zshrc`

```bash
# MCP server headers — required for Copilot agent MCP integration
export JIRA_MCP_API_KEY="your-jira-mcp-api-key"
export JIRA_PAT="your-jira-pat"
export CONFLUENCE_MCP_API_KEY="your-confluence-mcp-api-key"
export CONFLUENCE_PAT="your-confluence-pat"

# Atlassian REST API — required for fallback and scripts
export JIRA_BASE_URL="https://myorg.atlassian.net"
export JIRA_EMAIL="your.name@myorg.com"
export JIRA_API_TOKEN="your-jira-api-token"
export CONFLUENCE_BASE_URL="https://myorg.atlassian.net/wiki"
export CONFLUENCE_API_TOKEN="your-confluence-api-token"
```

### Verification

```bash
# 1. Check Jira MCP server starts
npx -y @myorg/ng-tool-jira-mcp --health

# 2. Verify env vars are set
echo "JIRA_BASE_URL: ${JIRA_BASE_URL:-(not set)}"
echo "JIRA_API_TOKEN: ${JIRA_API_TOKEN:+(set)}"
echo "CONFLUENCE_BASE_URL: ${CONFLUENCE_BASE_URL:-(not set)}"
echo "CONFLUENCE_API_TOKEN: ${CONFLUENCE_API_TOKEN:+(set)}"

# 3. Test Jira connectivity
curl -s -u "${JIRA_EMAIL}:${JIRA_API_TOKEN}" \
  "${JIRA_BASE_URL}/rest/api/3/myself" | jq '.displayName'

# 4. Test via Copilot Chat
# In chat: @jira-planner plan NG-36060
```

### Per-Repo MCP Configuration

Each consumer repo declares its MCP servers in `.vscode/mcp.json`:

```jsonc
// repo/.vscode/mcp.json
{
  "servers": {
    "jira-azure": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@myorg/ng-tool-jira-mcp"],
      "env": { "JIRA_PAT": "${env:JIRA_PAT}", "JIRA_BASE_URL": "${env:JIRA_BASE_URL}" }
    },
    "custom-api": {
      "type": "sse",
      "url": "https://custom-api.internal.myorg.com/mcp",
      "headers": { "Authorization": "Bearer ${env:CUSTOM_API_TOKEN}" }
    }
  }
}
```

---

## § 22 · Troubleshooting Guide

| Problem | Solution |
|---------|---------|
| Slash command not appearing in `/` picker | Restart VS Code. Check that `prompts/` exists and has `.prompt.md` files. Confirm Copilot extension is version ≥ 1.250. |
| Worker agent not appearing when I type `@` | Worker agents (`@backend-tests`, `@frontend-tests`, `@e2e-tests`, `@migration`) and builder agents (`@backend`, `@frontend`, `@scaffold`) are set to `user-invocable: true` for VS Code indexing but are designed to be invoked by `@orchestrator`. Use `@orchestrator` as your entry point. |
| Agent says "I can't access that tool" | Check `tools:` in the agent's frontmatter. Each agent has a restricted tool list. Workers have the most limited access. |
| Tests not being generated after backend build | Verify "MANDATORY CHAIN" appears in agent output. If tests were skipped explicitly, the agent logs the override. Run `@reviewer --full` to confirm no tests exist. |
| Review loop won't pass (stuck after 3 iterations) | After 3 iterations the agent escalates to you. Fix the architectural issue manually, then run `@reviewer --security` for a focused follow-up pass. |
| Agent invents file paths or APIs that don't exist | All agents follow § 1 P1 (search before referencing). If it happens, this is a guardrail violation — report to the Tech Lead and run `/update-copilot-instruction --scan`. |
| Context lost mid-session | Check `/memories/session/chain-state.md` — the orchestrator checkpoints progress and resumes from the last completed step. Re-invoke `@orchestrator` with "resume". |
| Wrong repo targeted in multi-repo workspace | Specify explicitly: `@orchestrator build X in services/UserManagement`. The orchestrator presents a repo picker if it detects ambiguity. |
| MCP server not detected / "Server failed to start" | Restart VS Code. Verify your MCP config (see § 18) is valid JSON. Check `npx` is available (`which npx`). Check corporate VPN is connected. |
| Jira / Confluence authentication errors | Verify all env vars in § 21 are set: `echo $JIRA_PAT`. Check token has not expired at `id.atlassian.com/manage-profile/security/api-tokens`. |
| Jira API rate limiting (tools slow / failing) | Jira Cloud allows ~100 requests/min. Reduce concurrent agent calls. Avoid running `@orchestrator` and `@docs-planner` simultaneously. |
| `/code-review-fix` left TODOs instead of fixing | This command is fix-first with no iteration cap — it should not leave TODOs. If it does, the issue requires a DB migration or business decision. Check the "Manual action required" section in the output. |
| Python / unsupported language detected in workspace | `@orchestrator` has a hard stop for non-.NET/non-React repos. It will decline to generate code and explain the language detection result. This is by design. |
| Pre-push hook blocking push | Run `dotnet build` / `npm run lint` / `tsc --noEmit` manually to see the error. Fix the issue — do not bypass the hook with `--no-verify` unless you have explicit Tech Lead approval. |

---

## § 23 · Gherkin Rules G1–G11

Used by `/story-draft` and `@jira-planner` — full spec in [`skills/gherkin-format/SKILL.md`](skills/gherkin-format/SKILL.md).

| # | Rule | Detail |
|---|------|--------|
| **G1** | Feature per AC | Stories: each AC gets its own `Feature:` block. Bugs/Tasks/Spikes: one Feature per ticket. Epics: one for epic-level + one per child. |
| **G2** | User story line | Every Feature MUST include `As a / I want / So that` lines. For Tasks/Spikes use developer role if no user role exists. |
| **G3** | Minimum scenarios | Stories: min 2 (happy + edge). Bugs: min 3 (bug + fix + edge). Tasks: min 2 (success + failure). Spikes: min 2 (found + inconclusive). Epics: min 2 (all complete + partial). |
| **G4** | Named scenarios | Every `Scenario:` MUST have a descriptive name — never blank or generic ("happy path" alone is not acceptable). |
| **G5** | And / But steps | Use `And` for additional preconditions/assertions. Use `But` for negative assertions within a scenario. |
| **G6** | Background | Use `Background:` when multiple scenarios share the same preconditions — avoid duplicating Given steps. |
| **G7** | Scenario Outline | Use `Scenario Outline:` with `Examples:` table when the same flow is tested with different data values. |
| **G8** | Concrete values | Use specific, realistic test data — not vague placeholders. Write `"2.5.18"` not `"latest version"`. |
| **G9** | Traceability | Feature title format: Story `[NG-##### AC#]` · Bug `[NG-##### BUG]` · Task `[NG-##### TASK#]` · Sub-task `[NG-##### SUB#]` · Epic `[NG-##### EPIC]` · Spike `[NG-##### SPIKE]` |
| **G10** | No invented ACs | Only create scenarios from what exists in the ticket. Edge cases are allowed — invented business rules are not. |
| **G11** | No `gherkin` tag in Jira | When writing Gherkin to a Jira ticket, use plain text or a code block with NO language identifier. Jira ADF does not support the `gherkin` language tag — it throws a formatter error. |

### Gherkin Structure Quick-Reference

```gherkin
Feature: [NG-##### AC1] — Short feature description
  As a [role]
  I want [goal]
  So that [business value]

  Background:                          # optional — shared preconditions
    Given [common precondition]

  Scenario: Happy path — descriptive name
    Given [specific precondition]
      And [additional precondition]
    When [user action]
    Then [expected outcome]
      And [additional assertion]
      But [negative assertion]

  Scenario: Error path — descriptive name
    Given [different precondition]
    When [triggering action]
    Then [expected error handling]

  Scenario Outline: Data variation — descriptive name
    Given [precondition with <variable>]
    When [action with <variable>]
    Then [outcome with <expected>]

    Examples:
      | variable   | expected   |
      | value_1    | result_1   |
      | value_2    | result_2   |
```

---

## § 24 · All Agents & Commands Summary

### All 12 Agents

| Category | Agent | User-Invocable | Invoke With |
|----------|-------|---------------|-------------|
| **Orchestrator** | `@orchestrator` | ✅ Yes | `@orchestrator <request>` or `@orchestrator plan NG-xxxxx` |
| **Planners** | `@jira-planner` | ✅ Yes | `@jira-planner plan NG-xxxxx` |
| | `@docs-planner` | ✅ Yes | `@docs-planner plan NG-xxxxx with Confluence context` |
| **Builders** | `@backend` | ❌ Auto-delegated | Via `@orchestrator` or `/generate` |
| | `@frontend` | ❌ Auto-delegated | Via `@orchestrator` or `/generate` |
| | `@scaffold` | ❌ Auto-delegated | Via `@orchestrator scaffold new …` |
| | `@reviewer` | ✅ Yes | `@reviewer --full src/` or via handoff button |
| **Knowledge** | `@docs-writer` | ✅ Yes | `@docs-writer create … page in NG space` |
| **Workers** | `@backend-tests` | ✅ Yes | Auto-invoked by `@backend` chain — or call directly for targeted tests |
| | `@frontend-tests` | ✅ Yes | Auto-invoked by `@frontend` chain — or call directly with a file/Jira ticket |
| | `@e2e-tests` | ✅ Yes | Auto-invoked by `@frontend` chain — or call directly with a file/Jira ticket |
| | `@migration` | ✅ Yes | Auto-invoked by `@backend` chain — or call directly for schema changes |

### All 16 Slash Commands

| Command | Argument | Primary Roles | Routes To |
|---------|----------|--------------|-----------|
| `/knowledge-init` | optional domain / `--update` / `--meta-only` | Dev · Lead | `knowledge-init` skill — AGENTS.md + docs/ |
| `/explain-project` | — | Dev · Lead · PO | Codebase scan (terminal) |
| `/explain-file` | file path | Dev | Codebase scan (terminal) |
| `/code-review-fix` | optional path | Dev · Lead | Fix-first inline review |
| `/bug-trace` | stack trace | Dev | Root-cause analysis |
| `/pr-describe` | optional NG-xxxx | Dev | git + Jira MCP |
| `/generate` | description | Dev | `@backend` or `@frontend` |
| `/tests` | optional path | Dev | `@backend-tests` (.cs) or `@frontend-tests` (.ts/.tsx) |
| `/doc` | optional path | Dev | XML doc / JSDoc inline edit |
| `/optimize` | optional path | Dev · Lead | `@reviewer --performance` |
| `/update-copilot-instruction` | `--scan` or `file §n` | Tech Lead | Instruction file maintenance |
| `/story-draft` | feature description | PO · BA | Jira MCP create (after confirm) |
| `/gherkin-convert` | NG-xxxx | Dev · PO · BA | Jira MCP read+write (convert + write back) |
| `/jira-read` | NG-xxxx | PO · Dev | Jira MCP read |
| `/sprint-status` | optional sprint name | SM · PM | Jira MCP search (JQL) |
| `/confluence-find` | keywords | All | Confluence MCP search (CQL) |

---

## § 25 · Changelog

### v3.3.0 — May 2026

**New: `harness-creator` skill + Long Build mode + Playwright QA evaluator**

- **New skill** `skills/harness-creator/SKILL.md` — validates and scaffolds the five harness subsystems (Instructions, State, Verification, Scope, Lifecycle) for any project repository. Scores each and creates missing files (`AGENTS.md`, `progress.md`, `session-handoff.md`, `discovered-gotchas.md`) from templates calibrated for the .NET 10 + React stack
- **New: Long Build mode** in `@orchestrator` — autonomous multi-sprint builds inspired by Anthropic’s Planner → Generator → Evaluator harness. Features: sprint contract negotiation, `maxSprints: 8` guardrail, cost/sprint warnings, `🏗️ Long Build` handoff button
- **New: QA evaluator mode** in `@reviewer` (`--qa-mode`) — Playwright MCP click-through of a running app against sprint contract criteria; returns structured QA contract with per-criterion PASS/FAIL findings; anti-leniency calibration rules prevent premature approvals
- **New: Session handoff artifact** — `hooks/session-logger` now writes `.copilot/memories/repo/session-handoff.md` at every session end; provides structured context-reset document (completed work, next steps, open bugs, key decisions, gotchas) for the next agent session
- **New templates** in `hooks/session-logger/templates/` — `session-handoff.md` and `progress.md` for sprint feature tracking
- Skill count: 27 → 28
- Updated `@orchestrator` classify table, execution chains, memory contract

---

### v3.2.0 — May 2026

**New: `knowledge-init` skill + `knowledge-drift` hook — living knowledge base**

- **New skill** `skills/knowledge-init/SKILL.md` — 8-step workflow to build a domain-by-domain knowledge base for any repo. App/repo level — not tied to .NET or React. Produces:
  - `{folder}/AGENTS.md` per domain folder (VS Code reads automatically — memory map for LLMs)
  - `docs/{domain}.md` per domain (bounded context, data model, business rules, flows, gotchas)
  - `docs/INDEX.md` master index with optional Jira/Confluence/Value Stream metadata
- **New hook** `hooks/knowledge-drift/` — `sessionEnd` hook that detects changed source files, maps them to domain folders, and flags stale AGENTS.md via `.copilot/memories/repo/knowledge-drift.md`
- **New slash command** `/knowledge-init` — invokes the skill with `full | [domain] | --update | --meta-only` modes
- **Update-safe** — `<!-- manual -->` sections are never overwritten on `--update`
- **Optional project metadata** — Value Stream, Confluence URL, Jira project keys + epics stored in `docs/INDEX.md` header block
- Updated § 1 repo structure, § 4 slash commands, § 17 skills table, § 24 commands summary

---

### v1.7.0 — May 2026

**Agent optimization: model tiering + multi-model panel reviewer + tool gaps + handoffs**

- **Multi-model panel review** (`@reviewer`): replaced single-pass review with a 4-specialist panel:
  - Security Auditor (GPT-5.5) · Architecture Judge (Claude Opus 4.6) · Quality Enforcer (Sonnet 4.5) · Codex Code Agent (GPT-5.3-Codex)
  - Specialists run in parallel, then cross-examine each other's findings (CONFIRM / ESCALATE / DISPUTE / ADD)
  - Coordinator (Sonnet 4.6) synthesizes, applies tiebreaker rules, resolves conflicts, issues final verdict
  - New `--panel` flag as explicit alias for `--full`; `--security` and `--coverage` now use focused single specialist
  - JSON contract updated: `panelVerdict` field added with per-model findings count and tiebreaker log
- **Model tiering**: 5 worker/templating agents downgraded from Sonnet 4.6 → **Sonnet 4.5**: `@backend-tests`, `@frontend-tests`, `@e2e-tests`, `@migration`, `@docs-writer`
- **Tool gap fixed** — `@backend-tests`: added `vscode/runCommand` to run `dotnet test`
- **Tool gap fixed** — `@docs-writer`: added `agent` tool for sub-agent delegation
- **New handoff buttons** — `@migration`: `🧪 Generate Backend Tests` + `🔍 Review Migration`; full button enumeration in § 15
- **Skill refs added** — `@migration` + `@scaffold`: `namespace-detection`; `@e2e-tests`: `product-flow-screenshots`

### v1.6.1 — April 2026

- Added `/product-flow-screenshots` slash command — generate or update Cypress screenshot tour for any product
- Added `skills/product-flow-screenshots/SKILL.md` — 10-rule screenshot skill (viewport enforcement, dual capture modes, network idle, graceful skip)
- Consistent filename `productFlowScreenshots.cy.ts` across all repos

### v1.6.0 — April 2026

- Promoted 4 agent-backed slash commands (`/generate`, `/tests`, `/doc`, `/optimize`) to full documentation
- Added `@orchestrator` language guard (hard stop for Python/non-NG workspaces)
- Added Post-Edit Quality Gate (every file edit triggers format → lint → build → targeted-test)
- Added Unplanned-Edit Test-File Check
- Added Handoff Buttons reference (§ 15)
- Added complete Troubleshooting Guide (§ 22) and Gherkin Rules (§ 23)
- Expanded MCP documentation with full tool tables and repo-level override guide

### v1.5.0 — 2026-04-20

**New: Agent-backed slash commands**  
Four new prompt files replace the built-in VS Code Copilot commands with Copilot Agent System–compliant versions:

| Prompt file | Replaces | Routes to |
|---|---|---|
| `tests.prompt.md` | `/tests` | `@backend-tests` (.cs) · `@frontend-tests` (.ts/.tsx) |
| `doc.prompt.md` | `/doc` | GUARDRAILS § O5 (XML doc / JSDoc) |
| `generate.prompt.md` | `/generate` | `@backend` · `@frontend` |
| `optimize.prompt.md` | `/optimize` | `@reviewer --performance` |

**Fixed:** `@orchestrator` Python/unsupported-language guard — hard stop if workspace is non-.NET/non-React.

**New:** Post-Edit Quality Gate — every file edit triggers format → lint → build → targeted-test.

**New:** Unplanned-Edit Test-File Check — engine verifies test counterpart still compiles after unplanned edits.

### v1.4.0 — 2026-04-16

- Added `@jira-planner` agent with Gherkin-format ACs (G1–G11)
- Added `skills/gherkin-format/SKILL.md` portable skill
- Added § 15 AI Incident Register (ISO 42001 Clause 10.1) to GUARDRAILS-orchestration
- Added § 16 Session Memory Retention Policy
- Added chain performance targets (§ 12o) and concurrency limits (§ 12p)
- Added pre-push quality gate and git hook installer (`hooks/install-hooks.sh`)
- GUARDRAILS split into 3 focused files for ~75% token reduction

### v1.3.0 — 2026-03-15

- Added `@docs-writer` and `@docs-planner` agents
- Added Confluence MCP security guardrails (§ 11b, C1–C8)
- Added `skills/confluence-content-guide/SKILL.md`
- Added bias & fairness checklist (§ 9b, ISO 42001 A.9.3)

### v1.2.0 — 2026-02-10

- Added `@orchestrator` orchestrator with Plan → Approve → Execute → Deliver workflow
- Added mandatory quality chains (§ 12a–12c) — tests and review are non-negotiable
- Added `@scaffold` for greenfield .NET 10 microservice skeleton
- Added `skills/mandatory-frontend-chain`, `mandatory-backend-chain`, `mandatory-review-chain`

### v1.1.0 — 2026-01-20

- Initial agent system: `@backend`, `@frontend`, `@reviewer`
- Worker agents: `@backend-tests`, `@frontend-tests`, `@e2e-tests`, `@migration`
- GUARDRAILS monolith (SEC-1–SEC-24, § 1–12)
- MCP server configuration for Jira and Confluence
