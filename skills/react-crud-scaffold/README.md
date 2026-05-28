# react-crud-scaffold

> Complete CRUD code templates for React 19 + MUI 7 features — types → query hooks → mutation hooks → controller hooks → dialog controller → page → dialog → table.

## Purpose

Provides ready-to-use code templates for generating complete CRUD features in your project React frontend applications. Uses `{Feature}/{feature}` placeholders and integrates with platform libraries.

## When to Use

- `@frontend` agent generating new features
- Adding CRUD functionality to existing frontend apps
- Creating new feature modules

## Template Layers

1. **Types** — TypeScript interfaces and enums
2. **Query Hooks** — TanStack Query data fetching
3. **Mutation Hooks** — TanStack Query create/update/delete
4. **Controller Hook** — `useXxxController` with all state and handlers
5. **Dialog Controller** — Form state and validation
6. **Page Component** — Route-level component with PlatformMrt table
7. **Dialog Component** — FormDialog with react-hook-form
8. **Table Configuration** — Column definitions for PlatformMrt

## Dependencies

- `@your-org/platform-lib`
- TanStack Query
- react-hook-form
- MUI 7

## Used By

- `@frontend` agent
