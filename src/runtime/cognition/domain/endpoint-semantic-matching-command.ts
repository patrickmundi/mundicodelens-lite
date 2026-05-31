import { ApiClientInferenceService } from "./api-client-inference-service";

import { DjangoEndpointCognitionService } from "./django-endpoint-cognition-service";

import { EndpointSemanticMatchingService } from "./endpoint-semantic-matching-service";

export interface EndpointSemanticMatchingCommandResult {
  success: boolean;
  diagnostics: string[];
}

export class EndpointSemanticMatchingCommand {
  execute(repositoryRoot: string): EndpointSemanticMatchingCommandResult {
    const diagnostics: string[] = [];

    console.log("");

    console.log("[MundiCodeLens CLI] Running endpoint semantic matching...");

    console.log("");

    console.log("Repository Root:", repositoryRoot);

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

    console.log("Inferred Contract Count:", inferredContracts.clients.length);

    console.log("");

    const endpointCognition = new DjangoEndpointCognitionService();

    const discoveredEndpoints = endpointCognition.analyze(repositoryRoot);

    console.log(
      "Discovered Endpoint Count:",
      discoveredEndpoints.endpoints.length,
    );

    console.log("");

    if (discoveredEndpoints.endpoints.length > 0) {
      console.log("Discovered Endpoints:");

      for (const endpoint of discoveredEndpoints.endpoints) {
        console.log(`- ${endpoint.route}`);
      }

      console.log("");
    }

    const semanticMatcher = new EndpointSemanticMatchingService();

    const result = semanticMatcher.match(
      inferredContracts.clients.map((client) => client.endpoint),
      discoveredEndpoints.endpoints.map((endpoint) => endpoint.route),
    );

    console.log("=== Endpoint Semantic Matching Report ===");

    console.log("");

    console.log(`Success: ${result.success}`);

    console.log("");

    console.log(`Matches: ${result.matches.length}`);

    console.log("");

    console.log("Semantic Matches:");

    for (const match of result.matches) {
      console.log(`- Contract: ${match.contract}`);

      console.log(`  Endpoint: ${match.endpoint}`);

      console.log(`  Confidence: ${match.confidence.toFixed(2)}`);

      console.log("");
    }

    console.log("Diagnostics:");

    for (const diagnostic of result.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    console.log("");

    console.log("[MundiCodeLens CLI] Endpoint semantic matching completed.");

    diagnostics.push(...result.diagnostics);

    return {
      success: true,
      diagnostics,
    };
  }
}
