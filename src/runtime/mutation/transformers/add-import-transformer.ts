import ts from "typescript";

import { TypeScriptASTTransformationOperation } from "../services/typescript-ast-transformation-service";

export function addImportTransformer(
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
