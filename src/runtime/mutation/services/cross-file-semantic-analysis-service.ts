import ts from "typescript";

export interface SemanticFileTarget {
  filePath: string;

  sourceCode: string;
}

export interface CrossFileSymbolRelationship {
  sourceFile: string;

  targetFile: string;

  symbolName: string;

  relationshipType:
    | "IMPORT"
    | "EXPORT"
    | "CLASS_USAGE"
    | "FUNCTION_CALL"
    | "TYPE_REFERENCE";
}

export interface RepositorySemanticTopology {
  totalFiles: number;

  totalRelationships: number;

  symbols: string[];

  relationships: CrossFileSymbolRelationship[];

  dependencyGraph: Record<string, string[]>;
}

export interface SemanticAnalysisResult {
  success: boolean;

  topology: RepositorySemanticTopology;

  diagnostics: string[];

  error?: string;
}

export class CrossFileSemanticAnalysisService {
  /**
   * Analyze repository-wide semantic relationships.
   */
  public analyzeRepositorySemantics(
    files: SemanticFileTarget[],
  ): SemanticAnalysisResult {
    const diagnostics: string[] = [];

    const relationships: CrossFileSymbolRelationship[] = [];

    const symbols = new Set<string>();

    const dependencyGraph: Record<string, string[]> = {};

    try {
      for (const file of files) {
        diagnostics.push(`Analyzing '${file.filePath}'.`);

        dependencyGraph[file.filePath] = [];

        const sourceFile = ts.createSourceFile(
          file.filePath,

          file.sourceCode,

          ts.ScriptTarget.Latest,

          true,
        );

        /**
         * Visit AST nodes.
         */
        const visit = (node: ts.Node): void => {
          /**
           * Import declarations.
           */
          if (ts.isImportDeclaration(node)) {
            const importPath = (node.moduleSpecifier as ts.StringLiteral).text;

            relationships.push({
              sourceFile: file.filePath,

              targetFile: importPath,

              symbolName: "IMPORT",

              relationshipType: "IMPORT",
            });

            dependencyGraph[file.filePath].push(importPath);
          }

          /**
           * Class declarations.
           */
          if (ts.isClassDeclaration(node)) {
            const className = node.name?.text;

            if (className) {
              symbols.add(className);

              diagnostics.push(`Detected class '${className}'.`);
            }
          }

          /**
           * Interface declarations.
           */
          if (ts.isInterfaceDeclaration(node)) {
            symbols.add(node.name.text);

            diagnostics.push(`Detected interface '${node.name.text}'.`);
          }

          /**
           * Function declarations.
           */
          if (ts.isFunctionDeclaration(node)) {
            const functionName = node.name?.text;

            if (functionName) {
              symbols.add(functionName);

              diagnostics.push(`Detected function '${functionName}'.`);
            }
          }

          /**
           * Type references.
           */
          if (ts.isTypeReferenceNode(node)) {
            const typeName = node.typeName.getText();

            relationships.push({
              sourceFile: file.filePath,

              targetFile: "UNKNOWN",

              symbolName: typeName,

              relationshipType: "TYPE_REFERENCE",
            });
          }

          ts.forEachChild(node, visit);
        };

        visit(sourceFile);
      }

      const topology: RepositorySemanticTopology = {
        totalFiles: files.length,

        totalRelationships: relationships.length,

        symbols: Array.from(symbols),

        relationships,

        dependencyGraph,
      };

      diagnostics.push("Repository semantic analysis completed successfully.");

      return {
        success: true,

        topology,

        diagnostics,
      };
    } catch (error) {
      return {
        success: false,

        topology: {
          totalFiles: 0,

          totalRelationships: 0,

          symbols: [],

          relationships: [],

          dependencyGraph: {},
        },

        diagnostics,

        error:
          error instanceof Error
            ? error.message
            : "Unknown semantic analysis failure.",
      };
    }
  }

  /**
   * Detect circular dependencies.
   */
  public detectCircularDependencies(
    topology: RepositorySemanticTopology,
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
   * Detect isolated repository regions.
   */
  public detectIsolatedFiles(topology: RepositorySemanticTopology): string[] {
    return Object.entries(topology.dependencyGraph)
      .filter(([, targets]) => targets.length === 0)
      .map(([file]) => file);
  }

  /**
   * Generate semantic graph report.
   */
  public generateSemanticReport(result: SemanticAnalysisResult): string {
    return [
      "=== Cross-File Semantic Analysis Report ===",

      "",

      `Success: ${result.success}`,

      `Total Files: ${result.topology.totalFiles}`,

      `Total Relationships: ${result.topology.totalRelationships}`,

      "",

      "Detected Symbols:",

      ...result.topology.symbols.map((symbol) => `- ${symbol}`),

      "",

      "Diagnostics:",

      ...result.diagnostics.map((item) => `- ${item}`),
    ].join("\n");
  }
}
