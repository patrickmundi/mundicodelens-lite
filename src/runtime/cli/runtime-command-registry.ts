export interface RuntimeCommandDefinition {
  name: string;
  description: string;
}

export const runtimeCommands: RuntimeCommandDefinition[] = [
  {
    name: "scan",
    description: "Build repository graph",
  },

  {
    name: "impact",
    description: "Analyze dependency impact",
  },

  {
    name: "validate",
    description: "Validate architecture governance",
  },

  {
    name: "watch",
    description: "Start live repository watcher",
  },

  {
    name: "mutate",
    description: "Execute mutation runtime",
  },

  {
    name: "runtime:scan",
    description: "Run repository cognition scan",
  },

  {
    name: "runtime:dry-run",
    description: "Run autonomous dry-run simulation",
  },

  {
    name: "runtime:suggest",
    description: "Generate engineering suggestions",
  },

  {
    name: "runtime:django-cognition",
    description: "Analyze Django business topology",
  },

  {
    name: "runtime:django-endpoints",
    description: "Discover Django routes and endpoints",
  },

  {
    name: "runtime:infer-dashboards",
    description: "Infer dashboard architecture",
  },

  {
    name: "runtime:finance-cognition",
    description: "Analyze finance business domain",
  },

  {
    name: "runtime:infer-api-clients",
    description: "Infer API contracts from components",
  },

  {
    name: "runtime:generate-api-clients",
    description: "Generate API client definitions",
  },

  {
    name: "runtime:write-api-clients",
    description: "Generate physical API client files",
  },

  {
    name: "runtime:generate-components",
    description: "Generate frontend component scaffolds",
  },

  {
    name: "runtime:write-components",
    description: "Generate physical component files",
  },

  {
    name: "runtime:reconcile-api-contracts",
    description: "Compare inferred APIs with Django endpoints",
  },

  {
    name: "runtime:semantic-endpoints",
    description: "Semantically match inferred APIs to Django endpoints",
  },

  {
    name: "runtime:drf-cognition",
    description: "Discover Django REST Framework routers and ViewSets",
  },
];
