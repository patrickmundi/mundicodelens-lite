import ts from "typescript";

import { TypeScriptASTTransformationOperation } from "../services/typescript-ast-transformation-service";

export function addInterfaceTransformer(
  sourceFile: ts.SourceFile,
  operation: TypeScriptASTTransformationOperation,
): ts.SourceFile {
  const interfaceDeclaration = ts.factory.createInterfaceDeclaration(
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
