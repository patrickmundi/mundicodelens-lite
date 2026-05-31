import { DjangoEndpointCognitionService } from "./django-endpoint-cognition-service";

export interface DjangoEndpointCognitionCommandResult {
  success: boolean;
  diagnostics: string[];
}

export class DjangoEndpointCognitionCommand {
  execute(repositoryRoot: string): DjangoEndpointCognitionCommandResult {
    const diagnostics: string[] = [];

    console.log("");
    console.log("[MundiCodeLens CLI] Running Django endpoint cognition...");
    console.log("");

    const service = new DjangoEndpointCognitionService();

    const result = service.analyze(repositoryRoot);

    console.log("=== Django Endpoint Cognition Report ===");

    console.log("");

    console.log(`Success: ${result.success}`);

    console.log("");

    console.log(`Discovered Endpoints: ${result.endpoints.length}`);

    console.log("");

    console.log("Discovered Routes:");

    for (const endpoint of result.endpoints) {
      console.log(`- ${endpoint.route}`);

      console.log(`  Source: ${endpoint.sourceFile}`);
    }

    console.log("");

    console.log("Diagnostics:");

    for (const diagnostic of result.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    console.log("");

    console.log("[MundiCodeLens CLI] Django endpoint cognition completed.");

    diagnostics.push(...result.diagnostics);

    return {
      success: result.success,
      diagnostics,
    };
  }
}
