---
name: load-testing
description: 'Generate k6, Artillery, or Locust load test scripts — ramp profiles, thresholds, scenario modeling, and CI integration for performance validation'
---

# Load Testing Skill

Generate and run load tests to validate performance under stress.

## When to Use

- Validating API performance before release
- Establishing performance baselines
- Testing auto-scaling behavior
- Identifying breaking points and resource limits

## Rules

1. ALWAYS establish a baseline before load testing (single-user response times)
2. Ramp up gradually — never spike from 0 to max load
3. Define pass/fail thresholds BEFORE running tests (p95 latency, error rate)
4. Use realistic data and scenarios — not just one endpoint repeatedly
5. Run against a production-like environment — never against dev/local
6. Coordinate with ops/infra team — load tests can trigger alerts
7. Clean up test data after load test runs

## Steps

1. Identify critical user journeys and API endpoints to test
2. Choose tool: k6 (JavaScript, best for CI), Artillery (YAML, quick), Locust (Python, complex scenarios)
3. Create load test script with scenarios:
   - Smoke test: 1 VU, verify basic functionality
   - Load test: expected traffic (e.g., 100 VUs, 10 min)
   - Stress test: 2x expected traffic, find breaking point
   - Soak test: expected traffic for extended duration (1h+)
4. Define thresholds: `p95 < 500ms`, `error_rate < 0.01`, `throughput > 100 rps`
5. Add test data: CSV files or dynamic generation for realistic payloads
6. Configure CI integration (run smoke test on every PR, load test nightly)
7. Generate report with charts (latency over time, throughput, error rate)
8. Document results and compare against baseline/SLOs

## Reference

See `./templates/` for k6, Artillery, and Locust script templates.
