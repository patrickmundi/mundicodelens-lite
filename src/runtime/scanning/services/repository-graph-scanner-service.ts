import * as fs from "fs";

import * as path from "path";

import ts from "typescript";

export interface RepositoryFileNode {
  filePath: string;

  imports: string[];

  exports: string[];

  classes: string[];

  interfaces: string[];

  functions: string[];
}

export interface RepositoryGraphTopology {
  scannedFiles: number;

  totalImports: number;

  totalClasses: number;

  totalInterfaces: number;

  totalFunctions: number;

  nodes: RepositoryFileNode[];

  dependencyGraph: Record<string, string[]>;
}

export interface RepositoryGraphScanResult {
  success: boolean;

  topology: RepositoryGraphTopology;

  diagnostics: string[];

  error?: string;
}

export class RepositoryGraphScannerService {
  /**
   * Ignore non-semantic directories.
   */
  private readonly ignoredDirectories = [
    "node_modules",

    ".next",

    "dist",

    "build",

    "coverage",

    ".git",

    ".turbo",

    ".vercel",
  ];

  /**
   * Scan repository recursively.
   */
  public scanRepository(repositoryPath: string): RepositoryGraphScanResult {
    const diagnostics: string[] = [];

    const nodes: RepositoryFileNode[] = [];

    const dependencyGraph: Record<string, string[]> = {};

    try {
      diagnostics.push(`Starting repository scan at '${repositoryPath}'.`);

      /**
       * Discover semantic repository files.
       */
      const files = this.discoverRepositoryFiles(repositoryPath);

      diagnostics.push(`Discovered ${files.length} semantic repository files.`);

      /**
       * Analyze files.
       */
      for (const filePath of files) {
        diagnostics.push(`Analyzing '${filePath}'.`);

        const sourceCode = fs.readFileSync(filePath, "utf-8");

        const sourceFile = ts.createSourceFile(
          filePath,
          sourceCode,
          ts.ScriptTarget.Latest,
          true,
        );

        const node: RepositoryFileNode = {
          filePath,

          imports: [],

          exports: [],

          classes: [],

          interfaces: [],

          functions: [],
        };

        dependencyGraph[filePath] = [];

        /**
         * Traverse AST.
         */
        const visit = (astNode: ts.Node): void => {
          /**
           * Import declarations.
           */
          if (ts.isImportDeclaration(astNode)) {
            const importPath = (astNode.moduleSpecifier as ts.StringLiteral)
              .text;

            node.imports.push(importPath);

            dependencyGraph[filePath].push(importPath);
          }

          /**
           * Export declarations.
           */
          if (ts.isExportDeclaration(astNode)) {
            node.exports.push("EXPORT_DECLARATION");
          }

          /**
           * Class declarations.
           */
          if (ts.isClassDeclaration(astNode)) {
            const className = astNode.name?.text;

            if (className) {
              node.classes.push(className);
            }
          }

          /**
           * Interface declarations.
           */
          if (ts.isInterfaceDeclaration(astNode)) {
            node.interfaces.push(astNode.name.text);
          }

          /**
           * Function declarations.
           */
          if (ts.isFunctionDeclaration(astNode)) {
            const functionName = astNode.name?.text;

            if (functionName) {
              node.functions.push(functionName);
            }
          }

          ts.forEachChild(astNode, visit);
        };

        visit(sourceFile);

        nodes.push(node);
      }

      /**
       * Build topology.
       */
      const topology: RepositoryGraphTopology = {
        scannedFiles: nodes.length,

        totalImports: nodes.reduce(
          (total, node) => total + node.imports.length,
          0,
        ),

        totalClasses: nodes.reduce(
          (total, node) => total + node.classes.length,
          0,
        ),

        totalInterfaces: nodes.reduce(
          (total, node) => total + node.interfaces.length,
          0,
        ),

        totalFunctions: nodes.reduce(
          (total, node) => total + node.functions.length,
          0,
        ),

        nodes,

        dependencyGraph,
      };

      diagnostics.push("Repository graph scanning completed successfully.");

      diagnostics.push(`Indexed ${topology.totalImports} imports.`);

      diagnostics.push(`Indexed ${topology.totalClasses} classes.`);

      diagnostics.push(`Indexed ${topology.totalInterfaces} interfaces.`);

      diagnostics.push(`Indexed ${topology.totalFunctions} functions.`);

      return {
        success: true,

        topology,

        diagnostics,
      };
    } catch (error) {
      return {
        success: false,

        topology: {
          scannedFiles: 0,

          totalImports: 0,

          totalClasses: 0,

          totalInterfaces: 0,

          totalFunctions: 0,

          nodes: [],

          dependencyGraph: {},
        },

        diagnostics,

        error:
          error instanceof Error
            ? error.message
            : "Unknown repository scanning failure.",
      };
    }
  }

  /**
   * Discover semantic repository files recursively.
   */
  private discoverRepositoryFiles(directory: string): string[] {
    const discovered: string[] = [];

    const traverse = (currentPath: string): void => {
      const entries = fs.readdirSync(currentPath, {
        withFileTypes: true,
      });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        /**
         * Ignore non-semantic directories.
         */
        if (
          entry.isDirectory() &&
          this.ignoredDirectories.includes(entry.name)
        ) {
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
         * Track semantic repository files.
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

  /**
   * Detect circular dependencies.
   */
  public detectCircularDependencies(
    topology: RepositoryGraphTopology,
  ): string[] {
    const circular: string[] = [];

    for (const [source, targets] of Object.entries(topology.dependencyGraph)) {
      for (const target of targets) {
        const reverseTargets = topology.dependencyGraph[target] ?? [];

        if (reverseTargets.includes(source)) {
          circular.push(`${source} <-> ${target}`);
        }
      }
    }

    return circular;
  }

  /**
   * Generate repository graph report.
   */
  public generateRepositoryReport(result: RepositoryGraphScanResult): string {
    return [
      "=== Repository Graph Scanner Report ===",

      "",

      `Success: ${result.success}`,

      `Scanned Files: ${result.topology.scannedFiles}`,

      `Total Imports: ${result.topology.totalImports}`,

      `Total Classes: ${result.topology.totalClasses}`,

      `Total Interfaces: ${result.topology.totalInterfaces}`,

      `Total Functions: ${result.topology.totalFunctions}`,

      "",

      "Diagnostics:",

      ...result.diagnostics.map((diagnostic) => `- ${diagnostic}`),
    ].join("\n");
  }
}
