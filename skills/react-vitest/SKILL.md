---
name: react-vitest
description: >
  Vitest + React Testing Library test templates for your project frontend features.
  Contains: controller hook tests, dialog controller tests, query tests (single + list),
  mutation tests (with captured onSuccess), utility function tests, page component tests,
  dialog component tests, table component tests, and mock data factory pattern.
---

# React Vitest Templates

## When to Use

- @frontend-tests generating unit/component tests
- Writing tests for controller hooks, query hooks, mutation hooks
- Testing React components (pages, dialogs, tables)

## Rules

1. Use `vi.mock()` for all mocks — never wrap hook tests in `QueryClientProvider`
2. Every test must fail if tested functionality breaks — no existence-only checks
3. Never update assertions to make failing tests green (masks bugs)
4. Test controller hooks BEFORE UI components (logic first)
5. Place test file in same directory as source: `<filename>.test.ts(x)`
6. FORBIDDEN: `expect(x).toBeDefined()` alone, `expect(x).toBeTruthy()` alone, `expect(typeof fn).toBe('function')`
7. Use `renderHook` from `@testing-library/react` for hook tests
8. Capture `onSuccess` callbacks in mutation tests via `vi.fn()` spy
9. Mock data factories return typed objects — one factory per entity
10. Component tests assert user-visible behavior, not implementation details

## Steps

1. **Create mock factory** — typed function returning entity with defaults + overrides
2. **Test controller hook** — mock dependencies via `vi.mock()`, call `renderHook`, assert returned state/handlers
3. **Test dialog controller** — same pattern, test open/close/submit/validation states
4. **Test query hooks** — mock API module, verify query key and returned data mapping
5. **Test mutation hooks** — mock API, capture `onSuccess` via spy, verify invalidation/callbacks
6. **Test utility functions** — pure input/output assertions
7. **Test page component** — mock controller hook, render, assert elements and interactions
8. **Test dialog component** — mock dialog controller, render, assert form fields and submit
9. **Test table component** — mock data, render, assert columns/rows/sorting

## Priority Order

1. `useXxxController.test.ts`
2. `useXxxDialogController.test.ts`
3. `useXxxQuery.test.ts` / `useXxxsQuery.test.ts`
4. Mutation hooks (create/update/delete)
5. Utility functions
6. `XxxPage.test.tsx`
7. `XxxDialog.test.tsx`
8. `XxxTable.test.tsx`

## Reference

See [./templates/](./templates/) for complete test file templates per pattern (controller, dialog, query, mutation, component, mock factory).
