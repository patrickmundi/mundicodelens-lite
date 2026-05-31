import { FinanceDomainCognitionService } from "./finance-domain-cognition-service";
import { DashboardModuleInferenceService } from "./dashboard-module-inference-service";
import { UIComponentInferenceService } from "./ui-component-inference-service";

export interface FinanceDomainCognitionCommandResult {
  success: boolean;
  diagnostics: string[];
}

export class FinanceDomainCognitionCommand {
  execute(repositoryRoot: string): FinanceDomainCognitionCommandResult {
    const diagnostics: string[] = [];

    console.log("");
    console.log("[MundiCodeLens CLI] Running finance domain cognition...");
    console.log("");

    const service = new FinanceDomainCognitionService();

    const result = service.analyze(repositoryRoot);

    console.log("=== Finance Domain Cognition Report ===");
    console.log("");

    console.log(`Success: ${result.success}`);
    console.log(`Discovered Models: ${result.discoveredModels.length}`);
    console.log(`Discovered Capabilities: ${result.capabilities.length}`);

    console.log("");
    console.log("Finance Models:");

    for (const model of result.discoveredModels) {
      console.log(`- ${model}`);
    }

    console.log("");
    console.log("Finance Capabilities:");

    for (const capability of result.capabilities) {
      console.log(`- ${capability.name}`);
      console.log(`  ${capability.description}`);
    }

    console.log("");

    // =========================================
    // DASHBOARD MODULE INFERENCE
    // =========================================

    const moduleInference = new DashboardModuleInferenceService();

    const moduleResult = moduleInference.inferFromCapabilities(
      result.capabilities.map((capability) => capability.name),
    );

    console.log("Recommended Dashboard Modules:");

    for (const module of moduleResult.modules) {
      console.log(`- ${module.name}`);
      console.log(`  ${module.description}`);
    }

    console.log("");

    // =========================================
    // UI COMPONENT INFERENCE
    // =========================================

    const uiInference = new UIComponentInferenceService();

    const uiResult = uiInference.inferFromModules(
      moduleResult.modules.map((module) => module.name),
    );

    console.log("Recommended UI Components:");

    for (const component of uiResult.components) {
      console.log(`- ${component.name}`);
      console.log(`  ${component.description}`);
    }

    console.log("");

    console.log("Diagnostics:");

    for (const diagnostic of result.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    for (const diagnostic of moduleResult.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    for (const diagnostic of uiResult.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    console.log("");

    console.log("[MundiCodeLens CLI] Finance domain cognition completed.");

    diagnostics.push(...result.diagnostics);
    diagnostics.push(...moduleResult.diagnostics);
    diagnostics.push(...uiResult.diagnostics);

    return {
      success: result.success,
      diagnostics,
    };
  }
}
