import { ApiClientInferenceService } from "./api-client-inference-service";

export interface ApiClientInferenceCommandResult {
  success: boolean;
  diagnostics: string[];
}

export class ApiClientInferenceCommand {
  execute(): ApiClientInferenceCommandResult {
    const diagnostics: string[] = [];

    console.log("");
    console.log("[MundiCodeLens CLI] Running API client inference...");
    console.log("");

    const service = new ApiClientInferenceService();

    const result = service.inferFromComponents([
      "InvoiceTable",
      "InvoiceSummaryCard",
      "PaymentTable",
      "PaymentSummaryCard",
      "RevenueChart",
      "CollectionHealthWidget",
      "DebtExposureWidget",
    ]);

    console.log("=== API Client Inference Report ===");

    console.log("");

    console.log(`Success: ${result.success}`);

    console.log("");

    console.log(`Generated Clients: ${result.clients.length}`);

    console.log("");

    console.log("Inferred API Clients:");

    for (const client of result.clients) {
      console.log(`- ${client.componentName}`);

      console.log(`  Endpoint: ${client.endpoint}`);

      console.log(`  Method: ${client.method}`);

      console.log(`  Client Method: ${client.clientMethod}`);

      console.log("");
    }

    console.log("Diagnostics:");

    for (const diagnostic of result.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    console.log("");

    console.log("[MundiCodeLens CLI] API client inference completed.");

    diagnostics.push(...result.diagnostics);

    return {
      success: result.success,
      diagnostics,
    };
  }
}
