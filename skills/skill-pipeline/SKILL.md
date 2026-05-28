---
name: skill-pipeline
description: 'Declarative skill composition — define ordered pipelines of skills with dependencies, parallelization, and conditional gates. Use when: multi-step workflows, feature delivery chains, orchestrator coordination, DAG execution.'
---

# Skill Pipeline

Define and execute multi-skill workflows as directed acyclic graphs (DAGs).

## When to Use

- Feature delivery requiring 3+ skills in sequence
- Orchestrator needs a reusable workflow template
- Parallel skill execution with dependency gates
- Conditional skill activation based on prior results

## Pipeline Definition Format

```yaml
pipeline: <name>
description: <purpose>
trigger: <manual | agent-request | hook>
steps:
  - id: step-1
    skill: <skill-name>
    input: <static value or reference to prior step output>
    
  - id: step-2
    skill: <skill-name>
    depends: [step-1]
    condition: "step-1.status == 'success'"
    
  - id: step-3a
    skill: <skill-name>
    depends: [step-1]
    parallel: true
    
  - id: step-3b
    skill: <skill-name>
    depends: [step-1]
    parallel: true
    
  - id: step-4
    skill: <skill-name>
    depends: [step-3a, step-3b]
    gate: all-success
```

## Built-in Pipelines

### feature-delivery-backend

```yaml
pipeline: feature-delivery-backend
description: End-to-end backend feature from Jira to reviewed code
steps:
  - id: plan
    skill: jira-gherkin-convert
    input: "{{ticket_key}}"
    
  - id: scaffold
    skill: dotnet-crud-scaffold
    depends: [plan]
    
  - id: migrate
    skill: dotnet-namespace-detect
    depends: [scaffold]
    
  - id: test
    skill: csharp-nunit
    depends: [scaffold]
    parallel: true
    
  - id: quality
    skill: dotnet-quality-chain
    depends: [test, migrate]
    gate: all-success
    
  - id: review
    skill: code-review-pipeline
    depends: [quality]
```

### feature-delivery-frontend

```yaml
pipeline: feature-delivery-frontend
description: End-to-end frontend feature from Jira to reviewed code
steps:
  - id: plan
    skill: jira-gherkin-convert
    input: "{{ticket_key}}"
    
  - id: scaffold
    skill: react-crud-scaffold
    depends: [plan]
    
  - id: unit-test
    skill: react-vitest
    depends: [scaffold]
    parallel: true
    
  - id: e2e-test
    skill: playwright-test-gen
    depends: [scaffold]
    parallel: true
    
  - id: quality
    skill: react-quality-chain
    depends: [unit-test, e2e-test]
    gate: all-success
    
  - id: review
    skill: code-review-pipeline
    depends: [quality]
```

### fullstack-delivery

```yaml
pipeline: fullstack-delivery
description: Coordinated backend + frontend feature delivery
steps:
  - id: plan
    skill: jira-gherkin-convert
    input: "{{ticket_key}}"
    
  - id: backend
    pipeline: feature-delivery-backend
    depends: [plan]
    parallel: true
    
  - id: frontend
    pipeline: feature-delivery-frontend
    depends: [plan]
    parallel: true
    
  - id: integration
    skill: playwright-test-gen
    depends: [backend, frontend]
    gate: all-success
```

## Execution Rules

1. **Dependency resolution**: Steps execute only after all `depends` are satisfied
2. **Parallel execution**: Steps marked `parallel: true` with same dependencies run concurrently
3. **Gates**: `all-success` = all deps must pass; `any-success` = at least one must pass
4. **Conditions**: JS-style expressions evaluated against prior step outputs
5. **Failure handling**: On step failure, skip all downstream dependents and report
6. **Nested pipelines**: A step can reference another pipeline by name

## Step Output Contract

Each step produces:
```json
{
  "stepId": "string",
  "skill": "string",
  "status": "success | failure | skipped",
  "duration_ms": 0,
  "output": {},
  "errors": []
}
```

## Pipeline Report

After execution, produce:
```
Pipeline: {name}
Status: {PASS | FAIL | PARTIAL}
Steps: {completed}/{total} ({skipped} skipped)
Duration: {total_ms}ms
Failed steps: [{step_ids}]
```
