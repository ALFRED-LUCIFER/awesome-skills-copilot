---
name: openapi-scaffold
description: 'Generate server stubs and client SDKs from OpenAPI 3.x specs in any language — Express, FastAPI, ASP.NET, Spring Boot, Go, plus TypeScript/Python/Java/Go clients'
---

# OpenAPI Scaffold Skill

Generate server and client code from an OpenAPI 3.x specification.

## When to Use

- Starting API-first development from a spec
- Generating typed client SDKs for API consumers
- Scaffolding route handlers from an existing OpenAPI YAML/JSON
- Syncing server stubs after spec changes

## Rules

1. Read the OpenAPI spec FIRST — never generate code without a spec
2. Server stubs MUST include request validation middleware
3. Client SDKs MUST be fully typed (TypeScript types, Python dataclasses, etc.)
4. Generate one file per resource/tag — never a single monolith file
5. Include error handling for all defined error responses
6. Preserve existing handler implementations when re-generating stubs
7. Add JSDoc/docstrings from spec descriptions

## Steps

1. Read the OpenAPI spec file (YAML or JSON) and parse paths, schemas, and security schemes
2. Detect target language from project files (package.json → Express/Fastify, *.csproj → ASP.NET, go.mod → Go, etc.)
3. Generate route/controller stubs with request/response types from spec schemas
4. Generate shared types/models from `#/components/schemas`
5. Generate validation middleware using spec constraints (required, minLength, pattern, enum)
6. If client SDK requested: generate typed HTTP client with methods per operation
7. Wire routes into the project's existing router/startup configuration
8. Run build/compile to verify generated code is valid

## Reference

See `./templates/` for per-language stub templates.
