---
name: helm-charts
description: >
  Helm 4 chart templates and patterns. Includes Chart.yaml, values.yaml,
  _helpers.tpl, deployment, service, ingress, NOTES.txt, tests, hooks,
  values.schema.json, and OCI registry commands. Based on Helm 4.2.0.
  Used by @helm-engineer.
version: 1.0.0
---

# Helm Charts

## When to Use

- @helm-engineer creating or updating Helm charts
- Packaging a microservice for Kubernetes deployment
- Setting up chart dependencies, hooks, or schema validation

## Rules

1. Replace `{chart}`, `{app}`, `{port}` with actual values
2. Chart.yaml: `apiVersion: v2`, include maintainers, keywords, sources
3. Use `_helpers.tpl` for all label/name/selector templates — DRY
4. values.yaml: document every field with comments, group by resource type
5. Use `values.schema.json` for input validation (required fields, types, enums)
6. Include NOTES.txt with post-install instructions and access URLs
7. Chart tests: `templates/tests/test-connection.yaml` with `helm.sh/hook: test`
8. Hooks: use `helm.sh/hook-weight` for ordering, `hook-delete-policy: hook-succeeded`
9. OCI registry: push with `helm push {chart}-{version}.tgz oci://{registry}`
10. Sub-charts: use `condition:` in Chart.yaml dependencies for optional deps

## Steps

1. **Scaffold** — `helm create {chart}` or create manually with proper structure
2. **Define values** — `values.yaml` with all configurable fields + schema
3. **Create helpers** — `_helpers.tpl` with name, labels, selector templates
4. **Create templates** — deployment, service, ingress, hpa, pdb, serviceaccount
5. **Add hooks** — pre-install/upgrade migrations, post-install smoke tests
6. **Add tests** — connection test pod template
7. **Package** — `helm package .` and push to OCI registry
8. **Validate** — `helm lint`, `helm template . | kubectl apply --dry-run=client -f -`

## Chart Structure

```
{chart}/
├── Chart.yaml
├── Chart.lock
├── values.yaml
├── values.schema.json
├── templates/
│   ├── _helpers.tpl
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── ingress.yaml
│   ├── hpa.yaml
│   ├── serviceaccount.yaml
│   ├── NOTES.txt
│   ├── hooks/
│   │   └── pre-upgrade-migration.yaml
│   └── tests/
│       └── test-connection.yaml
└── charts/           (sub-chart dependencies)
```

## Reference

See [./templates/](./templates/) for complete Helm template files (Chart.yaml, values.yaml, _helpers.tpl, deployment, service, ingress, hooks).
