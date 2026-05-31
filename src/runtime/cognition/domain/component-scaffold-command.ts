import { ComponentScaffoldService } from "./component-scaffold-service";

export interface ComponentScaffoldCommandResult {
  success: boolean;
  diagnostics: string[];
}

export class ComponentScaffoldCommand {
  execute(componentNames: string[]): ComponentScaffoldCommandResult {
    const diagnostics: string[] = [];

    console.log("");
    console.log("[MundiCodeLens CLI] Running component scaffold generation...");
    console.log("");

    const service = new ComponentScaffoldService();

    const result = service.generateFromComponents(componentNames);

    console.log("=== Component Scaffold Report ===");

    console.log("");

    console.log(`Success: ${result.success}`);

    console.log(`Generated Scaffolds: ${result.components.length}`);

    console.log("");

    console.log("Generated Components:");

    for (const component of result.components) {
      console.log(`- ${component.fileName}`);

      console.log(`  Component: ${component.componentName}`);
    }

    console.log("");

    console.log("Diagnostics:");

    for (const diagnostic of result.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    console.log("");

    console.log("[MundiCodeLens CLI] Component scaffold generation completed.");

    diagnostics.push(...result.diagnostics);

    return {
      success: result.success,
      diagnostics,
    };
  }
}
