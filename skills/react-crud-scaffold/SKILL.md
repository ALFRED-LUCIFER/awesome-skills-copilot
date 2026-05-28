---
name: react-crud-scaffold
description: >
  Complete CRUD code templates for React 19 + MUI features.
  Contains types, query hooks, mutation hooks, controller hooks, dialog controller,
  page component, dialog component, and standalone table component templates.
  Adapts to user's preferred UI library (MUI DataGrid, Material React Table, TanStack Table, etc.).
  Replace {Feature}/{feature} with your entity name (e.g. Machine/machine).
---

# React CRUD Scaffold

## When to Use

- @frontend generating a new entity's full CRUD UI
- Adding a new feature with list page, create/edit dialog, and table
- Need types, hooks, controllers, and components for an entity

## Rules

1. Replace `{Feature}` (PascalCase) and `{feature}` (camelCase) with entity name
2. Types file defines: entity interface, form data interface, default values
3. Query hooks use TanStack Query with typed query keys
4. Mutation hooks capture `onSuccess` for cache invalidation via `queryClient.invalidateQueries`
5. Controller hook (`useXxxController`) owns page state: selection, filters, dialog open/close
6. Dialog controller (`useXxxDialogController`) owns form state: react-hook-form, validation, submit
7. Page component renders: header + create button + table + dialog
8. Dialog uses the project's dialog component (or plain MUI Dialog) with `react-hook-form` integration
9. Table uses the project's preferred table library (MUI DataGrid, Material React Table, TanStack Table, or any UI the user specifies) with typed columns
10. All components are domain-driven: `src/features/{feature}/`

## Steps

1. **Create types** — `types/{feature}.types.ts` (entity, form data, defaults)
2. **Create query hooks** — `hooks/use{Feature}Query.ts`, `use{Feature}sQuery.ts`
3. **Create mutation hooks** — `hooks/use{Feature}Mutation.ts` (create/update/delete)
4. **Create controller** — `hooks/use{Feature}Controller.ts` (page state orchestration)
5. **Create dialog controller** — `hooks/use{Feature}DialogController.ts` (form + validation)
6. **Create page** — `{Feature}Page.tsx` (layout + table + dialog mounting)
7. **Create dialog** — `{Feature}Dialog.tsx` (dialog component + form fields)
8. **Create table** — `{Feature}Table.tsx` (user's preferred table lib + columns + actions)

## File Structure

```
src/features/{feature}/
├── types/{feature}.types.ts
├── hooks/
│   ├── use{Feature}Query.ts
│   ├── use{Feature}sQuery.ts
│   ├── use{Feature}Mutation.ts
│   ├── use{Feature}Controller.ts
│   └── use{Feature}DialogController.ts
├── {Feature}Page.tsx
├── {Feature}Dialog.tsx
└── {Feature}Table.tsx
```

## Reference

See [./templates/](./templates/) for complete TypeScript/TSX code templates for each file.
