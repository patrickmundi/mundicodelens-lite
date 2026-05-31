import { ApiClientInferenceService } from "./api-client-inference-service";

import { ApiClientGeneratorService } from "./api-client-generator-service";

export interface ApiClientGeneratorCommandResult {
  success: boolean;
  diagnostics: string[];
}

export class ApiClientGeneratorCommand {
  execute(): ApiClientGeneratorCommandResult {
    const diagnostics: string[] = [];

    console.log("");
    console.log("[MundiCodeLens CLI] Running API client generation...");
    console.log("");

    const inferenceService = new ApiClientInferenceService();

    const inferenceResult = inferenceService.inferFromComponents([
      "InvoiceTable",
      "InvoiceSummaryCard",
      "PaymentTable",
      "PaymentSummaryCard",
      "RevenueChart",
      "CollectionHealthWidget",
      "DebtExposureWidget",
    ]);

    const generatorService = new ApiClientGeneratorService();

    const generationResult = generatorService.generateClients(
      inferenceResult.clients,
    );

    console.log("=== API Client Generation Report ===");

    console.log("");

    console.log(`Success: ${generationResult.success}`);

    console.log("");

    console.log(`Generated Files: ${generationResult.files.length}`);

    console.log("");

    console.log("Generated API Client Files:");

    for (const file of generationResult.files) {
      console.log(`- ${file.fileName}`);
    }

    console.log("");

    console.log("Diagnostics:");

    for (const diagnostic of inferenceResult.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    for (const diagnostic of generationResult.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    console.log("");

    console.log("[MundiCodeLens CLI] API client generation completed.");

    diagnostics.push(...inferenceResult.diagnostics);

    diagnostics.push(...generationResult.diagnostics);

    return {
      success: true,
      diagnostics,
    };
  }
}
