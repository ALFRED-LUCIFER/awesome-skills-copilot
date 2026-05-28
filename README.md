# 🤖 Awesome Skills Copilot

A production-ready collection of **15 AI agents**, **28 skills**, **5 hooks**, **3 plugins**, and **15 prompt templates** for GitHub Copilot and Claude Code.

> **Works with**: GitHub Copilot (VS Code) · Claude Code · Any AI assistant that reads `.agent.md` / `SKILL.md` files

---

## Why This Architecture Matters

This repo implements the **harness design patterns** documented by Anthropic's engineering team — the same patterns behind Claude Code, Managed Agents, and their most successful long-running coding experiments. Here's why that matters for you.

### The Problem: Naive AI Coding Falls Short

Anthropic's research ([Harness Design for Long-Running Apps](https://www.anthropic.com/engineering/harness-design-long-running-apps)) identified two fundamental failure modes when AI agents work on real tasks:

1. **Context collapse** — As context windows fill up, models lose coherence, start repeating themselves, or wrap up prematurely ("context anxiety"). A single-agent approach can't sustain quality across complex tasks.
2. **Self-evaluation blindness** — When asked to judge their own work, agents consistently rate it highly — even when the output is mediocre. Without external review, quality degrades silently.

Their [postmortem on Claude Code quality](https://www.anthropic.com/engineering/april-23-postmortem) showed how even small harness mistakes (reasoning dropped, effort levels misconfigured, prompt changes untested) cascade into user-visible degradation across entire products.

### The Solution: Harness Design

A **harness** is the scaffolding around the AI model that decomposes work, manages context, enforces quality, and orchestrates multiple specialized agents. This repo is a complete harness system.

#### How This Repo Maps to Anthropic's Architecture

| Anthropic's Pattern | This Repo's Implementation | Why It Works |
|---|---|---|
| **Planner → Generator → Evaluator** (3-agent architecture) | `@orchestrator` → `@backend`/`@frontend` → `@reviewer` | Separates planning from coding from review. The reviewer catches issues the generator misses — exactly like Anthropic's QA agent catching 27 bugs per sprint. |
| **Mandatory quality chains** (build → test → review) | `@backend → @migration → @backend-tests → @reviewer` | Every code generation automatically triggers tests and review. You never skip quality gates — the harness enforces them. |
| **Separated evaluator with tuned criteria** | `@reviewer` with 7 dimensions (Security, Performance, Readability, Tests, Architecture, Accessibility, Duplication) + scoring thresholds | Anthropic found that tuning a standalone evaluator to be skeptical is "far more tractable than making a generator critical of its own work." Our reviewer scores on concrete criteria, not vibes. |
| **Context resets with structured handoffs** | Agent handoff buttons + `memories/org/` shared knowledge | Each agent gets a clean context window with only what it needs. No context anxiety, no token bloat. The `session-logger` hook preserves state across sessions. |
| **Skills as reusable knowledge** | 28 SKILL.md files loaded on-demand | Instead of stuffing everything into one prompt, skills are loaded only when relevant — keeping context focused and cost-optimized. |

#### Managed Agents: Brain-Hands Separation

Anthropic's [Managed Agents](https://www.anthropic.com/engineering/managed-agents) architecture teaches a critical lesson: **decouple the brain (reasoning) from the hands (execution)**. In their system:

- The **brain** (harness + Claude) makes decisions
- The **hands** (sandboxes, tools) execute actions
- The **session** (event log) persists state durably

This repo follows the same separation:

| Component | Brain (reasoning) | Hands (execution) | Session (state) |
|---|---|---|---|
| **This repo** | Agent `.agent.md` files with instructions + skills | Terminal commands, file edits, MCP tools | `memories/org/`, session-logger hook, knowledge-drift detection |
| **Benefit** | Swap models freely (Sonnet ↔ Opus ↔ GPT) | Works with any codebase, any stack | Survives context resets, session crashes |

### Benefits for Individual Developers

- **You don't skip tests** — The harness won't let you. Every `@backend` call triggers `@backend-tests` + `@reviewer` automatically. Anthropic proved this catches bugs that the generator misses 100% of the time.
- **Cost-optimized** — Skills load on-demand instead of bloating every prompt. Agents use Sonnet 4.5 (cheaper) for mechanical tasks like tests, and Sonnet 4.6 (smarter) only for complex tasks like planning and review.
- **Context-safe** — Each agent gets a clean context window. No "context anxiety" degradation on long tasks. The `knowledge-drift` hook catches when your domain docs go stale.
- **You get a code reviewer that actually finds bugs** — Anthropic's research showed AI self-review is unreliable. Our separated `@reviewer` agent with concrete scoring criteria and auto-fix loops catches real issues.

### Benefits for Organizations

- **Consistent quality floor** — Every developer on the team hits the same quality gates: 95% backend coverage, 90% frontend coverage, review score ≤ 5 to pass. No more "it works on my machine."
- **Institutional knowledge persists** — `memories/org/` stores conventions, anti-patterns, and architecture decisions. New team members get the same context as veterans. The `knowledge-init` skill builds living documentation that stays current.
- **Auditable AI usage** — The `governance-audit` hook logs every session. The `secrets-scanner` hook prevents credential leaks. The `tool-guardian` hook enforces tool usage policies.
- **Model-agnostic** — When the next model drops, swap the `model` field in frontmatter. The harness design (chains, skills, hooks) stays stable. As Anthropic says: *"every component in a harness encodes an assumption about what the model can't do on its own, and those assumptions are worth stress testing."*
- **Shareable across teams** — Clone this repo, symlink agents/ and skills/ into any project. One harness serves your entire organization — exactly how Anthropic designed their `.github-private` enterprise pattern.

### Lessons from Anthropic's Postmortem

The [April 2026 Claude Code postmortem](https://www.anthropic.com/engineering/april-23-postmortem) revealed three bugs that degraded quality for weeks:

1. Default reasoning effort silently reduced
2. A caching bug dropped reasoning history every turn
3. A verbosity prompt hurt intelligence

**This repo has built-in defenses against all three:**

| Postmortem Issue | Our Defense |
|---|---|
| Reasoning effort misconfigured | Each agent explicitly sets its `model` in frontmatter — no silent defaults |
| Reasoning history dropped | Agent handoffs carry structured context; `session-logger` hook preserves full history |
| Prompt changes degrade quality | Skills are versioned, validated (`npm run validate`), and isolated — changing one skill can't cascade |

---

## What's in this repo

| | Type | Count | Description |
|---|---|---|---|
| 🤖 | [Agents](#agents) | 15 | Specialized Copilot agents with MCP integration |
| 🎯 | [Skills](#skills) | 28 | Self-contained folders with instructions and assets |
| 🪝 | [Hooks](#hooks) | 5 | Automated actions during agent sessions |
| 🔌 | [Plugins](#plugins) | 3 | Installable bundles for specific workflows |
| 📋 | [Instructions](#instructions) | 4 | Coding standards auto-injected by file pattern |
| ⚡ | [Prompts](#prompts) | 15 | Reusable prompt templates |

---

## Quick Start

```bash
# 1. Clone
git clone https://github.com/YOUR-ORG/awesome-skills-copilot.git
cd awesome-skills-copilot

# 2. Validate
npm install && npm run validate

# 3. Symlink into your workspace (or copy agents/ and skills/ folders)
ln -s $(pwd)/agents .github/agents
ln -s $(pwd)/skills .github/skills
```

### Usage

```
# Plan and build a feature (orchestrator delegates automatically)
@orchestrator build user preferences CRUD with React UI

# Backend only
@backend create Order entity with CRUD operations

# Frontend only
@frontend create OrderPage with table, dialog, and hooks

# Review code
@reviewer review staged changes --full

# Plan a feature
@planner plan user authentication flow
```

---

## Agents

| Agent | Purpose | Model |
|-------|---------|-------|
| `@orchestrator` | Single entry-point — plan → approve → execute | Sonnet 4.6 |
| `@planner` | Read-only planning with Gherkin ACs, estimates, risks | Sonnet 4.6 |
| `@jira-planner` | Jira read+write — Gherkin conversion, DoD checklists | Sonnet 4.6 |
| `@docs-planner` | Jira + Confluence bridge planner | Sonnet 4.6 |
| `@backend` | .NET CRUD code generator (DTO → Controller → Startup) | Sonnet 4.6 |
| `@frontend` | React 19 + TypeScript + MUI 7 builder | Sonnet 4.6 |
| `@scaffold` | .NET microservice skeleton scaffolder | Sonnet 4.6 |
| `@reviewer` | 7-dimension code review with multi-model panel | Sonnet 4.6 |
| `@docs-writer` | Confluence documentation writer | Sonnet 4.5 |
| `@product-manual` | HTML product documentation generator | Sonnet 4.5 |
| `@backend-tests` | NUnit + Moq test writer (≥95% coverage) | Sonnet 4.5 |
| `@frontend-tests` | Vitest + RTL test writer (≥90% coverage) | Sonnet 4.5 |
| `@e2e-tests` | Cypress E2E with strict Page Object Model | Sonnet 4.5 |
| `@playwright-e2e` | Playwright E2E — cross-browser, accessibility | Sonnet 4.5 |
| `@migration` | EF Core migration specialist (rollback-safe) | Sonnet 4.5 |

### Mandatory Quality Chains

Every code generation automatically triggers the appropriate chain:

```
Backend:  @backend → @migration (if schema) → @backend-tests → @reviewer
Frontend: @frontend → @frontend-tests + @e2e-tests (parallel) → @reviewer
```

---

## Skills

| Skill | Description |
|-------|-------------|
| `acquire-codebase-knowledge` | Structured codebase exploration for onboarding |
| `code-review-pipeline` | Multi-model panel review system |
| `confluence-content-guide` | Confluence documentation templates |
| `conventional-commit` | Conventional Commits enforcement |
| `create-adr` | Architectural Decision Record creation |
| `csharp-nunit` | NUnit test templates for .NET services |
| `diagnose` | AI workflow health check |
| `doc-comments` | XML doc / JSDoc comment generation |
| `dotnet-crud-scaffold` | .NET CRUD code templates |
| `dotnet-namespace-detect` | .NET namespace auto-detection |
| `dotnet-quality-chain` | Backend quality chain (build → test → review) |
| `explain-file` | Deep file analysis and dependency tracing |
| `gherkin-format` | Gherkin format rules G1–G11 |
| `harness-creator` | Project harness subsystem scaffolding |
| `jira-gherkin-convert` | Convert Jira tickets to Gherkin ACs |
| `jira-user-story-draft` | Draft Jira user stories with Gherkin |
| `knowledge-init` | Living knowledge base builder |
| `lisec-doc-template` | HTML product documentation template |
| `performance-optimize` | Performance analysis for .NET and React |
| `playwright-test-gen` | Playwright test spec generation |
| `product-doc-gap-checker` | Documentation completeness auditor |
| `product-flow-screenshots` | Automated screenshot flow generation |
| `react-crud-scaffold` | React CRUD code templates |
| `react-quality-chain` | Frontend quality chain (build → test → review) |
| `react-vitest` | Vitest + RTL test templates |
| `review-and-fix` | Fix-first code review |
| `security-review` | OWASP-aligned security audit |
| `trace-bug` | Structured root-cause analysis |

---

## Hooks

| Hook | Description |
|------|-------------|
| `governance-audit` | Session governance and audit logging |
| `knowledge-drift` | Detects stale documentation after code changes |
| `secrets-scanner` | Scans prompts and outputs for leaked secrets |
| `session-logger` | Logs session activity and metrics |
| `tool-guardian` | Guards tool usage against defined policies |

---

## Plugins

Install a complete workflow with one command:

| Plugin | Description |
|--------|-------------|
| `fullstack-dotnet-react` | Backend + Frontend + Migration + Scaffold agents with CRUD skills |
| `testing-suite` | NUnit + Vitest + Cypress + Playwright agents with test templates |
| `planning-suite` | Orchestrator + Planners + Reviewer + Docs agents with planning skills |

---

## Instructions

Auto-injected coding standards based on file patterns:

| File | Applies To | Description |
|------|-----------|-------------|
| `dotnet.instructions.md` | `**/*.cs` | .NET coding standards and security rules |
| `react-typescript.instructions.md` | `**/*.{ts,tsx}` | React + TypeScript conventions |
| `testing.instructions.md` | `**/*.{test,spec}.*` | Testing patterns and thresholds |
| `security.instructions.md` | `**/*.{cs,ts,tsx,json}` | OWASP-aligned security checks |

---

## Prompts

| Prompt | Description |
|--------|-------------|
| `/describe-pr` | Generate a PR description from staged changes |
| `/explain-project` | Explain the current project structure |
| `/find-confluence-page` | Search Confluence for relevant pages |
| `/generate-code` | Generate code from requirements |
| `/generate-tests` | Generate tests for existing code |
| `/jarvis` | Quick orchestrator invocation |
| `/knowledge-init` | Initialize living knowledge base |
| `/plan` | Plan a feature implementation |
| `/product-flow-screenshots` | Generate screenshot flow |
| `/read-jira-ticket` | Fetch and analyze a Jira ticket |
| `/review` | Review code changes |
| `/scaffold` | Scaffold a new service |
| `/sprint-status` | Get sprint status from Jira |
| `/update-copilot-instructions` | Update copilot-instructions.md |
| `/update-product-manual` | Update product documentation |

---

## Architecture

See [agents-guide.md](agents-guide.md) for the full architecture guide with Mermaid diagrams, workflow recipes, quality thresholds, and troubleshooting.

---

## Compatibility

| Platform | Support |
|----------|---------|
| GitHub Copilot (VS Code) | ✅ Full — agents, skills, prompts, hooks, instructions |
| Claude Code | ✅ Full — reads `.agent.md`, `SKILL.md`, `AGENTS.md` |
| Copilot CLI | ✅ Plugin install via `copilot plugin install` |
| Other AI assistants | 🟡 Partial — reads `llms.txt` for machine-readable catalog |

---

## Validation

```bash
npm run validate          # Validate all agents, skills, and plugins
npm run validate:skills   # Validate skills only
npm run validate:plugin   # Validate plugins only
npm run build             # Generate marketplace data
```

---

## 🚀 Quick Start

### Use This Repo in Your Project

```bash
# Clone and symlink into your VS Code workspace
git clone https://github.com/ALFRED-LUCIFER/awesome-skills-copilot.git
ln -s $(pwd)/awesome-skills-copilot/agents ~/.vscode/extensions/awesome-skills-copilot/agents
ln -s $(pwd)/awesome-skills-copilot/skills ~/.vscode/extensions/awesome-skills-copilot/skills
```

### Load in GitHub Copilot
1. Open `.copilot-instructions.md` in your workspace
2. Copilot auto-loads all agents and skills
3. Use `@orchestrator` to start, or pick a specific agent: `@backend`, `@frontend`, `@reviewer`

### Load in Claude Code
1. Add `agents/` and `skills/` to your project's Workspace context
2. Reference agents by name: `@orchestrator`, `@planner`, etc.
3. All 28 skills auto-load on-demand

---

## 📊 SEO & Discoverability

### GitHub Topics (helps you rank in searches)
**🔍 Keywords**: `copilot` · `agents` · `skills` · `harness-design` · `claude-code` · `github-copilot` · `ai-agents` · `prompt-templates` · `testing-automation` · `quality-gates`

### How People Find This Repo
- **Search**: "GitHub Copilot agents" → ranks by topics + README
- **Search**: "AI harness design" → research-backed content wins
- **Search**: "28 reusable skills" → catalog tables + AGENTS.md
- **Search**: "Gherkin acceptance criteria" → jira-planner skill
- **Search**: "mandatory quality chain" → dotnet-quality-chain + react-quality-chain

### Featured In
- [Awesome Copilot](https://github.com/StanGrozdev/awesome-github-copilot) — GitHub Copilot resources
- [Awesome AI Agents](https://github.com/e2b-dev/awesome-ai-agents) — AI agent frameworks
- [Awesome GitHub](https://github.com/phillipadsmith/awesome-github) — GitHub repos

### Trending Momentum
- ⭐ 50+ stars → GitHub trending → 10x visibility
- 🔗 Shared on Twitter/LinkedIn → drives community adoption
- 📰 Featured in newsletters → developer awareness

---

## 📚 Learn More

| Topic | Resource |
|-------|----------|
| **Architecture** | [agents-guide.md](agents-guide.md) — Full system design with Mermaid diagrams |
| **Research** | [Anthropic Harness Design](https://www.anthropic.com/engineering/harness-design-long-running-apps) — The science behind this repo |
| **Agents** | [AGENTS.md](AGENTS.md) — Navigation index for all 15 agents |
| **Skills** | Each skill folder contains detailed SKILL.md + examples |
| **Plugins** | [plugins/](plugins/) — Pre-built bundles (fullstack, testing, planning) |
| **Instructions** | [instructions/](instructions/) — Coding standards for .NET, React, testing, security |

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding agents, skills, hooks, and plugins.

## 💬 Community

- **Report issues**: [GitHub Issues](https://github.com/ALFRED-LUCIFER/awesome-skills-copilot/issues)
- **Discussions**: [GitHub Discussions](https://github.com/ALFRED-LUCIFER/awesome-skills-copilot/discussions)
- **Share ideas**: Open a discussion or PR with your enhancements

---

## License

MIT — Use commercially and distribute freely. See [LICENSE](LICENSE) for details.
