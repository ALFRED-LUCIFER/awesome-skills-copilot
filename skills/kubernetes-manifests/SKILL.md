---
name: kubernetes-manifests
description: >
  Production-ready Kubernetes manifest templates for Deployment, Service, Ingress,
  HPA, PDB, NetworkPolicy, RBAC, ConfigMap, Secret, and Kustomize overlays.
  Based on Kubernetes 2026 best practices — pod security standards, topology spread,
  graceful shutdown, resource management. Used by @k8s-deployer.
version: 1.0.0
---

# Kubernetes Manifests

## When to Use

- Deploying a new microservice to Kubernetes
- Adding production hardening (HPA, PDB, NetworkPolicy, RBAC)
- Setting up Kustomize base/overlay structure
- @k8s-deployer needs manifest templates

## Rules

1. Replace `{app}`, `{namespace}`, `{image}`, `{port}`, `{host}` with actual values
2. Always use `pod-security.kubernetes.io/enforce: restricted` on namespaces
3. Never commit real secrets — use external-secrets-operator or sealed-secrets
4. Set `runAsNonRoot: true`, `readOnlyRootFilesystem: true`, drop ALL capabilities
5. Always include startup + liveness + readiness probes
6. Set resource requests AND limits on every container
7. Use `topologySpreadConstraints` for HA across nodes
8. Include PDB with `minAvailable: 1` for every Deployment with replicas > 1
9. Default-deny NetworkPolicy + explicit allow rules per app
10. Use Kustomize overlays for environment-specific config (staging/prod)

## Steps

1. **Create namespace** — with restricted pod security labels
2. **Create ServiceAccount + RBAC** — least-privilege Role, automountServiceAccountToken: false
3. **Create ConfigMap/Secret** — app config (never real secrets in manifests)
4. **Create Deployment** — security context, probes, resources, topology spread, graceful shutdown
5. **Create Service** — ClusterIP targeting deployment pods
6. **Create Ingress** — TLS, nginx annotations, host routing
7. **Create HPA** — CPU/memory targets, scale-down stabilization
8. **Create PDB** — minAvailable for rolling updates
9. **Create NetworkPolicy** — default-deny + app-specific allow
10. **Validate** — `kubectl apply --dry-run=client`, `kubeval`, `kube-score`

## Kustomize Structure

```
k8s/
├── base/          (namespace, deployment, service, hpa, pdb, networkpolicy)
│   └── kustomization.yaml
└── overlays/
    ├── staging/   (patches: lower replicas/resources)
    └── production/ (patches: higher replicas/resources)
```

## Reference

See [./templates/](./templates/) for complete YAML manifests for each resource type.
