---
description: "Security guardrails — OWASP Top 10 aligned checks for all code"
applyTo: "**/*.{cs,ts,tsx,json,yml,yaml}"
---

# Security Guardrails

## SEC-1: Input Validation
- Validate all inputs at system boundaries (controllers, API handlers)
- Use allowlists over denylists for input filtering
- Reject unexpected content types

## SEC-2: SQL Injection Prevention
- Use parameterized queries or ORM (EF Core LINQ)
- Never concatenate user input into SQL strings
- Review raw SQL queries in code reviews

## SEC-3: Authentication & Authorization
- Require authentication on all endpoints by default
- Use role-based or policy-based authorization
- Validate JWT tokens server-side

## SEC-4: Secrets Management
- Never hardcode secrets, API keys, or connection strings
- Use environment variables or secret managers
- Add patterns to `.gitignore` for sensitive files

## SEC-5: Dependency Security
- Require explicit user confirmation before adding packages
- Check for known vulnerabilities (npm audit, dotnet list package --vulnerable)
- Pin dependency versions in production

## SEC-6: XSS Prevention
- Sanitize HTML content before rendering
- Use framework-provided escaping (React auto-escapes JSX)
- Set Content-Security-Policy headers

## SEC-7: CSRF Protection
- Use anti-forgery tokens for state-changing operations
- Validate Origin and Referer headers
- Use SameSite cookie attribute

## SEC-8: Error Handling
- Never expose stack traces in production responses
- Log errors with structured logging (no PII)
- Return generic error messages to clients

## SEC-9: HTTPS
- Enforce HTTPS in all environments
- Use HSTS headers
- Redirect HTTP to HTTPS

## SEC-10: Logging
- Use structured logging with correlation IDs
- Never log passwords, tokens, or PII
- Log security-relevant events (auth failures, permission denials)
