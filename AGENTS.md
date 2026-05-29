# AGENTS.md — AI Navigation Index

> Machine-readable navigation for AI agents exploring this repository.
> Compatible with GitHub Copilot, Claude Code, and Codex.

## Repository Purpose

A production-ready collection of **40 specialized AI agents**, **55 skills**, **10 hooks**, **4 plugins**, and **23 prompt templates** for GitHub Copilot and Claude Code. Stack-agnostic core with .NET + React fullstack extensions.

## Directory Map

```
├── agents/                  ← 40 Copilot agent definitions (.agent.md)
├── skills/                  ← 55 self-contained skill folders (SKILL.md + assets)
├── prompts/                 ← 23 reusable prompt templates (.prompt.md)
├── hooks/                   ← 10 automated session hooks (hooks.json + scripts)
├── instructions/            ← Auto-injected coding standards (.instructions.md)
├── plugins/                 ← Installable plugin bundles (plugin.json)
├── eng/                     ← Validation and build scripts
├── memories/org/            ← Shared organizational knowledge
├── profile/                 ← Developer manual (HTML)
├── copilot-instructions.md  ← Root Copilot configuration
├── agents-guide.md          ← Full architecture guide with diagrams
└── README.md                ← Project overview and catalog tables
```

## Agents (40)

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
| `@tdd-red` | `agents/tdd-red.agent.md` | TDD Red phase — writes failing tests before implementation |
| `@tdd-green` | `agents/tdd-green.agent.md` | TDD Green phase — minimal code to make tests pass |
| `@tdd-refactor` | `agents/tdd-refactor.agent.md` | TDD Refactor phase — clean up while keeping green |
| `@accessibility` | `agents/accessibility.agent.md` | WCAG 2.2 AA auditor, fixer, and test generator |
| `@api-designer` | `agents/api-designer.agent.md` | OpenAPI/GraphQL/gRPC spec design, validation, mock generation |
| `@db-architect` | `agents/db-architect.agent.md` | Schema design, migration gen, query optimization (any DB) |
| `@refactor` | `agents/refactor.agent.md` | Systematic behavior-preserving code refactoring |
| `@debug` | `agents/debug.agent.md` | Structured debugging — root cause isolation from errors/traces |
| `@dependency-manager` | `agents/dependency-manager.agent.md` | Dependency audit, update, vulnerability scan (any ecosystem) |
| `@perf-profiler` | `agents/perf-profiler.agent.md` | Performance bottleneck identification and optimization |
| `@docs-generator` | `agents/docs-generator.agent.md` | README, API docs, changelog generation from code |
| `@git-workflow` | `agents/git-workflow.agent.md` | Branch strategy, merge conflicts, rebase, release tagging |
| `@api-tester` | `agents/api-tester.agent.md` | API test suites — Postman, contract tests, load tests |
| `@incident-responder` | `agents/incident-responder.agent.md` | Production incident triage, RCA, postmortems |
| `@release-manager` | `agents/release-manager.agent.md` | Semantic versioning, changelog, release workflow |
| `@tech-debt-tracker` | `agents/tech-debt-tracker.agent.md` | Tech debt identification, categorization, prioritization |
| `@onboarding` | `agents/onboarding.agent.md` | New developer onboarding — codebase tour, setup guide |
| `@code-migrator` | `agents/code-migrator.agent.md` | Framework/version migration planning and execution |
| `@monitoring-setup` | `agents/monitoring-setup.agent.md` | Health checks, dashboards, alerting, SLO/SLI setup |

## Skills (55)

| Skill | Folder | Purpose |
|-------|--------|---------|
| `acquire-codebase-knowledge` | `skills/acquire-codebase-knowledge/` | Structured codebase exploration for onboarding |
| `api-versioning` | `skills/api-versioning/` | API versioning strategies and implementation patterns |
| `authentication-patterns` | `skills/authentication-patterns/` | OAuth2, JWT, OIDC, API key implementation templates |
| `azure-infrastructure` | `skills/azure-infrastructure/` | Bicep + Terraform IaC templates for Azure |
| `caching-patterns` | `skills/caching-patterns/` | Redis, in-memory, CDN caching with invalidation |
| `changelog-generator` | `skills/changelog-generator/` | Auto-generate CHANGELOG from conventional commits |
| `code-complexity` | `skills/code-complexity/` | Cyclomatic complexity analysis and hotspot detection |
| `code-review-pipeline` | `skills/code-review-pipeline/` | Multi-model panel review system |
| `confluence-content-guide` | `skills/confluence-content-guide/` | Confluence documentation templates |
| `contract-testing` | `skills/contract-testing/` | Consumer-driven contract tests (Pact) |
| `conventional-commit` | `skills/conventional-commit/` | Conventional Commits enforcement |
| `create-adr` | `skills/create-adr/` | Architectural Decision Record creation |
| `csharp-nunit` | `skills/csharp-nunit/` | NUnit test templates for .NET services |
| `database-seeding` | `skills/database-seeding/` | Test data generation, seed scripts, faker patterns |
| `diagnose` | `skills/diagnose/` | AI workflow health check |
| `doc-comments` | `skills/doc-comments/` | XML doc / JSDoc comment generation |
| `docker-compose` | `skills/docker-compose/` | Multi-service Docker Compose generation |
| `dotnet-crud-scaffold` | `skills/dotnet-crud-scaffold/` | .NET CRUD code templates |
| `dotnet-namespace-detect` | `skills/dotnet-namespace-detect/` | .NET namespace auto-detection |
| `dotnet-quality-chain` | `skills/dotnet-quality-chain/` | Backend quality chain (build → test → review) |
| `env-config` | `skills/env-config/` | Environment configuration management and .env templates |
| `error-handling-patterns` | `skills/error-handling-patterns/` | Standardized error handling per language (RFC 9457) |
| `explain-file` | `skills/explain-file/` | Deep file analysis and dependency tracing |
| `feature-flags` | `skills/feature-flags/` | Feature flag implementation patterns |
| `gherkin-format` | `skills/gherkin-format/` | Gherkin format rules G1–G11 |
| `git-hooks-setup` | `skills/git-hooks-setup/` | Husky, lint-staged, commitlint configuration |
| `graphql-scaffold` | `skills/graphql-scaffold/` | Schema-first GraphQL development templates |
| `harness-creator` | `skills/harness-creator/` | Project harness subsystem scaffolding |
| `helm-charts` | `skills/helm-charts/` | Helm 4 chart scaffolding templates |
| `i18n-setup` | `skills/i18n-setup/` | Internationalization scaffolding |
| `jira-gherkin-convert` | `skills/jira-gherkin-convert/` | Convert Jira tickets to Gherkin ACs |
| `jira-user-story-draft` | `skills/jira-user-story-draft/` | Draft Jira user stories with Gherkin |
| `knowledge-init` | `skills/knowledge-init/` | Living knowledge base builder |
| `kubernetes-manifests` | `skills/kubernetes-manifests/` | Production-ready K8s manifest templates |
| `lisec-doc-template` | `skills/lisec-doc-template/` | HTML product documentation template |
| `load-testing` | `skills/load-testing/` | k6/Artillery load test script generation |
| `logging-observability` | `skills/logging-observability/` | Structured logging, tracing, and metrics setup |
| `markitdown-convert` | `skills/markitdown-convert/` | Convert files to Markdown for LLM consumption |
| `migration-guide` | `skills/migration-guide/` | Framework/version migration planning |
| `monorepo-setup` | `skills/monorepo-setup/` | Nx, Turborepo, pnpm workspaces setup |
| `openapi-scaffold` | `skills/openapi-scaffold/` | Server stubs + client SDKs from OpenAPI specs |
| `performance-optimize` | `skills/performance-optimize/` | Performance analysis patterns |
| `playwright-test-gen` | `skills/playwright-test-gen/` | Playwright test spec generation |
| `product-doc-gap-checker` | `skills/product-doc-gap-checker/` | Documentation completeness auditor |
| `product-flow-screenshots` | `skills/product-flow-screenshots/` | Automated screenshot flow generation |
| `rate-limiting` | `skills/rate-limiting/` | Rate limiting, throttling, circuit breaker patterns |
| `react-crud-scaffold` | `skills/react-crud-scaffold/` | React CRUD code templates |
| `react-quality-chain` | `skills/react-quality-chain/` | Frontend quality chain (build → test → review) |
| `react-vitest` | `skills/react-vitest/` | Vitest + RTL test templates |
| `review-and-fix` | `skills/review-and-fix/` | Fix-first code review |
| `security-review` | `skills/security-review/` | OWASP-aligned security audit |
| `skill-pipeline` | `skills/skill-pipeline/` | Declarative skill composition DAGs |
| `skill-telemetry` | `skills/skill-telemetry/` | Skill invocation metrics and optimization |
| `token-budget-loader` | `skills/token-budget-loader/` | Token-aware skill loading with tiered detail levels |
| `trace-bug` | `skills/trace-bug/` | Structured root-cause analysis |

## Hooks (10)

| Hook | Folder | Trigger |
|------|--------|---------|
| `changelog-auto` | `hooks/changelog-auto/` | Post-commit — auto-appends to CHANGELOG.md |
| `complexity-guard` | `hooks/complexity-guard/` | Pre-commit — blocks high-complexity code |
| `dependency-license-checker` | `hooks/dependency-license-checker/` | Scans for copyleft/blocked licenses |
| `governance-audit` | `hooks/governance-audit/` | Session start/end, prompts |
| `knowledge-drift` | `hooks/knowledge-drift/` | Detects stale documentation |
| `memory-snapshot` | `hooks/memory-snapshot/` | Session-end context capture for continuity |
| `secrets-scanner` | `hooks/secrets-scanner/` | Scans for leaked secrets |
| `session-logger` | `hooks/session-logger/` | Logs session activity |
| `test-coverage-gate` | `hooks/test-coverage-gate/` | Pre-push — enforces minimum test coverage |
| `tool-guardian` | `hooks/tool-guardian/` | Guards tool usage policies |

## Key Files

- **Start here**: `README.md` → project overview and install instructions
- **Architecture**: `agents-guide.md` → full system architecture with Mermaid diagrams
- **Configuration**: `copilot-instructions.md` → root Copilot settings
- **Validation**: `npm run validate` → validate all agents, skills, and plugins
