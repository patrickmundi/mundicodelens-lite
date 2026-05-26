import { Project, SourceFile } from "ts-morph";

export interface AppendStatementMutation {
  type: "append-statement";

  targetFunctionName: string;

  statement: string;
}

export interface AddImportMutation {
  type: "add-import";

  moduleSpecifier: string;

  namedImports: string[];
}

export type ASTMutationInstruction =
  | AppendStatementMutation
  | AddImportMutation;

export class ASTMutationEngine {
  private readonly project: Project;

  constructor() {
    this.project = new Project({
      skipAddingFilesFromTsConfig: true,
    });
  }

  /**
   * Applies AST mutations
   * safely to TypeScript source.
   */
  public applyMutations(
    filePath: string,
    mutations: ASTMutationInstruction[],
  ): string {
    const sourceFile = this.project.addSourceFileAtPath(filePath);

    for (const mutation of mutations) {
      switch (mutation.type) {
        case "append-statement":
          this.applyAppendStatementMutation(sourceFile, mutation);

          break;

        case "add-import":
          this.applyAddImportMutation(sourceFile, mutation);

          break;

        default:
          console.warn("[ASTMutationEngine] Unsupported mutation type.");
      }
    }

    return sourceFile.getFullText();
  }

  /**
   * Appends statement to function body.
   */
  private applyAppendStatementMutation(
    sourceFile: SourceFile,
    mutation: AppendStatementMutation,
  ): void {
    const targetFunction = sourceFile
      .getFunctions()
      .find((fn) => fn.getName() === mutation.targetFunctionName);

    if (!targetFunction) {
      console.warn(
        `[ASTMutationEngine] Function not found: ${mutation.targetFunctionName}`,
      );

      return;
    }

    targetFunction.addStatements(mutation.statement);

    console.log(
      `[ASTMutationEngine] Statement appended to function: ${mutation.targetFunctionName}`,
    );
  }

  /**
   * Adds import declaration safely.
   */
  private applyAddImportMutation(
    sourceFile: SourceFile,
    mutation: AddImportMutation,
  ): void {
    const existingImport = sourceFile
      .getImportDeclarations()
      .find(
        (importDeclaration) =>
          importDeclaration.getModuleSpecifierValue() ===
          mutation.moduleSpecifier,
      );

    if (existingImport) {
      const existingNamedImports = existingImport
        .getNamedImports()
        .map((namedImport) => namedImport.getName());

      for (const namedImport of mutation.namedImports) {
        if (!existingNamedImports.includes(namedImport)) {
          existingImport.addNamedImport(namedImport);
        }
      }

      console.log(
        `[ASTMutationEngine] Existing import updated: ${mutation.moduleSpecifier}`,
      );

      return;
    }

    sourceFile.addImportDeclaration({
      moduleSpecifier: mutation.moduleSpecifier,

      namedImports: mutation.namedImports,
    });

    console.log(
      `[ASTMutationEngine] Import added: ${mutation.moduleSpecifier}`,
    );
  }
}
