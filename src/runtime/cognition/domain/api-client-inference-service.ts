export interface ApiClientDefinition {
  componentName: string;
  endpoint: string;
  method: string;
  clientMethod: string;
}

export interface ApiClientInferenceResult {
  success: boolean;
  clients: ApiClientDefinition[];
  diagnostics: string[];
}

export class ApiClientInferenceService {
  inferFromComponents(componentNames: string[]): ApiClientInferenceResult {
    const diagnostics: string[] = [];

    const clients: ApiClientDefinition[] = [];

    diagnostics.push("Starting API client inference.");

    for (const componentName of componentNames) {
      const client = this.inferClient(componentName);

      if (client) {
        clients.push(client);

        diagnostics.push(`Generated API client for ${componentName}.`);
      }
    }

    diagnostics.push(`Generated ${clients.length} API client(s).`);

    diagnostics.push("API client inference completed successfully.");

    return {
      success: true,
      clients,
      diagnostics,
    };
  }

  private inferClient(componentName: string): ApiClientDefinition | null {
    const mappings: Record<string, ApiClientDefinition> = {
      InvoiceTable: {
        componentName: "InvoiceTable",
        endpoint: "/api/finance/invoices/",
        method: "GET",
        clientMethod: "getInvoices",
      },

      InvoiceSummaryCard: {
        componentName: "InvoiceSummaryCard",
        endpoint: "/api/finance/invoices/summary/",
        method: "GET",
        clientMethod: "getInvoiceSummary",
      },

      PaymentTable: {
        componentName: "PaymentTable",
        endpoint: "/api/finance/payments/",
        method: "GET",
        clientMethod: "getPayments",
      },

      PaymentSummaryCard: {
        componentName: "PaymentSummaryCard",
        endpoint: "/api/finance/payments/summary/",
        method: "GET",
        clientMethod: "getPaymentSummary",
      },

      RevenueChart: {
        componentName: "RevenueChart",
        endpoint: "/api/finance/revenue/analytics/",
        method: "GET",
        clientMethod: "getRevenueAnalytics",
      },

      CollectionHealthWidget: {
        componentName: "CollectionHealthWidget",
        endpoint: "/api/finance/collection-health/",
        method: "GET",
        clientMethod: "getCollectionHealth",
      },

      DebtExposureWidget: {
        componentName: "DebtExposureWidget",
        endpoint: "/api/finance/debt-exposure/",
        method: "GET",
        clientMethod: "getDebtExposure",
      },
    };

    return mappings[componentName] ?? null;
  }
}
