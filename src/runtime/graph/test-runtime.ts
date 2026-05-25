import path from "path";

import { GraphBuilder } from "./builder/graph-builder";

import { DependencyQuery } from "./queries/dependency-query";

import { ImpactAnalysis } from "./queries/impact-analysis";

import {
  ArchitectureQuery,
  ArchitectureRule,
} from "./queries/architecture-query";

async function runRuntimeTest(): Promise<void> {
  console.log("\n[MundiCodeLens Test] Starting runtime validation test...\n");

  const rootPath = path.resolve(process.cwd());

  const tsConfigPath = path.resolve(process.cwd(), "tsconfig.json");

  /**
   * Build repository graph.
   */
  const graphBuilder = new GraphBuilder({
    rootPath,
    tsConfigFilePath: tsConfigPath,
  });

  const graph = graphBuilder.build();

  console.log("[MundiCodeLens Test] Graph built successfully.");

  console.log(`[MundiCodeLens Test] Nodes: ${graph.nodes.size}`);

  console.log(`[MundiCodeLens Test] Edges: ${graph.edges.length}\n`);

  /**
   * Initialize dependency query engine.
   */
  const dependencyQuery = new DependencyQuery(graph);

  /**
   * Show first few node IDs.
   */
  const nodeIds = dependencyQuery.getAllNodeIds().slice(0, 10);

  console.log("[MundiCodeLens Test] Sample nodes:");

  console.log(nodeIds);

  /**
   * Test impact analysis.
   */
  const impactAnalysis = new ImpactAnalysis(graph);

  const targetNode = nodeIds[0];

  if (targetNode) {
    const impactResult = impactAnalysis.analyze(targetNode);

    console.log("\n[MundiCodeLens Test] Impact analysis result:");

    console.log(impactResult);
  }

  /**
   * Test architecture governance validation.
   */
  const architectureQuery = new ArchitectureQuery(graph);

  const rules: ArchitectureRule[] = [
    {
      sourcePattern: /commands/,

      forbiddenPattern: /storage/,

      message: "Commands layer must not depend directly on storage layer.",
    },
  ];

  const violations = architectureQuery.validateRules(rules);

  console.log("\n[MundiCodeLens Test] Architecture violations:");

  console.log(violations);

  /**
   * Test circular dependency detection.
   */
  const circularDependencies = dependencyQuery.findCircularDependencies();

  console.log(
    `\n[MundiCodeLens Test] Circular dependencies found: ${circularDependencies.length}`,
  );

  if (circularDependencies.length > 0) {
    console.log(circularDependencies);
  }

  console.log(
    "\n[MundiCodeLens Test] Runtime validation completed successfully.\n",
  );
}

runRuntimeTest().catch((error) => {
  console.error("[MundiCodeLens Test] Runtime validation failed:", error);

  process.exit(1);
});
