# AGENTS.md — AI Navigation Index

> Machine-readable navigation for AI agents exploring this repository.
> Compatible with GitHub Copilot, Claude Code, and Codex.

## Repository Purpose

A production-ready collection of **21 specialized AI agents**, **32 skills**, **5 hooks**, **4 plugins**, and **15 prompt templates** for GitHub Copilot and Claude Code. Designed for .NET + React fullstack teams but adaptable to any stack.

## Directory Map

```
├── agents/                  ← 21 Copilot agent definitions (.agent.md)
├── skills/                  ← 32 self-contained skill folders (SKILL.md + assets)
├── prompts/                 ← 15 reusable prompt templates (.prompt.md)
├── hooks/                   ← 5 automated session hooks (hooks.json + scripts)
├── instructions/            ← Auto-injected coding standards (.instructions.md)
├── plugins/                 ← Installable plugin bundles (plugin.json)
├── eng/                     ← Validation and build scripts
├── memories/org/            ← Shared organizational knowledge
├── profile/                 ← Developer manual (HTML)
├── copilot-instructions.md  ← Root Copilot configuration
├── agents-guide.md          ← Full architecture guide with diagrams
└── README.md                ← Project overview and catalog tables
```

## Agents (21)

| Agent | File | Purpose |
|-------|------|---------|
| `@orchestrator` | `agents/orchestrator.agent.md` | Single entry-point — delegates to planners and builders |
| `@planner` | `agents/planner.agent.md` | Read-only planning with Gherkin ACs, risks, estimates |
| `@jira-planner` | `agents/jira-planner.agent.md` | Jira read+write — Gherkin conversion, DoD checklists |
| `@docs-planner` | `agents/docs-planner.agent.md` | Jira + Confluence bridge planner |
| `@backend` | `agents/backend.agent.md` | .NET CRUD code generator (Controller → Service → Repo → DTO) |
| `@frontend` | `agents/frontend.agent.md` | React + TypeScript + MUI component builder |
| `@scaffold` | `agents/scaffold.agent.md` | .NET microservice skeleton scaffolder |
| `@reviewer` | `agents/reviewer.agent.md` | 7-dimension code review with auto-fix loop |
| `@docs-writer` | `agents/docs-writer.agent.md` | Confluence documentation writer |
| `@product-manual` | `agents/product-manual.agent.md` | HTML product documentation generator |
| `@backend-tests` | `agents/backend-tests.agent.md` | NUnit + Moq test writer (≥95% coverage) |
| `@frontend-tests` | `agents/frontend-tests.agent.md` | Vitest + RTL test writer (≥90% coverage) |
| `@e2e-tests` | `agents/e2e-tests.agent.md` | Cypress E2E with strict POM |
| `@playwright-e2e` | `agents/playwright-e2e.agent.md` | Playwright E2E — cross-browser, a11y |
| `@migration` | `agents/migration.agent.md` | EF Core migration specialist |
| `@k8s-deployer` | `agents/k8s-deployer.agent.md` | Kubernetes manifest generator and deployer |
| `@k8s-troubleshoot` | `agents/k8s-troubleshoot.agent.md` | Kubernetes cluster diagnostician |
| `@helm-engineer` | `agents/helm-engineer.agent.md` | Helm 4 chart specialist |
| `@azure-deployer` | `agents/azure-deployer.agent.md` | Azure infrastructure provisioning (AKS, ACR, Bicep, Terraform) |
| `@foundry-agent` | `agents/foundry-agent.agent.md` | Microsoft Foundry Agent Service specialist |
| `@pipeline-engineer` | `agents/pipeline-engineer.agent.md` | CI/CD pipeline generator (GitHub Actions, Azure DevOps, GitLab CI) |

## Skills (32)

| Skill | Folder | Purpose |
|-------|--------|---------|
| `acquire-codebase-knowledge` | `skills/acquire-codebase-knowledge/` | Structured codebase exploration for onboarding |
| `code-review-pipeline` | `skills/code-review-pipeline/` | Multi-model panel review system |
| `confluence-content-guide` | `skills/confluence-content-guide/` | Confluence documentation templates |
| `conventional-commit` | `skills/conventional-commit/` | Conventional Commits enforcement |
| `create-adr` | `skills/create-adr/` | Architectural Decision Record creation |
| `csharp-nunit` | `skills/csharp-nunit/` | NUnit test templates for .NET services |
| `diagnose` | `skills/diagnose/` | AI workflow health check |
| `doc-comments` | `skills/doc-comments/` | XML doc / JSDoc comment generation |
| `dotnet-crud-scaffold` | `skills/dotnet-crud-scaffold/` | .NET CRUD code templates |
| `dotnet-namespace-detect` | `skills/dotnet-namespace-detect/` | .NET namespace auto-detection |
| `dotnet-quality-chain` | `skills/dotnet-quality-chain/` | Backend quality chain (build → test → review) |
| `explain-file` | `skills/explain-file/` | Deep file analysis and dependency tracing |
| `gherkin-format` | `skills/gherkin-format/` | Gherkin format rules G1–G11 |
| `harness-creator` | `skills/harness-creator/` | Project harness subsystem scaffolding |
| `jira-gherkin-convert` | `skills/jira-gherkin-convert/` | Convert Jira tickets to Gherkin ACs |
| `jira-user-story-draft` | `skills/jira-user-story-draft/` | Draft Jira user stories with Gherkin |
| `knowledge-init` | `skills/knowledge-init/` | Living knowledge base builder |
| `lisec-doc-template` | `skills/lisec-doc-template/` | HTML product documentation template |
| `performance-optimize` | `skills/performance-optimize/` | Performance analysis patterns |
| `playwright-test-gen` | `skills/playwright-test-gen/` | Playwright test spec generation |
| `product-doc-gap-checker` | `skills/product-doc-gap-checker/` | Documentation completeness auditor |
| `product-flow-screenshots` | `skills/product-flow-screenshots/` | Automated screenshot flow generation |
| `react-crud-scaffold` | `skills/react-crud-scaffold/` | React CRUD code templates |
| `react-quality-chain` | `skills/react-quality-chain/` | Frontend quality chain (build → test → review) |
| `react-vitest` | `skills/react-vitest/` | Vitest + RTL test templates |
| `review-and-fix` | `skills/review-and-fix/` | Fix-first code review |
| `security-review` | `skills/security-review/` | OWASP-aligned security audit |
| `trace-bug` | `skills/trace-bug/` | Structured root-cause analysis |
| `kubernetes-manifests` | `skills/kubernetes-manifests/` | Production-ready K8s manifest templates |
| `helm-charts` | `skills/helm-charts/` | Helm 4 chart scaffolding templates |
| `azure-infrastructure` | `skills/azure-infrastructure/` | Bicep + Terraform IaC templates for Azure |
| `markitdown-convert` | `skills/markitdown-convert/` | Convert files (PDF, Word, Excel, images, audio) to Markdown for LLM consumption |

## Hooks (5)

| Hook | Folder | Trigger |
|------|--------|---------|
| `governance-audit` | `hooks/governance-audit/` | Session start/end, prompts |
| `knowledge-drift` | `hooks/knowledge-drift/` | Detects stale documentation |
| `secrets-scanner` | `hooks/secrets-scanner/` | Scans for leaked secrets |
| `session-logger` | `hooks/session-logger/` | Logs session activity |
| `tool-guardian` | `hooks/tool-guardian/` | Guards tool usage policies |

## Key Files

- **Start here**: `README.md` → project overview and install instructions
- **Architecture**: `agents-guide.md` → full system architecture with Mermaid diagrams
- **Configuration**: `copilot-instructions.md` → root Copilot settings
- **Validation**: `npm run validate` → validate all agents, skills, and plugins
