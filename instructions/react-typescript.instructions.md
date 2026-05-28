---
description: "Coding standards for React / TypeScript / TSX files — conventions, patterns, and guardrails"
applyTo: "**/*.{ts,tsx}"
---

# React + TypeScript Coding Standards

## General Rules

- Use functional components with hooks — no class components
- Use `react-hook-form` for form state management
- Use TanStack Query (React Query) for server state
- Follow `useXxxController` pattern for component logic separation
- Use MUI components with theme customization — no inline styles

## Naming Conventions

- PascalCase for components and types (e.g., `UserPreferences`, `OrderDialog`)
- camelCase for hooks, functions, and variables (e.g., `useOrderController`)
- Prefix hooks with `use` (e.g., `useOrderQuery`)
- Suffix query hooks with `Query` or `Queries` (e.g., `useOrderQuery`)
- Suffix mutation hooks with `Mutation` (e.g., `useCreateOrderMutation`)

## File Structure

```
features/{feature}/
├── types.ts                    # TypeScript interfaces and types
├── {Feature}Page.tsx           # Page component
├── {Feature}Dialog.tsx         # Create/edit dialog
├── {Feature}Table.tsx          # Data table component
├── hooks/
│   ├── use{Feature}Controller.ts
│   ├── use{Feature}Query.ts
│   └── use{Feature}Mutation.ts
└── __tests__/
    ├── {Feature}Page.test.tsx
    └── use{Feature}Controller.test.ts
```

## Security

- Sanitize all user input before rendering — use DOMPurify for HTML content
- Never store tokens in localStorage — use httpOnly cookies
- Validate route parameters and query strings
- Use Content Security Policy headers

## Testing

- Minimum 90% coverage for new features
- Use Vitest + React Testing Library
- Test user behavior, not implementation details
- Use mock factories for test data
- Mock API calls with MSW or manual mocks

## Performance

- Use `React.memo` for expensive pure components
- Use `useMemo`/`useCallback` only when profiler shows need
- Virtualize long lists (react-window or react-virtuoso)
- Configure TanStack Query staleTime to avoid refetch storms
