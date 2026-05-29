---
name: caching-patterns
description: 'Redis, in-memory, and CDN caching strategies with cache invalidation patterns — cache-aside, write-through, write-behind, and cache stampede prevention'
---

# Caching Patterns Skill

Implement effective caching with proper invalidation strategies.

## When to Use

- Adding caching to reduce database load or API latency
- Choosing between Redis, in-memory, or CDN caching
- Implementing cache invalidation strategies
- Preventing cache stampede / thundering herd

## Rules

1. Cache is NOT a database — data MUST survive cache eviction
2. ALWAYS set TTL — no infinite caches (max 24h for mutable data)
3. Cache keys MUST include version/tenant context to prevent cross-contamination
4. Use cache-aside (lazy loading) by default — simplest and safest
5. Invalidate on write — never rely solely on TTL for consistency
6. NEVER cache user-specific data in shared CDN caches
7. Monitor cache hit ratio — below 80% means wrong caching strategy
8. Implement circuit breaker for cache backend — app MUST work without cache

## Steps

1. Identify cacheable data (read-heavy, rarely changing, expensive to compute)
2. Choose caching layer (L1: in-process, L2: distributed/Redis, L3: CDN)
3. Implement cache-aside pattern: check cache → miss → fetch from source → store in cache
4. Add cache invalidation on write operations (delete or update cache entry)
5. Set appropriate TTL based on data freshness requirements
6. Add cache stampede protection (mutex/lock for expensive computations)
7. Add cache health metrics (hit rate, miss rate, eviction rate, latency)
8. Test: cold cache behavior, invalidation correctness, TTL expiry

## Reference

See `./templates/` for Redis, Node.js, and .NET caching implementations.
