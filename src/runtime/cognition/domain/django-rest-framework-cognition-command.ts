import { DjangoRestFrameworkCognitionService } from "./django-rest-framework-cognition-service";

export interface DjangoRestFrameworkCognitionCommandResult {
  success: boolean;
  diagnostics: string[];
}

export class DjangoRestFrameworkCognitionCommand {
  execute(repositoryRoot: string): DjangoRestFrameworkCognitionCommandResult {
    const diagnostics: string[] = [];

    console.log("");

    console.log(
      "[MundiCodeLens CLI] Running Django REST Framework cognition...",
    );

    console.log("");

    const cognitionService = new DjangoRestFrameworkCognitionService();

    const result = cognitionService.analyze(repositoryRoot);

    console.log("=== Django REST Framework Cognition Report ===");

    console.log("");

    console.log(`Success: ${result.success}`);

    console.log("");

    console.log(`Discovered Endpoints: ${result.endpoints.length}`);

    console.log("");

    console.log("Discovered DRF Endpoints:");

    for (const endpoint of result.endpoints) {
      console.log(`- Route: ${endpoint.route}`);

      console.log(`  ViewSet: ${endpoint.viewSet}`);

      console.log(`  File: ${endpoint.filePath}`);

      console.log("");
    }

    console.log("Diagnostics:");

    for (const diagnostic of result.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    console.log("");

    console.log(
      "[MundiCodeLens CLI] Django REST Framework cognition completed.",
    );

    diagnostics.push(...result.diagnostics);

    return {
      success: true,
      diagnostics,
    };
  }
}
