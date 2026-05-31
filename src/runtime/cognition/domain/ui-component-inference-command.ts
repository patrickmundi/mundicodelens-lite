import { UIComponentInferenceService } from "./ui-component-inference-service";

export interface UIComponentInferenceCommandResult {
  success: boolean;
  diagnostics: string[];
}

export class UIComponentInferenceCommand {
  execute(modules: string[]): UIComponentInferenceCommandResult {
    const diagnostics: string[] = [];

    console.log("");
    console.log("[MundiCodeLens CLI] Running UI component inference...");
    console.log("");

    const service = new UIComponentInferenceService();

    const result = service.inferFromModules(modules);

    console.log("=== UI Component Inference Report ===");

    console.log("");

    console.log(`Success: ${result.success}`);

    console.log(`Generated Components: ${result.components.length}`);

    console.log("");

    console.log("Recommended UI Components:");

    for (const component of result.components) {
      console.log(`- ${component.name}`);

      console.log(`  ${component.description}`);
    }

    console.log("");

    console.log("Diagnostics:");

    for (const diagnostic of result.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    console.log("");

    console.log("[MundiCodeLens CLI] UI component inference completed.");

    diagnostics.push(...result.diagnostics);

    return {
      success: result.success,
      diagnostics,
    };
  }
}
