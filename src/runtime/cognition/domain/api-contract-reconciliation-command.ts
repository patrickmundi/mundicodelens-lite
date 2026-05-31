import { ApiClientInferenceService } from "./api-client-inference-service";

import { DjangoEndpointCognitionService } from "./django-endpoint-cognition-service";

import { ApiContractReconciliationService } from "./api-contract-reconciliation-service";

export interface ApiContractReconciliationCommandResult {
  success: boolean;
  diagnostics: string[];
}

export class ApiContractReconciliationCommand {
  execute(repositoryRoot: string): ApiContractReconciliationCommandResult {
    const diagnostics: string[] = [];

    console.log("");
    console.log("[MundiCodeLens CLI] Running API contract reconciliation...");
    console.log("");

    const apiInference = new ApiClientInferenceService();

    const inferredContracts = apiInference.inferFromComponents([
      "InvoiceTable",
      "InvoiceSummaryCard",
      "PaymentTable",
      "PaymentSummaryCard",
      "RevenueChart",
      "CollectionHealthWidget",
      "DebtExposureWidget",
    ]);

    const endpointCognition = new DjangoEndpointCognitionService();

    const discoveredEndpoints = endpointCognition.analyze(repositoryRoot);

    const reconciliation = new ApiContractReconciliationService();

    const result = reconciliation.reconcile(
      inferredContracts.clients,
      discoveredEndpoints.endpoints,
    );

    console.log("=== API Contract Reconciliation Report ===");

    console.log("");

    console.log(`Success: ${result.success}`);

    console.log("");

    console.log(`Findings: ${result.gaps.length}`);

    console.log("");

    console.log("Reconciliation Findings:");

    for (const gap of result.gaps) {
      console.log(`- ${gap.type}`);

      if (gap.inferredContract) {
        console.log(`  Contract: ${gap.inferredContract}`);
      }

      if (gap.discoveredEndpoint) {
        console.log(`  Endpoint: ${gap.discoveredEndpoint}`);
      }

      console.log(`  ${gap.description}`);

      console.log("");
    }

    console.log("Diagnostics:");

    for (const diagnostic of result.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    console.log("");

    console.log("[MundiCodeLens CLI] API contract reconciliation completed.");

    diagnostics.push(...result.diagnostics);

    return {
      success: true,
      diagnostics,
    };
  }
}
