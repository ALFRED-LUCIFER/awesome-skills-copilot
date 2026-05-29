---
name: error-handling-patterns
description: 'Standardized error handling patterns per language — Result types, error boundaries, middleware, problem details (RFC 9457), global exception handlers'
---

# Error Handling Patterns Skill

Apply consistent, stack-appropriate error handling across the codebase.

## When to Use

- Setting up global error handling in a new project
- Standardizing error responses across API endpoints
- Adding error boundaries to frontend applications
- Replacing ad-hoc try/catch with structured patterns

## Rules

1. API error responses MUST follow RFC 9457 (Problem Details) or equivalent structured format
2. NEVER expose stack traces or internal details to clients in production
3. NEVER swallow exceptions silently — always log or propagate
4. Use typed error classes/codes — never raw strings for error identification
5. Frontend: error boundaries at route level + per-feature level
6. Backend: global exception middleware as last resort — prefer explicit handling
7. Distinguish client errors (4xx / user-fixable) from server errors (5xx / ops-fixable)
8. Include correlation ID in every error response for debugging

## Steps

1. Detect project language and framework
2. Identify current error handling patterns (or lack thereof)
3. Implement global error handler (middleware/.NET, error handler/Express, exception handler/FastAPI)
4. Define standard error response shape per RFC 9457:
   ```json
   { "type": "uri", "title": "string", "status": 000, "detail": "string", "instance": "uri", "traceId": "string" }
   ```
5. Create typed error classes for domain errors (NotFound, Validation, Conflict, Unauthorized)
6. Add error boundary components (React: ErrorBoundary, Vue: onErrorCaptured)
7. Configure error logging — errors → ERROR level with full context, 4xx → WARN level
8. Wire up unhandled rejection/exception handlers for process-level safety

## Reference

See `./templates/` for per-framework error handling setups.
