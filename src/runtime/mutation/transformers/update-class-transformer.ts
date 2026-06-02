import ts from "typescript";

import { TypeScriptASTTransformationOperation } from "../services/typescript-ast-transformation-service";

export function updateClassTransformer(
  sourceFile: ts.SourceFile,
  operation: TypeScriptASTTransformationOperation,
): ts.SourceFile {
  const transformer: ts.TransformerFactory<ts.SourceFile> =
    (context) => (rootNode) => {
      const visit = (node: ts.Node): ts.Node => {
        if (
          ts.isClassDeclaration(node) &&
          node.name?.text === operation.targetName
        ) {
          const property = ts.factory.createPropertyDeclaration(
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

  const result = ts.transform(sourceFile, [transformer]);

  return result.transformed[0];
}
