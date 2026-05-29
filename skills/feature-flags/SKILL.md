---
name: feature-flags
description: 'Feature flag implementation patterns — LaunchDarkly, Unleash, Flagsmith, or custom boolean/percentage/user-targeted flags with gradual rollout and kill switches'
---

# Feature Flags Skill

Implement feature flags for safe, gradual rollouts and instant kill switches.

## When to Use

- Rolling out new features gradually (percentage-based)
- A/B testing with feature variants
- Adding kill switches for risky deployments
- Decoupling deployment from release (deploy dark, enable later)

## Rules

1. Flags MUST have a defined lifecycle: temporary (remove after rollout) or permanent (ops toggle)
2. Flag naming: `feature.{domain}.{name}` (e.g., `feature.checkout.newPaymentFlow`)
3. Default to OFF for new features — explicitly enable
4. Every temporary flag MUST have a removal date / ticket
5. Flag evaluation MUST be fast (<5ms) — cache flag state locally
6. NEVER use flags for authorization — use RBAC instead
7. Clean up old flags aggressively — tech debt grows with flag count
8. Log flag evaluations for debugging: `flag={name} value={on/off} user={id}`

## Steps

1. Choose flag provider: LaunchDarkly, Unleash, Flagsmith, or custom (env var / database)
2. Install SDK and initialize client at application startup
3. Create flag evaluation wrapper: `isEnabled(flagName, context)` → boolean
4. Implement flag types: boolean, percentage rollout, user-targeted, variant (A/B)
5. Add flag checks at feature boundaries (not deep in business logic)
6. Create admin UI or CLI for flag management (if custom implementation)
7. Add flag cleanup linter: detect flags older than 30 days without evaluation
8. Add tests: test both flag-on AND flag-off code paths

## Reference

See `./templates/` for custom flag implementations and provider SDK patterns.
