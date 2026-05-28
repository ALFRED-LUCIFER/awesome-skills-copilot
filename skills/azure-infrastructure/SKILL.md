---
name: azure-infrastructure
description: >
  Bicep and Terraform templates for Azure infrastructure provisioning.
  Covers AKS, ACR, Container Apps, App Service, VNet, Key Vault,
  Application Insights, Storage, and Azure Developer CLI (azd) configuration.
  Managed identity patterns, private endpoints, RBAC, tagging, and naming conventions.
  Used by @azure-deployer.
version: 1.0.0
---

# Azure Infrastructure

## When to Use

- Provisioning Azure resources for a new microservice or environment
- @azure-deployer generating Bicep/Terraform IaC
- Setting up AKS, ACR, Container Apps, Key Vault, VNet, AppInsights

## Rules

1. Naming: `{project}-{env}-{resource-type}` (e.g. `myapp-prod-aks`)
2. Always tag resources: environment, project, managedBy, costCenter
3. Use managed identity (system-assigned preferred) — never service principal secrets
4. Private endpoints for all PaaS services (Key Vault, ACR, Storage, SQL)
5. RBAC over access policies — assign minimum required roles
6. AKS: enable Defender, Azure Policy, workload identity, OIDC issuer
7. Key Vault: RBAC mode, soft-delete enabled, purge protection on
8. VNet: /16 for hub, /24 subnets for AKS nodes, /27 for private endpoints
9. Application Insights: workspace-based, linked to Log Analytics
10. Use `azd` for local dev provisioning; Bicep modules for CI/CD pipelines

## Steps

1. **Define naming + tagging** — establish convention for all resources
2. **Create resource group** — with standard tags
3. **Deploy networking** — VNet, subnets, NSGs, private DNS zones
4. **Deploy identity** — managed identity, RBAC role assignments
5. **Deploy secrets** — Key Vault with private endpoint
6. **Deploy compute** — AKS cluster or Container Apps environment
7. **Deploy registry** — ACR with private endpoint, admin disabled
8. **Deploy observability** — Application Insights + Log Analytics workspace
9. **Deploy storage** — Storage account with private endpoint if needed
10. **Validate** — `az deployment group validate`, `terraform plan`

## Resource Checklist

| Resource | Bicep Module | Key Settings |
|----------|-------------|--------------|
| AKS | `modules/aks.bicep` | workloadIdentity, defender, policy addon |
| ACR | `modules/acr.bicep` | Premium SKU, private endpoint, no admin |
| Key Vault | `modules/keyvault.bicep` | RBAC, soft-delete, purge protection |
| VNet | `modules/network.bicep` | /16 address space, subnet delegation |
| AppInsights | `modules/monitoring.bicep` | Workspace-based |
| Container Apps | `modules/containerapp.bicep` | Managed environment, ingress, scaling |

## Reference

See [./templates/](./templates/) for complete Bicep modules, Terraform configs, and azd project structure.
