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

# Azure Infrastructure Skill

IaC templates for Azure resource provisioning. Replace `{project}`, `{env}`, `{region}` with your values.

## Naming Convention

```
{project}-{env}-{resource-type}
Example: myapp-prod-aks, myapp-prod-acr, myapp-prod-kv
```

## Tagging Standard

```bicep
var commonTags = {
  environment: '{env}'
  project: '{project}'
  managedBy: 'bicep'
  costCenter: '{cost-center}'
}
```

---

## Bicep: AKS Cluster

```bicep
@description('AKS cluster for {project}')
param location string = resourceGroup().location
param clusterName string = '{project}-{env}-aks'
param nodeCount int = 3
param vmSize string = 'Standard_D4s_v5'
param kubernetesVersion string = '1.30'

resource aks 'Microsoft.ContainerService/managedClusters@2024-09-01' = {
  name: clusterName
  location: location
  tags: commonTags
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    kubernetesVersion: kubernetesVersion
    dnsPrefix: clusterName
    enableRBAC: true
    aadProfile: {
      managed: true
      enableAzureRBAC: true
    }
    networkProfile: {
      networkPlugin: 'azure'
      networkPolicy: 'calico'
      serviceCidr: '10.0.0.0/16'
      dnsServiceIP: '10.0.0.10'
    }
    agentPoolProfiles: [
      {
        name: 'system'
        count: nodeCount
        vmSize: vmSize
        mode: 'System'
        osType: 'Linux'
        enableAutoScaling: true
        minCount: 2
        maxCount: 10
        availabilityZones: ['1', '2', '3']
        vnetSubnetID: aksSubnet.id
      }
    ]
    addonProfiles: {
      omsagent: {
        enabled: true
        config: {
          logAnalyticsWorkspaceResourceID: logAnalytics.id
        }
      }
    }
    autoUpgradeProfile: {
      upgradeChannel: 'stable'
    }
  }
}
```

## Bicep: ACR (Container Registry)

```bicep
param acrName string = replace('{project}{env}acr', '-', '')
param acrSku string = 'Premium'

resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: acrName
  location: location
  tags: commonTags
  sku: {
    name: acrSku
  }
  properties: {
    adminUserEnabled: false  // Use managed identity instead
    publicNetworkAccess: 'Disabled'
    networkRuleBypassOptions: 'AzureServices'
  }
}

// Grant AKS pull access to ACR
resource acrPull 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(acr.id, aks.id, 'acrpull')
  scope: acr
  properties: {
    principalId: aks.properties.identityProfile.kubeletidentity.objectId
    roleDefinitionId: subscriptionResourceId('Microsoft.Authorization/roleDefinitions', '7f951dda-4ed3-4680-a7ca-43fe172d538d') // AcrPull
    principalType: 'ServicePrincipal'
  }
}
```

## Bicep: Key Vault

```bicep
param kvName string = '{project}-{env}-kv'

resource keyVault 'Microsoft.KeyVault/vaults@2023-07-01' = {
  name: kvName
  location: location
  tags: commonTags
  properties: {
    sku: {
      family: 'A'
      name: 'standard'
    }
    tenantId: subscription().tenantId
    enableRbacAuthorization: true
    enableSoftDelete: true
    softDeleteRetentionInDays: 90
    enablePurgeProtection: true
    publicNetworkAccess: 'Disabled'
    networkAcls: {
      defaultAction: 'Deny'
      bypass: 'AzureServices'
    }
  }
}
```

## Bicep: VNet + Subnets

```bicep
param vnetName string = '{project}-{env}-vnet'

resource vnet 'Microsoft.Network/virtualNetworks@2023-11-01' = {
  name: vnetName
  location: location
  tags: commonTags
  properties: {
    addressSpace: {
      addressPrefixes: ['10.0.0.0/8']
    }
    subnets: [
      {
        name: 'aks-subnet'
        properties: {
          addressPrefix: '10.240.0.0/16'
          privateEndpointNetworkPolicies: 'Disabled'
        }
      }
      {
        name: 'services-subnet'
        properties: {
          addressPrefix: '10.241.0.0/16'
          privateEndpointNetworkPolicies: 'Disabled'
        }
      }
      {
        name: 'endpoints-subnet'
        properties: {
          addressPrefix: '10.242.0.0/24'
          privateEndpointNetworkPolicies: 'Disabled'
        }
      }
    ]
  }
}

resource aksSubnet 'Microsoft.Network/virtualNetworks/subnets@2023-11-01' existing = {
  parent: vnet
  name: 'aks-subnet'
}
```

## Bicep: Application Insights

```bicep
resource logAnalytics 'Microsoft.OperationalInsights/workspaces@2023-09-01' = {
  name: '{project}-{env}-law'
  location: location
  tags: commonTags
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '{project}-{env}-ai'
  location: location
  tags: commonTags
  kind: 'web'
  properties: {
    Application_Type: 'web'
    WorkspaceResourceId: logAnalytics.id
  }
}
```

---

## Terraform: AKS Cluster

```hcl
resource "azurerm_kubernetes_cluster" "aks" {
  name                = "${var.project}-${var.env}-aks"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "${var.project}-${var.env}"
  kubernetes_version  = "1.30"
  tags                = local.common_tags

  identity {
    type = "SystemAssigned"
  }

  default_node_pool {
    name                = "system"
    node_count          = 3
    vm_size             = "Standard_D4s_v5"
    vnet_subnet_id      = azurerm_subnet.aks.id
    auto_scaling_enabled = true
    min_count           = 2
    max_count           = 10
    zones               = ["1", "2", "3"]
  }

  network_profile {
    network_plugin = "azure"
    network_policy = "calico"
    service_cidr   = "10.0.0.0/16"
    dns_service_ip = "10.0.0.10"
  }

  azure_active_directory_role_based_access_control {
    managed                = true
    azure_rbac_enabled     = true
  }

  oms_agent {
    log_analytics_workspace_id = azurerm_log_analytics_workspace.law.id
  }
}
```

---

## Azure Developer CLI (azd) Configuration

### azure.yaml

```yaml
name: {project}
metadata:
  template: {project}@0.0.1
services:
  api:
    project: ./src/api
    language: dotnet
    host: containerapp
  web:
    project: ./src/web
    language: ts
    host: containerapp
infra:
  provider: bicep
  path: ./infra
  module: main
```

### azd Commands

```bash
# Initialize project from template
azd init -t {template}

# Provision infrastructure + deploy app
azd up

# Deploy app only (after code changes)
azd deploy

# Provision infrastructure only (after IaC changes)
azd provision

# Show deployed resources
azd show

# Clean up all resources
azd down
```

---

## Validation Commands

```bash
# Bicep validation
az bicep build --file main.bicep
az deployment group what-if -g {rg} -f main.bicep -p parameters.{env}.json

# Terraform validation
terraform init
terraform validate
terraform plan -var-file={env}.tfvars

# Azure CLI deployment
az deployment group create \
  --resource-group {rg} \
  --template-file main.bicep \
  --parameters parameters.{env}.json \
  --confirm-with-what-if
```

## Security Checklist

| Check | Rule |
|-------|------|
| Managed Identity | All resources use system-assigned or user-assigned managed identity |
| No Admin Credentials | ACR admin disabled, AKS local accounts disabled |
| Private Endpoints | Key Vault, ACR, Storage all use private endpoints |
| Network Isolation | VNet with subnets, NSGs, no public IPs unless required |
| RBAC | Azure RBAC enabled, least-privilege role assignments |
| Encryption | All data encrypted at rest (platform default) and in transit (TLS 1.2+) |
| Diagnostics | All resources send logs to Log Analytics workspace |
| Tagging | All resources tagged with environment, project, owner, cost-center |
