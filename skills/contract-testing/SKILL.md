---
name: contract-testing
description: 'Consumer-driven contract testing with Pact, Dredd, or Schemathesis — verify API compatibility between producer and consumer services'
---

# Contract Testing Skill

Verify API contracts between services to prevent breaking changes.

## When to Use

- Multiple services communicate via REST/gRPC/messaging
- API changes risk breaking downstream consumers
- Testing microservice integration without full E2E environment
- Verifying OpenAPI spec matches actual behavior

## Rules

1. Consumers define contracts (what they need) — producers verify they satisfy them
2. Contract tests run in CI — MUST block merges that break contracts
3. Contracts test SHAPE (schema, status codes) not BEHAVIOR (business logic)
4. Version contracts alongside the consumer code
5. Provider verification runs against a real (or closely mocked) provider instance
6. Pact Broker or equivalent for sharing contracts between teams
7. NEVER test implementation details — only the public API surface

## Steps

1. Identify service boundaries and API dependencies (who calls whom)
2. Choose tool: Pact (REST/messaging), Dredd (OpenAPI validation), Schemathesis (fuzz from spec)
3. Write consumer contract tests: define expected request → expected response shape
4. Publish contracts to Pact Broker or shared artifact store
5. Write provider verification: load contracts → replay against real provider → verify responses match
6. Add contract tests to CI pipeline: consumer PR → publish contract; provider PR → verify contracts
7. Set up can-i-deploy check before production deployments
8. Add webhook notifications for contract verification failures

## Reference

See `./templates/` for Pact consumer/provider test examples in TypeScript and C#.
