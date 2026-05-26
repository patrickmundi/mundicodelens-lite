import { GraphBuilder } from "../../graph/builder/graph-builder";

import {
  ArchitectureQuery,
  ArchitectureRule,
} from "../../graph/queries/architecture-query";

export interface ValidateCommandOptions {
  rootPath: string;

  tsConfigFilePath?: string;
}

export async function runValidateCommand(
  options: ValidateCommandOptions,
): Promise<void> {
  console.log("[MundiCodeLens CLI] Running architecture validation...\n");

  /**
   * Build repository graph.
   */
  const graphBuilder = new GraphBuilder({
    rootPath: options.rootPath,

    tsConfigFilePath: options.tsConfigFilePath,
  });

  const graph = graphBuilder.build();

  /**
   * Initialize architecture query engine.
   */
  const architectureQuery = new ArchitectureQuery(graph);

  /**
   * Governance rules.
   */
  const rules: ArchitectureRule[] = [
    {
      sourcePattern: /commands/,

      forbiddenPattern: /storage/,

      message: "Commands layer must not depend directly on storage layer.",
    },

    {
      sourcePattern: /ui/,

      forbiddenPattern: /storage/,

      message: "UI layer must not depend directly on storage layer.",
    },

    {
      sourcePattern: /commands/,

      forbiddenPattern: /observability/,

      message:
        "Commands layer must not depend directly on observability layer.",
    },
  ];

  /**
   * Run validation.
   */
  const violations = architectureQuery.validateRules(rules);

  console.log("[MundiCodeLens CLI] Architecture validation completed.\n");

  if (violations.length === 0) {
    console.log("No architecture violations detected.\n");

    return;
  }

  console.log(`Architecture violations detected: ${violations.length}\n`);

  for (const violation of violations) {
    console.log(`Source: ${violation.source}`);

    console.log(`Dependency: ${violation.dependency}`);

    console.log(`Rule: ${violation.message}\n`);
  }

  console.log("[MundiCodeLens CLI] Governance validation finished.\n");
}
