import type { RepositoryGraph } from "../models/repository-graph";

export class GraphCache {
  private graph: RepositoryGraph | null = null;

  /**
   * Stores the active repository graph in memory.
   */
  public set(graph: RepositoryGraph): void {
    this.graph = graph;
  }

  /**
   * Returns the active repository graph.
   */
  public get(): RepositoryGraph | null {
    return this.graph;
  }

  /**
   * Checks whether a graph is currently cached.
   */
  public has(): boolean {
    return this.graph !== null;
  }

  /**
   * Clears the in-memory graph cache.
   */
  public clear(): void {
    this.graph = null;
  }

  /**
   * Returns the total number of cached nodes.
   */
  public getNodeCount(): number {
    if (!this.graph) {
      return 0;
    }

    return this.graph.nodes.size;
  }

  /**
   * Returns the total number of cached edges.
   */
  public getEdgeCount(): number {
    if (!this.graph) {
      return 0;
    }

    return this.graph.edges.length;
  }

  /**
   * Returns cache statistics.
   */
  public getStats(): {
    hasGraph: boolean;
    nodeCount: number;
    edgeCount: number;
    updatedAt?: Date;
  } {
    return {
      hasGraph: this.has(),

      nodeCount: this.getNodeCount(),

      edgeCount: this.getEdgeCount(),

      updatedAt: this.graph?.updatedAt,
    };
  }
}
