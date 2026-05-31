import * as fs from "fs";
import * as path from "path";

import { SemanticComponentTemplateService } from "./semantic-component-template-service";

export interface ComponentFile {
  fileName: string;
  content: string;
}

export interface ComponentFileWriterResult {
  success: boolean;
  filesWritten: string[];
  diagnostics: string[];
}

export class ComponentFileWriterService {
  private readonly templateService = new SemanticComponentTemplateService();

  writeComponents(
    targetDirectory: string,
    components: ComponentFile[],
  ): ComponentFileWriterResult {
    const diagnostics: string[] = [];

    const filesWritten: string[] = [];

    diagnostics.push("Starting component file generation.");

    if (!fs.existsSync(targetDirectory)) {
      fs.mkdirSync(targetDirectory, {
        recursive: true,
      });

      diagnostics.push(`Created directory: ${targetDirectory}`);
    }

    for (const component of components) {
      const filePath = path.join(targetDirectory, component.fileName);

      const componentName = component.fileName.replace(".js", "");

      const semanticTemplate = this.templateService.getTemplate(componentName);

      fs.writeFileSync(filePath, semanticTemplate.template, "utf8");

      filesWritten.push(filePath);

      diagnostics.push(`Generated file: ${component.fileName}`);
    }

    diagnostics.push(`Generated ${filesWritten.length} component file(s).`);

    diagnostics.push("Component file generation completed successfully.");

    return {
      success: true,
      filesWritten,
      diagnostics,
    };
  }
}
