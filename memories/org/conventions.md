# Org-Wide Conventions

> Patterns and conventions discovered across all Copilot Agent System projects.
> Agents should check this file before proposing architectural decisions.

## Naming

- Microservice repos: `ng-app-{domain}-{layer}` (e.g., `ng-app-rackmanagement-frontend`)
- Entity names: PascalCase, singular (e.g., `OrderItem`, not `OrderItems`)
- Controller routes: kebab-case plural (e.g., `/api/order-items`)

## Architecture

- Backend: .NET 10, Clean Architecture (Controller → Service → Repository)
- Frontend: React 19 + TypeScript + MUI 7, useXxxController pattern
- DB: PostgreSQL with EF Core, multi-tenant via TenantId
- Messaging: RabbitMQ for inter-service communication

## Quality Standards

- Backend coverage: 95% minimum
- Frontend coverage: 90% minimum
- Every PR must pass review agent (score ≥ 5/10)
- E2E: Cypress 13 with POM pattern

---
*Updated by developers via PR to awesome-skills-copilot. Agents reference but do not modify.*
