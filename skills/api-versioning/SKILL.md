---
name: api-versioning
description: 'API versioning strategies — URL path, header, query parameter, and content negotiation approaches with implementation patterns for REST and GraphQL'
---

# API Versioning Skill

Implement API versioning to evolve APIs without breaking consumers.

## When to Use

- Designing a new API that will evolve over time
- Adding versioning to an existing unversioned API
- Making breaking changes while maintaining backward compatibility
- Deprecating old API versions gracefully

## Rules

1. Version from day one — retrofitting is painful
2. URL path versioning (`/v1/`) is simplest and most widely understood
3. NEVER remove fields from a response — only add (non-breaking change)
4. Breaking changes: removed fields, changed types, new required parameters → new version
5. Support at most 2 active versions simultaneously — sunset old ones
6. Deprecation: `Sunset` header + `Deprecation` header with dates
7. API changelog MUST document every breaking change
8. Version applies to the resource, not individual endpoints

## Steps

1. Choose versioning strategy: URL path (`/v1/`), header (`Accept-Version`), or query param (`?v=1`)
2. Implement version routing in the framework (middleware, route prefixes, controller versioning)
3. Define version lifecycle: Active → Deprecated (6 months) → Sunset (removed)
4. Add version negotiation: if no version specified, use latest stable
5. Implement response headers: `API-Version`, `Deprecation`, `Sunset`, `Link` (to docs)
6. Create versioned schemas/DTOs — never share between versions
7. Add version to API documentation (separate spec per version)
8. Monitor version usage — identify when to sunset old versions

## Reference

See `./templates/` for per-framework versioning middleware implementations.
