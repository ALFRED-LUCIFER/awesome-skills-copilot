---
name: authentication-patterns
description: 'OAuth2, JWT, OIDC, API key, and session-based authentication implementation patterns for any stack — middleware, token validation, refresh flows, RBAC'
---

# Authentication Patterns Skill

Implement production-ready authentication and authorization.

## When to Use

- Adding authentication to a new API or frontend
- Implementing OAuth2 / OIDC flows
- Setting up JWT validation middleware
- Adding role-based access control (RBAC)
- Implementing API key authentication

## Rules

1. NEVER store passwords in plain text — use bcrypt/argon2 with cost ≥ 12
2. JWT secrets MUST be ≥ 256 bits, stored in environment variables, NEVER in code
3. Access tokens: short-lived (15 min). Refresh tokens: long-lived (7-30 days), rotated on use
4. ALWAYS validate JWT signature, expiry, issuer, and audience — never trust payload blindly
5. RBAC: deny by default, grant explicitly — never allow by default
6. API keys: hash before storing, transmit via `Authorization` header, never query params
7. CSRF protection for cookie-based auth (SameSite=Strict + CSRF token)
8. Rate limit auth endpoints: max 5 failed attempts per IP per minute

## Steps

1. Detect project framework and existing auth setup
2. Choose auth strategy based on use case (SPA → OIDC/PKCE, API → JWT/API key, Server-rendered → Session)
3. Implement token/session middleware for the detected framework
4. Add route-level authorization decorators/guards
5. Implement token refresh flow (if JWT)
6. Add password hashing utility (if local auth)
7. Configure CORS for auth endpoints
8. Add auth-related tests (valid token, expired token, missing token, wrong role)

## Reference

See `./templates/` for per-framework auth middleware patterns.
