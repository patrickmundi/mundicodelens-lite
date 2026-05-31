import { ApiClientInferenceService } from "./api-client-inference-service";

import { ApiClientGeneratorService } from "./api-client-generator-service";

import { ApiClientFileWriterService } from "./api-client-file-writer-service";

export interface ApiClientFileWriterCommandResult {
  success: boolean;
  diagnostics: string[];
}

export class ApiClientFileWriterCommand {
  execute(targetDirectory: string): ApiClientFileWriterCommandResult {
    const diagnostics: string[] = [];

    console.log("");
    console.log("[MundiCodeLens CLI] Running API client file generation...");
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

    const writerService = new ApiClientFileWriterService();

    const writerResult = writerService.writeFiles(
      targetDirectory,
      generationResult.files,
    );

    console.log("=== API Client File Generation Report ===");

    console.log("");

    console.log(`Success: ${writerResult.success}`);

    console.log("");

    console.log(`Files Written: ${writerResult.filesWritten.length}`);

    console.log("");

    console.log("Generated Files:");

    for (const file of writerResult.filesWritten) {
      console.log(`- ${file}`);
    }

    console.log("");

    console.log("Diagnostics:");

    for (const diagnostic of inferenceResult.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    for (const diagnostic of generationResult.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    for (const diagnostic of writerResult.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    console.log("");

    console.log("[MundiCodeLens CLI] API client file generation completed.");

    diagnostics.push(...inferenceResult.diagnostics);

    diagnostics.push(...generationResult.diagnostics);

    diagnostics.push(...writerResult.diagnostics);

    return {
      success: true,
      diagnostics,
    };
  }
}
