import { DashboardModuleInferenceService } from "./dashboard-module-inference-service";

export interface DashboardModuleInferenceCommandResult {
  success: boolean;
  diagnostics: string[];
}

export class DashboardModuleInferenceCommand {
  execute(capabilities: string[]): DashboardModuleInferenceCommandResult {
    const diagnostics: string[] = [];

    console.log("");
    console.log("[MundiCodeLens CLI] Running dashboard module inference...");
    console.log("");

    const service = new DashboardModuleInferenceService();

    const result = service.inferFromCapabilities(capabilities);

    console.log("=== Dashboard Module Inference Report ===");

    console.log("");

    console.log(`Success: ${result.success}`);

    console.log(`Generated Modules: ${result.modules.length}`);

    console.log("");

    console.log("Recommended Dashboard Modules:");

    for (const module of result.modules) {
      console.log(`- ${module.name}`);

      console.log(`  ${module.description}`);
    }

    console.log("");

    console.log("Diagnostics:");

    for (const diagnostic of result.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    console.log("");

    console.log("[MundiCodeLens CLI] Dashboard module inference completed.");

    diagnostics.push(...result.diagnostics);

    return {
      success: result.success,
      diagnostics,
    };
  }
}
