import * as fs from "fs";
import * as path from "path";

import { GeneratedApiClientFile } from "./api-client-generator-service";

export interface ApiClientFileWriterResult {
  success: boolean;
  filesWritten: string[];
  diagnostics: string[];
}

export class ApiClientFileWriterService {
  writeFiles(
    targetDirectory: string,
    files: GeneratedApiClientFile[],
  ): ApiClientFileWriterResult {
    const diagnostics: string[] = [];

    const filesWritten: string[] = [];

    diagnostics.push("Starting API client file generation.");

    if (!fs.existsSync(targetDirectory)) {
      fs.mkdirSync(targetDirectory, {
        recursive: true,
      });

      diagnostics.push(`Created directory: ${targetDirectory}`);
    }

    for (const file of files) {
      const filePath = path.join(targetDirectory, file.fileName);

      fs.writeFileSync(filePath, file.content, "utf8");

      filesWritten.push(filePath);

      diagnostics.push(`Generated file: ${file.fileName}`);
    }

    diagnostics.push(`Generated ${filesWritten.length} API client file(s).`);

    diagnostics.push("API client file generation completed successfully.");

    return {
      success: true,
      filesWritten,
      diagnostics,
    };
  }
}
