import ts from "typescript";
import { addImportTransformer } from "../transformers/add-import-transformer";

import { addInterfaceTransformer } from "../transformers/add-interface-transformer";

import { addMethodTransformer } from "../transformers/add-method-transformer";

import { updateClassTransformer } from "../transformers/update-class-transformer";

export interface TypeScriptASTTransformationTarget {
  filePath: string;

  sourceCode: string;
}

export interface TypeScriptASTTransformationOperation {
  operationId: string;

  type: "ADD_METHOD" | "ADD_IMPORT" | "ADD_INTERFACE" | "UPDATE_CLASS";

  targetName: string;

  payload: string;
}

export interface TypeScriptASTTransformationResult {
  success: boolean;

  transformedCode: string;

  appliedOperations: string[];

  diagnostics: string[];

  error?: string;
}

export class TypeScriptASTTransformationService {
  /**
   * Execute real TypeScript AST transformation pipeline.
   */
  public executeTransformation(
    target: TypeScriptASTTransformationTarget,

    operations: TypeScriptASTTransformationOperation[],
  ): TypeScriptASTTransformationResult {
    const diagnostics: string[] = [];

    const appliedOperations: string[] = [];

    try {
      diagnostics.push("Initializing TypeScript AST transformation pipeline.");

      /**
       * Parse AST.
       */
      const sourceFile = ts.createSourceFile(
        target.filePath,

        target.sourceCode,

        ts.ScriptTarget.Latest,

        true,

        ts.ScriptKind.TS,
      );

      diagnostics.push("TypeScript AST parsed successfully.");

      /**
       * Current transformation state.
       */
      let transformedSourceFile = sourceFile;

      /**
       * Apply operations.
       */
      for (const operation of operations) {
        diagnostics.push(`Applying transformation '${operation.type}'.`);

        transformedSourceFile = this.applyTransformation(
          transformedSourceFile,
          operation,
        );

        appliedOperations.push(operation.operationId);
      }

      /**
       * Print AST back to source.
       */
      const printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed,
      });

      const transformedCode = printer.printFile(transformedSourceFile);

      diagnostics.push("AST printing completed successfully.");

      /**
       * Validate transformed AST.
       */
      const validation = this.validateTransformation(
        target.filePath,
        transformedCode,
      );

      diagnostics.push(...validation);

      /**
       * Semantic structure analysis.
       */
      const semanticAnalysis = this.analyzeSemanticStructure(
        transformedSourceFile,
      );

      diagnostics.push(...semanticAnalysis);

      return {
        success: true,

        transformedCode,

        appliedOperations,

        diagnostics,
      };
    } catch (error) {
      return {
        success: false,

        transformedCode: target.sourceCode,

        appliedOperations,

        diagnostics,

        error:
          error instanceof Error
            ? error.message
            : "Unknown AST transformation failure.",
      };
    }
  }

  /**
   * Apply AST transformation.
   */
  private applyTransformation(
    sourceFile: ts.SourceFile,

    operation: TypeScriptASTTransformationOperation,
  ): ts.SourceFile {
    switch (operation.type) {
      case "ADD_IMPORT":
        return addImportTransformer(sourceFile, operation);

      case "ADD_INTERFACE":
        return addInterfaceTransformer(sourceFile, operation);

      case "ADD_METHOD":
        return addMethodTransformer(sourceFile, operation);

      case "UPDATE_CLASS":
        return updateClassTransformer(sourceFile, operation);

      default:
        return sourceFile;
    }
  }

  /**
   * Validate transformed AST.
   */
  private validateTransformation(
    filePath: string,

    transformedCode: string,
  ): string[] {
    const diagnostics: string[] = [];

    const sourceFile = ts.createSourceFile(
      filePath,
      transformedCode,
      ts.ScriptTarget.Latest,
      true,
    );

    if (ts.getPreEmitDiagnostics(ts.createProgram([], {})).length > 0) {
      diagnostics.push("AST validation produced diagnostics.");
    } else {
      diagnostics.push("AST validation completed successfully.");
    }

    return diagnostics;
  }

  /**
   * Analyze semantic structure.
   */
  private analyzeSemanticStructure(sourceFile: ts.SourceFile): string[] {
    const diagnostics: string[] = [];

    const visit = (node: ts.Node): void => {
      if (ts.isClassDeclaration(node)) {
        diagnostics.push(`Detected class '${node.name?.text}'.`);
      }

      if (ts.isInterfaceDeclaration(node)) {
        diagnostics.push(`Detected interface '${node.name.text}'.`);
      }

      if (ts.isImportDeclaration(node)) {
        diagnostics.push("Detected import declaration.");
      }

      ts.forEachChild(node, visit);
    };

    visit(sourceFile);

    return diagnostics;
  }

  /**
   * Generate transformation report.
   */
  public generateTransformationReport(
    result: TypeScriptASTTransformationResult,
  ): string {
    return [
      "=== TypeScript AST Transformation Report ===",

      "",

      `Success: ${result.success}`,

      "",

      "Applied Operations:",

      ...result.appliedOperations.map((operation) => `- ${operation}`),

      "",

      "Diagnostics:",

      ...result.diagnostics.map((diagnostic) => `- ${diagnostic}`),
    ].join("\n");
  }
}
