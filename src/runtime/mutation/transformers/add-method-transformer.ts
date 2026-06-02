import ts from "typescript";

import { TypeScriptASTTransformationOperation } from "../services/typescript-ast-transformation-service";

export function addMethodTransformer(
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
          const method = ts.factory.createMethodDeclaration(
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

  const result = ts.transform(sourceFile, [transformer]);

  return result.transformed[0];
}
