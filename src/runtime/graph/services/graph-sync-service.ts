import path from "path";

import { GraphBuilder } from "../builder/graph-builder";

import { GraphCache } from "../storage/graph-cache";
import { GraphStore } from "../storage/graph-store";

import type { RepositoryGraph } from "../models/repository-graph";

export interface GraphSyncServiceOptions {
  rootPath: string;

  storagePath?: string;

  tsConfigFilePath?: string;
}

export class GraphSyncService {
  private readonly graphBuilder: GraphBuilder;

  private readonly graphStore: GraphStore;

  private readonly graphCache: GraphCache;

  constructor(options: GraphSyncServiceOptions) {
    this.graphBuilder = new GraphBuilder({
      rootPath: options.rootPath,

      tsConfigFilePath: options.tsConfigFilePath,
    });

    /**
     * Default persistent graph storage path.
     */
    const storagePath =
      options.storagePath ??
      path.resolve(
        options.rootPath,
        ".mundicodelens",
        "graph",
        "repository-graph.json",
      );

    this.graphStore = new GraphStore({
      storagePath,
    });

    this.graphCache = new GraphCache();
  }

  /**
   * Builds a fresh repository graph,
   * caches it, and persists it to disk.
   */
  public synchronize(): RepositoryGraph {
    const graph = this.graphBuilder.build();

    this.graphCache.set(graph);

    this.graphStore.save(graph);

    return graph;
  }

  /**
   * Loads graph from cache first,
   * then storage if necessary.
   */
  public load(): RepositoryGraph | null {
    if (this.graphCache.has()) {
      return this.graphCache.get();
    }

    const storedGraph = this.graphStore.load();

    if (storedGraph) {
      this.graphCache.set(storedGraph);
    }

    return storedGraph;
  }

  /**
   * Returns the active runtime graph.
   */
  public getGraph(): RepositoryGraph | null {
    return this.graphCache.get();
  }

  /**
   * Rebuilds and re-synchronizes the graph.
   */
  public rebuild(): RepositoryGraph {
    return this.synchronize();
  }

  /**
   * Clears both runtime cache
   * and persisted graph storage.
   */
  public clear(): void {
    this.graphCache.clear();

    this.graphStore.clear();
  }

  /**
   * Returns graph cache statistics.
   */
  public getStats(): {
    hasGraph: boolean;

    nodeCount: number;

    edgeCount: number;

    updatedAt?: Date;
  } {
    return this.graphCache.getStats();
  }
}
