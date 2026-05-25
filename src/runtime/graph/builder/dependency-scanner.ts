import { FileIndexer } from "./file-indexer";
import { ImportParser, ParsedFileDependencies } from "./import-parser";

export interface DependencyScannerOptions {
  rootPath: string;
  tsConfigFilePath?: string;
}

export class DependencyScanner {
  private readonly fileIndexer: FileIndexer;

  private readonly importParser: ImportParser;

  constructor(options: DependencyScannerOptions) {
    this.fileIndexer = new FileIndexer({
      rootPath: options.rootPath,
    });

    this.importParser = new ImportParser(options.tsConfigFilePath);
  }

  /**
   * Scans the repository and returns
   * dependency intelligence for all indexed files.
   */
  public scan(): Map<string, ParsedFileDependencies> {
    const dependencyMap = new Map<string, ParsedFileDependencies>();

    const indexedFiles = this.fileIndexer.scan();

    for (const filePath of indexedFiles) {
      try {
        const parsedDependencies = this.importParser.parseFile(filePath);

        dependencyMap.set(filePath, parsedDependencies);
      } catch (error) {
        console.error(
          `[DependencyScanner] Failed to parse file: ${filePath}`,
          error,
        );
      }
    }

    return dependencyMap;
  }

  /**
   * Returns all indexed repository files.
   */
  public getIndexedFiles(): string[] {
    return this.fileIndexer.scan();
  }
}
