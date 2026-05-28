# security-review

> AI-powered codebase security review — GUARDRAILS SEC-1–24 scan patterns for .NET and React. Covers OWASP Top 10.

## Purpose

Performs a comprehensive security scan of the codebase against all 24 SEC checks defined in GUARDRAILS. Covers OWASP Top 10 categories with specific scan patterns for both .NET and React code.

## When to Use

- `@reviewer --security` mode
- Dedicated security reviews before release
- Post-implementation security audit
- Compliance verification

## SEC Check Categories (24 checks)

| Category | Checks | Focus |
|----------|--------|-------|
| Input Validation | SEC-1–4 | SQL injection, XSS, path traversal, command injection |
| Authentication | SEC-5–8 | Auth bypass, token handling, session management, RBAC |
| Data Protection | SEC-9–12 | Secrets in code, PII exposure, encryption, logging sensitive data |
| Supply Chain | SEC-13–16 | Vulnerable packages, typosquatting, license compliance, pinned versions |
| Error Handling | SEC-17–20 | Stack trace exposure, generic errors, error logging, fail-open patterns |
| Infrastructure | SEC-21–24 | CORS, CSP headers, HTTPS enforcement, rate limiting |

## Tools Used

- `dotnet list package --vulnerable`
- `npm audit`
- `grep` pattern scanning

## Used By

- `@reviewer` agent (security mode)
