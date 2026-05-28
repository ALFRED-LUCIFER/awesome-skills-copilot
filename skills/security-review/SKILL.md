---
name: security-review
description: AI-powered codebase security review — extracts GUARDRAILS SEC-1–24 into actionable scan patterns for .NET and React codebases. Covers OWASP Top 10, injection, auth, secrets, and supply chain.
---

# Security Review Skill

Structured security audit for your project codebases. Use this skill when performing a dedicated security review or when @reviewer flags security concerns.

## Scope

Applies to `.cs`, `.ts`, `.tsx`, `.json`, `.csproj`, `package.json`, `Dockerfile`, and config files.

## SEC Checklist (from GUARDRAILS § 10)

### Input Validation (SEC-1 to SEC-4)

| ID | Check | .NET Pattern | React Pattern |
|----|-------|-------------|---------------|
| SEC-1 | SQL injection | Parameterized queries only — no string concat in EF/raw SQL | N/A |
| SEC-2 | XSS | `HtmlEncoder` on user output | No `dangerouslySetInnerHTML` unless sanitized with DOMPurify |
| SEC-3 | Path traversal | `Path.GetFullPath()` + verify within allowed root | No user-controlled `import()` or `require()` paths |
| SEC-4 | Mass assignment | DTO mapping only (no `[Bind]` on entity) — use AutoMapper `CreateMap<DTO, Entity>` | Controlled form fields via `react-hook-form` schema |

### Authentication & Authorization (SEC-5 to SEC-8)

| ID | Check | Pattern |
|----|-------|---------|
| SEC-5 | Missing `[Authorize]` | Every controller must have `[Authorize]` or explicit `[AllowAnonymous]` |
| SEC-6 | Role validation | `[Authorize(Roles = "...")]` or policy-based — never roll your own |
| SEC-7 | Token exposure | Tokens never logged, never in URL query strings |
| SEC-8 | CORS | Explicit origins only — no `AllowAnyOrigin()` in production |

### Data Protection (SEC-9 to SEC-12)

| ID | Check | Pattern |
|----|-------|---------|
| SEC-9 | Secrets in code | No hardcoded passwords, keys, connection strings (use env/KeyVault) |
| SEC-10 | PII logging | Never log user emails, names, IPs, or session tokens |
| SEC-11 | HTTPS only | `UseHttpsRedirection()` + `[RequireHttps]` on controllers |
| SEC-12 | Sensitive headers | `X-Content-Type-Options`, `X-Frame-Options`, `Strict-Transport-Security` |

### Dependency & Supply Chain (SEC-13 to SEC-16)

| ID | Check | Pattern |
|----|-------|---------|
| SEC-13 | Known vulnerabilities | Run `dotnet list package --vulnerable` / `npm audit` |
| SEC-14 | Outdated packages | Flag packages >2 major versions behind |
| SEC-15 | Lock files | `package-lock.json` and `packages.lock.json` must be committed |
| SEC-16 | No wildcard versions | Pin exact versions — no `*`, `latest`, or `>=` |

### Error Handling & Logging (SEC-17 to SEC-20)

| ID | Check | Pattern |
|----|-------|---------|
| SEC-17 | Stack traces in response | Never return exception details to client — use `ProblemDetails` |
| SEC-18 | Catch-all handlers | Global exception middleware must exist |
| SEC-19 | Structured logging | Use `ILogger<T>` — no `Console.WriteLine` |
| SEC-20 | Error swallowing | No empty `catch {}` blocks |

### Infrastructure (SEC-21 to SEC-24)

| ID | Check | Pattern |
|----|-------|---------|
| SEC-21 | Debug mode in prod | No `app.UseDeveloperExceptionPage()` without `IsDevelopment()` check |
| SEC-22 | Dockerfile hardening | Non-root user, multi-stage build, no secrets in layers |
| SEC-23 | Health endpoints | `/health` and `/ready` must not expose internal state |
| SEC-24 | Rate limiting | API endpoints should have rate limiting or throttling middleware |

## Output Format

```markdown
### Security Review Report

| Severity | ID | File | Line | Finding | Fix |
|----------|-----|------|------|---------|-----|
| 🔴 Critical | SEC-X | path | N | description | suggested fix |
| 🟠 High | SEC-X | path | N | description | suggested fix |
| 🟡 Medium | SEC-X | path | N | description | suggested fix |

**Score**: X/24 checks passed
**Verdict**: PASS (≥20) | WARN (15-19) | FAIL (<15)
```
