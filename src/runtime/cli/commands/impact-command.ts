import path, { resolve } from "path";

import { GraphBuilder } from "../../graph/builder/graph-builder";

import { ImpactAnalysis } from "../../graph/queries/impact-analysis";

export interface ImpactCommandOptions {
  rootPath: string;

  tsConfigFilePath?: string;

  target?: string;
}

export async function runImpactCommand(
  options: ImpactCommandOptions,
): Promise<void> {
  console.log("[MundiCodeLens CLI] Running impact analysis...\n");

  if (!options.target) {
    console.log("[MundiCodeLens CLI] Missing target file.");

    console.log("\nUsage:");

    console.log("npm run graph:impact -- <relative-file-path>");

    console.log("\nExample:");

    console.log("npm run graph:impact -- src/ai/openai.ts");

    process.exit(1);
  }

  /**
   * Build repository graph.
   */
  const graphBuilder = new GraphBuilder({
    rootPath: options.rootPath,

    tsConfigFilePath: options.tsConfigFilePath,
  });

  const graph = graphBuilder.build();

  /**
   * Normalize target path.
   */
  const targetPath = normalizePath(
    path.resolve(options.rootPath, options.target),
  );

  /**
   * Run impact analysis.
   */
  const impactAnalysis = new ImpactAnalysis(graph);

  const result = impactAnalysis.analyze(targetPath);

  console.log("[MundiCodeLens CLI] Impact analysis completed.\n");

  console.log(`Target: ${result.target}\n`);

  console.log(`Direct dependents: ${result.directDependents.length}`);

  for (const dependent of result.directDependents) {
    console.log(`  - ${dependent}`);
  }

  console.log("");

  console.log(`Indirect dependents: ${result.indirectDependents.length}`);

  for (const dependent of result.indirectDependents) {
    console.log(`  - ${dependent}`);
  }

  console.log("");

  console.log(`Total affected nodes: ${result.totalAffectedNodes}`);

  console.log("\n[MundiCodeLens CLI] Impact analysis finished.\n");
    console.log("[AST Mutation] Semantic runtime active.");
}

/**
 * Normalizes paths for
 * graph consistency.
 */
function normalizePath(filePath: string): string {
  return path.normalize(filePath).replace(/\\/g, "/");
}

// AI mutation planner appended comment
// AI mutation planner appended comment