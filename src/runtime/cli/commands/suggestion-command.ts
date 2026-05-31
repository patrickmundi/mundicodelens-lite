import * as fs from "fs";

import * as path from "path";

import { SemanticEngineeringSuggestionService } from "../../cognition/services/semantic-engineering-suggestion-service";

export interface SuggestionCommandOptions {
  rootPath: string;

  tsConfigFilePath?: string;
}

export async function runSuggestionCommand(
  options: SuggestionCommandOptions,
): Promise<void> {
  console.log(
    "[MundiCodeLens CLI] Running semantic engineering suggestion analysis...\n",
  );

  const suggestionService = new SemanticEngineeringSuggestionService();

  /**
   * Discover semantic repository files.
   */
  const repositoryFiles = discoverRepositoryFiles(options.rootPath);

  /**
   * Generate suggestions.
   */
  const result = suggestionService.generateSuggestions(repositoryFiles);

  /**
   * Print report.
   */
  console.log(suggestionService.generateSuggestionReport(result));

  console.log(
    "\n[MundiCodeLens CLI] Semantic engineering suggestion analysis completed.\n",
  );
}

/**
 * Discover semantic repository files.
 */
function discoverRepositoryFiles(directory: string): string[] {
  const ignoredDirectories = [
    "node_modules",

    ".next",

    "dist",

    "build",

    "coverage",

    ".git",

    ".turbo",

    ".vercel",
  ];

  const discovered: string[] = [];

  const traverse = (currentPath: string): void => {
    const entries = fs.readdirSync(currentPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      /**
       * Ignore noise directories.
       */
      if (entry.isDirectory() && ignoredDirectories.includes(entry.name)) {
        continue;
      }

      /**
       * Traverse directories.
       */
      if (entry.isDirectory()) {
        traverse(fullPath);

        continue;
      }

      /**
       * Track semantic files.
       */
      if (
        entry.isFile() &&
        (fullPath.endsWith(".ts") ||
          fullPath.endsWith(".tsx") ||
          fullPath.endsWith(".js") ||
          fullPath.endsWith(".jsx"))
      ) {
        discovered.push(fullPath);
      }
    }
  };

  traverse(directory);

  return discovered;
}
