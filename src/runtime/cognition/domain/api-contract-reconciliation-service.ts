import { ApiClientDefinition } from "./api-client-inference-service";

import { DjangoEndpoint } from "./django-endpoint-cognition-service";

export interface ApiContractGap {
  type: "missing-endpoint" | "unmapped-endpoint";

  inferredContract?: string;

  discoveredEndpoint?: string;

  description: string;
}

export interface ApiContractReconciliationResult {
  success: boolean;
  gaps: ApiContractGap[];
  diagnostics: string[];
}

export class ApiContractReconciliationService {
  reconcile(
    inferredContracts: ApiClientDefinition[],
    discoveredEndpoints: DjangoEndpoint[],
  ): ApiContractReconciliationResult {
    const diagnostics: string[] = [];

    const gaps: ApiContractGap[] = [];

    diagnostics.push("Starting API contract reconciliation.");

    const discoveredRoutes = discoveredEndpoints.map(
      (endpoint) => endpoint.route,
    );

    for (const contract of inferredContracts) {
      const inferredRoute = this.normalizeRoute(contract.endpoint);

      const match = discoveredRoutes.some(
        (route) =>
          this.normalizeRoute(route).includes(inferredRoute) ||
          inferredRoute.includes(this.normalizeRoute(route)),
      );

      if (!match) {
        gaps.push({
          type: "missing-endpoint",

          inferredContract: contract.endpoint,

          description: `No Django endpoint found for ${contract.endpoint}`,
        });

        diagnostics.push(`Missing endpoint: ${contract.endpoint}`);
      }
    }

    for (const endpoint of discoveredEndpoints) {
      const normalizedEndpoint = this.normalizeRoute(endpoint.route);

      const match = inferredContracts.some(
        (contract) =>
          this.normalizeRoute(contract.endpoint).includes(normalizedEndpoint) ||
          normalizedEndpoint.includes(this.normalizeRoute(contract.endpoint)),
      );

      if (!match) {
        gaps.push({
          type: "unmapped-endpoint",

          discoveredEndpoint: endpoint.route,

          description: `No inferred contract mapped to ${endpoint.route}`,
        });

        diagnostics.push(`Unmapped endpoint: ${endpoint.route}`);
      }
    }

    diagnostics.push(`Generated ${gaps.length} reconciliation finding(s).`);

    diagnostics.push("API contract reconciliation completed successfully.");

    return {
      success: true,
      gaps,
      diagnostics,
    };
  }

  private normalizeRoute(route: string): string {
    return route
      .replace(/^\/+/, "")
      .replace(/\/+$/, "")
      .replace(/^api\//, "")
      .replace(/^finance\//, "")
      .toLowerCase();
  }
}
