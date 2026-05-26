import path from "path";

import { GraphSyncService } from "../../graph/services/graph-sync-service";

import { RepositoryWatchService } from "../../graph/services/repository-watch-service";

import { ArchitectureQuery } from "../../graph/queries/architecture-query";

import type { ArchitectureRule } from "../../graph/queries/architecture-query";

export interface WatchCommandOptions {
  rootPath: string;

  tsConfigFilePath?: string;
}

export async function runWatchCommand(
  options: WatchCommandOptions,
): Promise<void> {
  console.log("[MundiCodeLens CLI] Starting live graph watch runtime...\n");

  /**
   * Shared persistent graph storage path.
   */
  const storagePath = path.resolve(
    options.rootPath,
    ".mundicodelens",
    "graph",
    "repository-graph.json",
  );

  /**
   * Initialize graph synchronization service.
   */
  const graphSyncService = new GraphSyncService({
    rootPath: options.rootPath,

    storagePath,

    tsConfigFilePath: options.tsConfigFilePath,
  });

  /**
   * Initialize repository watch service.
   */
  const repositoryWatchService = new RepositoryWatchService({
    rootPath: options.rootPath,

    storagePath,

    tsConfigFilePath: options.tsConfigFilePath,
  });

  /**
   * Governance validation rules.
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
  ];

  /**
   * Start live repository watcher.
   */
  await repositoryWatchService.start(async (changedFilePath) => {
    console.log(`[Graph Watch] Change detected:\n${changedFilePath}\n`);

    console.log("[Graph Watch] Synchronizing repository graph...\n");

    const graph = graphSyncService.synchronize();

    console.log(
      `[Graph Watch] Graph synchronized. Nodes: ${graph.nodes.size}, Edges: ${graph.edges.length}\n`,
    );

    /**
     * Run governance validation.
     */
    const architectureQuery = new ArchitectureQuery(graph);

    const violations: any[] = architectureQuery.validateRules(rules) ?? [];

    if (violations.length === 0) {
      console.log("[Graph Watch] Governance validation passed.\n");

      return;
    }

    console.log(
      `[Graph Watch] Governance violations detected: ${violations.length}\n`,
    );

    for (const violation of violations) {
      console.log(`Source: ${violation.source}`);

      console.log(`Dependency: ${violation.dependency}`);

      console.log(`Rule: ${violation.message}\n`);
    }
  });

  console.log(
    "[MundiCodeLens CLI] Live engineering cognition runtime is active.\n",
  );
}
