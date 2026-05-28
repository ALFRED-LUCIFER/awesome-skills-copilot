---
name: confluence-content-guide
description: >
  Reference guide for structuring AI-consumable Confluence documentation.
  Defines page structure, labeling conventions, and content templates used by
  @docs-writer and @docs-planner agents.
---

# Confluence AI-Ready Content Guide

> **Skill reference** — used by `@docs-writer` and `@docs-planner` when creating or validating Confluence content structure.

## Why Structure Matters

Random docs = useless for AI.
Structured, labeled docs = AI agents generate **consistent, standards-compliant code**.

This guide defines **what to write in Confluence** so that AI agents (`@orchestrator`, `@frontend`, `@backend`, `@frontend-tests`, `@e2e-tests`) produce better output.

---

## Recommended Page Structure in NG Space

```
NG Space
├── 📋 Engineering Standards
│   ├── Frontend Standards (React, MUI, MRT)
│   ├── Backend Standards (.NET, ServiceBase)
│   ├── API Design Standards
│   └── Code Review Checklist
├── 🏗 Architecture Decisions (ADRs)
│   ├── ADR-001: MRT over MUI DataGrid
│   ├── ADR-002: Service Layer Pattern
│   ├── ADR-003: React Query for API calls
│   └── ADR-004: Cypress POM for E2E
├── 🔧 System Design
│   ├── Property Service
│   ├── Order Service
│   ├── Scheduling Service
│   └── Auth / Identity
├── 🧪 Testing Standards
│   ├── Unit Testing (Vitest + RTL / NUnit + Moq)
│   └── E2E Testing (Cypress POM)
├── 🚀 DevOps & Deployment
│   ├── Environments (DEV / TST / PROD)
│   ├── CI/CD Pipelines
│   └── Secrets & Config
├── 📚 Domain Knowledge
│   ├── Business Entities
│   ├── Workflows & Lifecycles
│   └── Roles & Permissions
└── 🔥 Runbooks
    ├── Failed Deployment Fix
    ├── DB Reset / Recovery
    └── Production Incident Response
```

---

## Labeling Convention

| Category | Label | Additional Label | Example CQL |
|----------|-------|-----------------|-------------|
| Engineering Standards | `engineering-standards` | `ai-consumable` | `label = "engineering-standards"` |
| ADR | `adr` | `ai-consumable` | `label = "adr"` |
| System Design | `system-design` | `ai-consumable` | `label = "system-design"` |
| Testing | `testing-standards` | `ai-consumable` | `label = "testing-standards"` |
| DevOps | `devops` | `ai-consumable` | `label = "devops"` |
| Domain Knowledge | `domain-knowledge` | `ai-consumable` | `label = "domain-knowledge"` |
| Runbook | `runbook` | `ai-consumable` | `label = "runbook"` |

> **Rule**: Add `ai-consumable` to ALL docs meant for AI consumption. This lets agents search with `label = "ai-consumable"` to find everything relevant.

---

## Page Templates

### 1. Engineering Standard Template

```markdown
# [Technology] Standards

## Overview
Brief description of what this standard covers.

## Rules
- Rule 1: Description
- Rule 2: Description

## Examples

### Good
\`\`\`typescript
// correct example
\`\`\`

### Bad
\`\`\`typescript
// incorrect example
\`\`\`

## Exceptions
When these rules don't apply.
```

### 2. ADR Template

```markdown
# ADR-NNN: [Decision Title]

## Status
Accepted | Proposed | Deprecated

## Context
What is the issue? What forces are at play?

## Decision
What was decided and why.

## Consequences
### Positive
- Benefit 1
- Benefit 2

### Negative
- Trade-off 1
- Trade-off 2
```

### 3. System Design Template

```markdown
# [Service Name]

## Responsibilities
- What this service does

## Architecture
High-level component diagram description.

## APIs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/resource | List resources |
| POST | /api/v1/resource | Create resource |

## Data Model
| Entity | Key Fields | Relationships |
|--------|-----------|---------------|
| Entity1 | id, name | Has many Entity2 |

## Dependencies
- Other services it depends on
```

### 4. Testing Standards Template

```markdown
# Testing Standards

## Unit Tests (Frontend)
- Framework: Vitest + React Testing Library
- File naming: `[Component].test.tsx`
- Minimum coverage: 90% (frontend) / 95% (backend, persona-centric)

## Unit Tests (Backend)
- Framework: NUnit + Moq + MockQueryable
- File naming: `[Class]Tests.cs`
- Happy path + error cases

## E2E Tests
- Framework: Cypress
- Pattern: Page Object Model (POM)
- Selectors: data-testid attributes ONLY
```

### 5. DevOps Template

```markdown
# Environments & Deployment

## Environments
| Env | URL | Purpose |
|-----|-----|---------|
| DEV | dev-*.myorg.io | Developer testing |
| TST | tst-*.myorg.io | QA / integration |
| PROD | *.myorg.io | Production |

## CI/CD
- Pipeline tool
- Build steps
- Deploy steps

## Secrets
- Secret store (Azure Key Vault)
- Local dev config (.env, gitignored)
```

### 6. Domain Knowledge Template

```markdown
# [Business Entity]

## Definition
What this entity represents.

## Types / Statuses
| Type | Description |

## Lifecycle
New → Active → ... → Archived

## Roles
| Role | Permissions |
```

### 7. Runbook Template

```markdown
# Runbook: [Incident Title]

## Symptoms
- What the user/system reports

## Steps
1. Step 1
2. Step 2

## Escalation
- Who to contact if unresolved
```

---

## Usage with Agents

### Creating a page
```
@docs-writer Create the Frontend Standards page in NG space
under the Engineering Standards section. Use the engineering standard template.
```

### Enriching a Jira plan
```
@docs-planner Plan NG-12345 and check Confluence for relevant
standards and system design docs.
```

### Searching knowledge
```
@docs-writer Search for all ADRs related to data tables.
```
