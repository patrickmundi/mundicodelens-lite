import ts from "typescript";

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
        return this.addImport(sourceFile, operation);

      case "ADD_INTERFACE":
        return this.addInterface(sourceFile, operation);

      case "ADD_METHOD":
        return this.addMethod(sourceFile, operation);

      case "UPDATE_CLASS":
        return this.updateClass(sourceFile, operation);

      default:
        return sourceFile;
    }
  }

  /**
   * Add import declaration.
   */
  private addImport(
    sourceFile: ts.SourceFile,

    operation: TypeScriptASTTransformationOperation,
  ): ts.SourceFile {
    const importDeclaration = ts.factory.createImportDeclaration(
      undefined,
      ts.factory.createImportClause(
        false,
        undefined,
        ts.factory.createNamedImports([
          ts.factory.createImportSpecifier(
            false,
            undefined,
            ts.factory.createIdentifier(operation.targetName),
          ),
        ]),
      ),
      ts.factory.createStringLiteral(operation.payload),
    );

    return ts.factory.updateSourceFile(sourceFile, [
      importDeclaration,
      ...sourceFile.statements,
    ]);
  }

  /**
   * Add interface declaration.
   */
  private addInterface(
    sourceFile: ts.SourceFile,

    operation: TypeScriptASTTransformationOperation,
  ): ts.SourceFile {
    const interfaceDeclaration = ts.factory.createInterfaceDeclaration(
      undefined,
      [ts.factory.createModifier(ts.SyntaxKind.ExportKeyword)],
      operation.targetName,
      undefined,
      undefined,
      [],
    );

    return ts.factory.updateSourceFile(sourceFile, [
      interfaceDeclaration,
      ...sourceFile.statements,
    ]);
  }

  /**
   * Add method to matching class.
   */
  private addMethod(
    sourceFile: ts.SourceFile,

    operation: TypeScriptASTTransformationOperation,
  ): ts.SourceFile {
    const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
      return (rootNode) => {
        const visit = (node: ts.Node): ts.Node => {
          if (
            ts.isClassDeclaration(node) &&
            node.name?.text === operation.targetName
          ) {
            const method = ts.factory.createMethodDeclaration(
              undefined,
              [ts.factory.createModifier(ts.SyntaxKind.PublicKeyword)],
              undefined,
              "generatedMethod",
              undefined,
              undefined,
              [],
              undefined,
              ts.factory.createBlock(
                [
                  ts.factory.createExpressionStatement(
                    ts.factory.createCallExpression(
                      ts.factory.createPropertyAccessExpression(
                        ts.factory.createIdentifier("console"),
                        "log",
                      ),
                      undefined,
                      [ts.factory.createStringLiteral(operation.payload)],
                    ),
                  ),
                ],
                true,
              ),
            );

            return ts.factory.updateClassDeclaration(
              node,
              node.modifiers,
              node.name,
              node.typeParameters,
              node.heritageClauses,
              [...node.members, method],
            );
          }

          return ts.visitEachChild(node, visit, context);
        };

        return ts.visitNode(rootNode, visit) as ts.SourceFile;
      };
    };

    const result = ts.transform(sourceFile, [transformer]);

    return result.transformed[0];
  }

  /**
   * Update class declaration.
   */
  private updateClass(
    sourceFile: ts.SourceFile,

    operation: TypeScriptASTTransformationOperation,
  ): ts.SourceFile {
    const transformer: ts.TransformerFactory<ts.SourceFile> = (context) => {
      return (rootNode) => {
        const visit = (node: ts.Node): ts.Node => {
          if (
            ts.isClassDeclaration(node) &&
            node.name?.text === operation.targetName
          ) {
            const property = ts.factory.createPropertyDeclaration(
              undefined,
              [ts.factory.createModifier(ts.SyntaxKind.PublicKeyword)],
              "runtimeEnhanced",
              undefined,
              undefined,
              ts.factory.createTrue(),
            );

            return ts.factory.updateClassDeclaration(
              node,
              node.modifiers,
              node.name,
              node.typeParameters,
              node.heritageClauses,
              [property, ...node.members],
            );
          }

          return ts.visitEachChild(node, visit, context);
        };

        return ts.visitNode(rootNode, visit) as ts.SourceFile;
      };
    };

    const result = ts.transform(sourceFile, [transformer]);

    return result.transformed[0];
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

    if (sourceFile.parseDiagnostics.length > 0) {
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
