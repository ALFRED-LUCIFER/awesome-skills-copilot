---
name: rate-limiting
description: 'Rate limiting, throttling, and circuit breaker patterns — token bucket, sliding window, bulkhead isolation, and retry-with-backoff for APIs and microservices'
---

# Rate Limiting Skill

Protect APIs from abuse and cascading failures with rate limiting and resilience patterns.

## When to Use

- Adding rate limiting to public or internal APIs
- Implementing circuit breakers for downstream service calls
- Adding retry logic with exponential backoff
- Preventing cascade failures in microservice architectures

## Rules

1. Rate limit at the edge (API gateway/reverse proxy) AND application level
2. Return `429 Too Many Requests` with `Retry-After` header
3. Use sliding window or token bucket — never simple counters (they allow bursts at window edges)
4. Different limits per tier: anonymous < authenticated < premium
5. Circuit breaker states: Closed → Open (after N failures) → Half-Open (probe) → Closed
6. Retry: exponential backoff with jitter — never fixed intervals
7. Bulkhead: isolate critical paths — failure in one feature shouldn't affect others
8. ALWAYS return meaningful error messages with rate limit headers (X-RateLimit-Remaining, X-RateLimit-Reset)

## Steps

1. Identify endpoints needing protection (auth, write operations, expensive queries)
2. Define rate limit policy: requests per window per identity (IP, user, API key)
3. Choose storage: in-memory (single instance) or Redis (distributed)
4. Implement rate limiting middleware for the project's framework
5. Add rate limit response headers to all responses
6. Implement circuit breaker for outbound HTTP calls to downstream services
7. Add retry with exponential backoff + jitter for transient failures
8. Add monitoring: rate limit hit count, circuit breaker state changes, retry rates

## Reference

See `./templates/` for rate limiting middleware and circuit breaker implementations.
