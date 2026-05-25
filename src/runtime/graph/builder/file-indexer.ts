import fs from "fs";
import path from "path";

export interface FileIndexerOptions {
  rootPath: string;
  allowedExtensions?: string[];
  ignoredDirectories?: string[];
}

export class FileIndexer {
  private readonly rootPath: string;

  private readonly allowedExtensions: string[];

  private readonly ignoredDirectories: Set<string>;

  constructor(options: FileIndexerOptions) {
    this.rootPath = path.resolve(options.rootPath);

    this.allowedExtensions = options.allowedExtensions ?? [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
    ];

    this.ignoredDirectories = new Set(
      options.ignoredDirectories ?? [
        "node_modules",
        ".git",
        "dist",
        "build",
        "out",
        ".next",
        "coverage",
      ],
    );
  }

  /**
   * Recursively scans the repository and returns indexed source files.
   */
  public scan(): string[] {
    const indexedFiles: string[] = [];

    this.walkDirectory(this.rootPath, indexedFiles);

    return indexedFiles;
  }

  /**
   * Recursively traverses directories.
   */
  private walkDirectory(currentPath: string, indexedFiles: string[]): void {
    if (!fs.existsSync(currentPath)) {
      return;
    }

    const entries = fs.readdirSync(currentPath, {
      withFileTypes: true,
    });

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);

      if (entry.isDirectory()) {
        if (this.shouldIgnoreDirectory(entry.name)) {
          continue;
        }

        this.walkDirectory(fullPath, indexedFiles);

        continue;
      }

      if (entry.isFile() && this.isSupportedFile(fullPath)) {
        indexedFiles.push(this.normalizePath(fullPath));
      }
    }
  }

  /**
   * Checks whether a directory should be ignored.
   */
  private shouldIgnoreDirectory(directoryName: string): boolean {
    return this.ignoredDirectories.has(directoryName);
  }

  /**
   * Checks whether a file extension is supported.
   */
  private isSupportedFile(filePath: string): boolean {
    const extension = path.extname(filePath);

    return this.allowedExtensions.includes(extension);
  }

  /**
   * Normalizes file paths for graph consistency.
   */
  private normalizePath(filePath: string): string {
    return path.normalize(filePath).replace(/\\/g, "/");
  }
}
