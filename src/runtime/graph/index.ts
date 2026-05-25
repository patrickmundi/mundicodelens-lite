import path from "path";

import { GraphSyncService } from "./services/graph-sync-service";
import { RepositoryWatchService } from "./services/repository-watch-service";

const ROOT_PATH = path.resolve(process.cwd());

const STORAGE_PATH = path.resolve(
  process.cwd(),
  ".mundicodelens/graph/repository-graph.json",
);

const TS_CONFIG_PATH = path.resolve(process.cwd(), "tsconfig.json");

/**
 * Initializes the engineering knowledge graph runtime.
 */
async function bootstrapRuntime(): Promise<void> {
  console.log(
    "\n[MundiCodeLens Runtime] Bootstrapping engineering graph runtime...\n",
  );

  const graphSyncService = new GraphSyncService({
    rootPath: ROOT_PATH,
    storagePath: STORAGE_PATH,
    tsConfigFilePath: TS_CONFIG_PATH,
  });

  /**
   * Attempt to load persisted graph first.
   */
  const existingGraph = graphSyncService.load();

  if (existingGraph) {
    console.log(
      `[MundiCodeLens Runtime] Loaded existing graph. Nodes: ${existingGraph.nodes.size}, Edges: ${existingGraph.edges.length}`,
    );
  } else {
    console.log(
      "[MundiCodeLens Runtime] No persisted graph found. Building fresh graph...",
    );

    const graph = graphSyncService.synchronize();

    console.log(
      `[MundiCodeLens Runtime] Fresh graph built. Nodes: ${graph.nodes.size}, Edges: ${graph.edges.length}`,
    );
  }

  /**
   * Start live repository watching.
   */
  const repositoryWatchService = new RepositoryWatchService({
    rootPath: ROOT_PATH,
    storagePath: STORAGE_PATH,
    tsConfigFilePath: TS_CONFIG_PATH,
  });

  repositoryWatchService.start();

  console.log(
    "\n[MundiCodeLens Runtime] Engineering graph runtime is now live.\n",
  );

  /**
   * Graceful shutdown handling.
   */
  process.on("SIGINT", async () => {
    console.log("\n[MundiCodeLens Runtime] Shutting down runtime...");

    await repositoryWatchService.stop();

    console.log("[MundiCodeLens Runtime] Runtime shutdown complete.");

    process.exit(0);
  });
}

/**
 * Runtime bootstrap entrypoint.
 */
bootstrapRuntime().catch((error) => {
  console.error("[MundiCodeLens Runtime] Fatal runtime error:", error);

  process.exit(1);
});
