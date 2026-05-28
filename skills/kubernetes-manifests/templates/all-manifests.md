---
name: kubernetes-manifests
description: >
  Production-ready Kubernetes manifest templates for Deployment, Service, Ingress,
  HPA, PDB, NetworkPolicy, RBAC, ConfigMap, Secret, and Kustomize overlays.
  Based on Kubernetes 2026 best practices — pod security standards, topology spread,
  graceful shutdown, resource management. Used by @k8s-deployer.
version: 1.0.0
---

# Kubernetes Manifests Skill

Production-ready K8s manifest templates following Kubernetes 2026 best practices. Replace `{app}`, `{namespace}`, `{image}`, `{port}` with your values.

## Namespace

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: {namespace}
  labels:
    app.kubernetes.io/part-of: {app}
    pod-security.kubernetes.io/enforce: restricted
    pod-security.kubernetes.io/audit: restricted
    pod-security.kubernetes.io/warn: restricted
```

## ServiceAccount + RBAC

```yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: {app}-sa
  namespace: {namespace}
  labels:
    app.kubernetes.io/name: {app}
automountServiceAccountToken: false
---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: {app}-role
  namespace: {namespace}
rules:
  - apiGroups: [""]
    resources: ["configmaps", "secrets"]
    verbs: ["get", "list", "watch"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: {app}-rolebinding
  namespace: {namespace}
subjects:
  - kind: ServiceAccount
    name: {app}-sa
roleRef:
  kind: Role
  name: {app}-role
  apiGroup: rbac.authorization.k8s.io
```

## ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: {app}-config
  namespace: {namespace}
  labels:
    app.kubernetes.io/name: {app}
data:
  APP_ENV: "production"
  LOG_LEVEL: "info"
  # Add application-specific config here
```

## Secret (use external-secrets-operator in production)

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: {app}-secrets
  namespace: {namespace}
  labels:
    app.kubernetes.io/name: {app}
type: Opaque
stringData:
  # NEVER commit real secrets — use sealed-secrets or external-secrets-operator
  DB_PASSWORD: "REPLACE_WITH_EXTERNAL_SECRET_REF"
```

## Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {app}
  namespace: {namespace}
  labels:
    app.kubernetes.io/name: {app}
    app.kubernetes.io/version: "1.0.0"
    app.kubernetes.io/managed-by: kubectl
spec:
  replicas: 2
  revisionHistoryLimit: 5
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app.kubernetes.io/name: {app}
  template:
    metadata:
      labels:
        app.kubernetes.io/name: {app}
    spec:
      serviceAccountName: {app}-sa
      automountServiceAccountToken: false
      terminationGracePeriodSeconds: 30
      securityContext:
        runAsNonRoot: true
        runAsUser: 1000
        runAsGroup: 1000
        fsGroup: 1000
        seccompProfile:
          type: RuntimeDefault
      topologySpreadConstraints:
        - maxSkew: 1
          topologyKey: kubernetes.io/hostname
          whenUnsatisfiable: DoNotSchedule
          labelSelector:
            matchLabels:
              app.kubernetes.io/name: {app}
      containers:
        - name: {app}
          image: {image}
          imagePullPolicy: IfNotPresent
          ports:
            - name: http
              containerPort: {port}
              protocol: TCP
          envFrom:
            - configMapRef:
                name: {app}-config
            - secretRef:
                name: {app}-secrets
          securityContext:
            allowPrivilegeEscalation: false
            readOnlyRootFilesystem: true
            capabilities:
              drop: ["ALL"]
          resources:
            requests:
              cpu: 100m
              memory: 128Mi
            limits:
              cpu: 500m
              memory: 512Mi
          startupProbe:
            httpGet:
              path: /healthz
              port: http
            initialDelaySeconds: 5
            periodSeconds: 5
            failureThreshold: 30
          livenessProbe:
            httpGet:
              path: /healthz
              port: http
            periodSeconds: 15
            timeoutSeconds: 3
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /ready
              port: http
            periodSeconds: 10
            timeoutSeconds: 3
            failureThreshold: 3
          volumeMounts:
            - name: tmp
              mountPath: /tmp
      volumes:
        - name: tmp
          emptyDir: {}
```

## Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: {app}
  namespace: {namespace}
  labels:
    app.kubernetes.io/name: {app}
spec:
  type: ClusterIP
  ports:
    - name: http
      port: 80
      targetPort: http
      protocol: TCP
  selector:
    app.kubernetes.io/name: {app}
```

## Ingress (nginx)

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: {app}
  namespace: {namespace}
  labels:
    app.kubernetes.io/name: {app}
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/force-ssl-redirect: "true"
    nginx.ingress.kubernetes.io/proxy-body-size: "10m"
spec:
  ingressClassName: nginx
  tls:
    - hosts:
        - {host}
      secretName: {app}-tls
  rules:
    - host: {host}
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: {app}
                port:
                  name: http
```

## HPA (Horizontal Pod Autoscaler)

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: {app}
  namespace: {namespace}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: {app}
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300
      policies:
        - type: Pods
          value: 1
          periodSeconds: 60
    scaleUp:
      stabilizationWindowSeconds: 60
      policies:
        - type: Pods
          value: 2
          periodSeconds: 60
```

## PodDisruptionBudget

```yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: {app}
  namespace: {namespace}
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app.kubernetes.io/name: {app}
```

## NetworkPolicy (default-deny + allow)

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: default-deny-all
  namespace: {namespace}
spec:
  podSelector: {}
  policyTypes:
    - Ingress
    - Egress
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: {app}-allow
  namespace: {namespace}
spec:
  podSelector:
    matchLabels:
      app.kubernetes.io/name: {app}
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - namespaceSelector:
            matchLabels:
              kubernetes.io/metadata.name: ingress-nginx
      ports:
        - protocol: TCP
          port: {port}
  egress:
    - to: []  # Allow all egress — restrict as needed
```

## ResourceQuota

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: {namespace}-quota
  namespace: {namespace}
spec:
  hard:
    requests.cpu: "4"
    requests.memory: 8Gi
    limits.cpu: "8"
    limits.memory: 16Gi
    pods: "20"
```

## Kustomize Structure

```
k8s/
├── base/
│   ├── kustomization.yaml
│   ├── namespace.yaml
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── hpa.yaml
│   ├── pdb.yaml
│   └── networkpolicy.yaml
├── overlays/
│   ├── staging/
│   │   ├── kustomization.yaml
│   │   └── patches/
│   │       └── replicas.yaml
│   └── production/
│       ├── kustomization.yaml
│       └── patches/
│           ├── replicas.yaml
│           └── resources.yaml
```

### base/kustomization.yaml

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - namespace.yaml
  - deployment.yaml
  - service.yaml
  - hpa.yaml
  - pdb.yaml
  - networkpolicy.yaml
commonLabels:
  app.kubernetes.io/name: {app}
```

### overlays/production/kustomization.yaml

```yaml
apiVersion: kustomize.config.k8s.io/v1beta1
kind: Kustomization
resources:
  - ../../base
patches:
  - path: patches/replicas.yaml
  - path: patches/resources.yaml
namespace: {namespace}-prod
```

## Validation Commands

```bash
# Dry-run validation
kubectl apply --dry-run=client -f k8s/base/

# Kustomize build + validate
kubectl kustomize k8s/overlays/staging/ | kubectl apply --dry-run=client -f -

# Schema validation with kubeval
kubeval k8s/base/*.yaml --kubernetes-version 1.30.0

# Best practice scoring
kube-score score k8s/base/*.yaml
```
