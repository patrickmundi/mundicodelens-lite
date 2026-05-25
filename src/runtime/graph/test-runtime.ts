import path from "path";

import { GraphBuilder } from "./builder/graph-builder";
import { DependencyQuery } from "./queries/dependency-query";

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

  console.log(`[MundiCodeLens Test] Graph built successfully.`);

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
