# react-vitest

> Vitest + React Testing Library test templates — controller hook tests, dialog controller tests, query/mutation tests, mock data factories, and component tests.

## Purpose

Provides comprehensive test templates for Copilot Agent System React frontend testing. Covers all testing layers with an 8-level priority order and strict forbidden patterns.

## When to Use

- `@frontend-tests` agent generating unit/component tests
- Writing controller hook tests
- Creating mock data factories

## Testing Priority Order (8 levels)

1. Controller hook tests (`useXxxController`)
2. Dialog controller tests
3. Query hook tests
4. Mutation hook tests
5. Utility/helper tests
6. Page component tests
7. Dialog component tests
8. Table component tests

## 3 Core Principles

1. **Regression guards** — Tests catch future breakage
2. **Never update assertions to pass** — Fix the code, not the test
3. **Controller hooks first** — Test logic before UI

## Forbidden Patterns

- `toBeDefined()` alone (too weak)
- `toBeTruthy()` alone (too vague)
- Testing implementation details
- Snapshot tests for logic

## Dependencies

- Vitest
- React Testing Library
- `vi.mock()` for mocking

## Used By

- `@frontend-tests` agent
