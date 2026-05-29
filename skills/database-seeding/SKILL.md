---
name: database-seeding
description: 'Test data generation patterns — seed scripts, faker factories, fixture files, and deterministic test data for any database and ORM'
---

# Database Seeding Skill

Generate realistic test data for development, testing, and demos.

## When to Use

- Setting up development database with realistic data
- Creating test fixtures for integration tests
- Generating demo data for presentations
- Populating staging environments

## Rules

1. Seed data MUST be idempotent — running twice produces the same result
2. Use deterministic seeds for reproducibility in tests (fixed faker seed)
3. NEVER use production data for seeding — generate synthetic data
4. Respect referential integrity — seed parent records before children
5. Include edge cases in seed data (empty strings, max length, unicode, null optionals)
6. Seed scripts MUST be reversible (provide a clean/reset script)
7. NEVER seed passwords in plain text — use pre-hashed values

## Steps

1. Identify entities and their relationships from schema/models
2. Determine topological order for seeding (parents → children)
3. Create a factory/builder per entity with realistic defaults using faker
4. Generate seed data with configurable volume (small=10, medium=100, large=1000 per entity)
5. Create seed runner script that's callable from CLI (`npm run seed`, `dotnet run seed`)
6. Create reset script to truncate/drop and re-seed
7. Add seed data validation (foreign keys resolve, enums are valid)
8. Document seed users/credentials for development login

## Reference

See `./templates/` for faker factory patterns per ecosystem.
