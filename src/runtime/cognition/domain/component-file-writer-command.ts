import {
  ComponentFile,
  ComponentFileWriterService,
} from "./component-file-writer-service";

export interface ComponentFileWriterCommandResult {
  success: boolean;
  diagnostics: string[];
}

export class ComponentFileWriterCommand {
  execute(
    targetDirectory: string,
    components: ComponentFile[],
  ): ComponentFileWriterCommandResult {
    const diagnostics: string[] = [];

    console.log("");
    console.log("[MundiCodeLens CLI] Running component file generation...");
    console.log("");

    const service = new ComponentFileWriterService();

    const result = service.writeComponents(targetDirectory, components);

    console.log("=== Component File Generation Report ===");

    console.log("");

    console.log(`Success: ${result.success}`);

    console.log(`Files Written: ${result.filesWritten.length}`);

    console.log("");

    console.log("Generated Files:");

    for (const file of result.filesWritten) {
      console.log(`- ${file}`);
    }

    console.log("");

    console.log("Diagnostics:");

    for (const diagnostic of result.diagnostics) {
      console.log(`- ${diagnostic}`);
    }

    console.log("");

    console.log("[MundiCodeLens CLI] Component file generation completed.");

    diagnostics.push(...result.diagnostics);

    return {
      success: result.success,
      diagnostics,
    };
  }
}
