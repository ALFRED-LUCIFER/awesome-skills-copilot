---
name: graphql-scaffold
description: 'Schema-first GraphQL development — type definitions, resolvers, dataloaders, subscriptions, and code generation for Apollo, Yoga, Strawberry, or Hot Chocolate'
---

# GraphQL Scaffold Skill

Scaffold a GraphQL API from schema definitions.

## When to Use

- Starting a new GraphQL API project
- Adding types, queries, mutations, subscriptions
- Setting up dataloaders for N+1 prevention
- Generating typed resolvers from SDL schema

## Rules

1. Schema-first: define SDL types BEFORE writing resolvers
2. Every query MUST use dataloaders for related entities — no N+1
3. Mutations return the affected object (not void/boolean)
4. Use input types for mutation arguments — never raw scalars
5. Pagination: Relay cursor-based (`Connection`, `Edge`, `PageInfo`) for lists
6. Errors: use union types (`Result = Success | Error`) not exceptions
7. Authentication: context-level auth, field-level authorization directives
8. Depth limiting and query complexity analysis to prevent abuse

## Steps

1. Detect existing GraphQL setup or choose server (Apollo Server, Yoga, Strawberry, Hot Chocolate)
2. Define SDL schema: types, queries, mutations, subscriptions
3. Generate typed resolvers from schema (codegen for TS, source gen for C#)
4. Implement dataloaders for all relationship fields
5. Add input validation on mutation input types
6. Configure authentication context and authorization directives
7. Add query depth limiting and complexity analysis middleware
8. Set up GraphQL Playground/Sandbox for development

## Reference

See `./templates/` for Apollo Server, Yoga, and Hot Chocolate scaffold patterns.
