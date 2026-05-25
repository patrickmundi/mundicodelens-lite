import type { GraphEdge } from "../models/graph-edge";
import type { RepositoryGraph } from "../models/repository-graph";

export class DependencyQuery {
  constructor(private readonly graph: RepositoryGraph) {}

  /**
   * Returns all direct dependencies
   * of a given node/file.
   */
  public getDependencies(nodeId: string): string[] {
    return this.graph.edges
      .filter((edge) => edge.from === nodeId && edge.relationship === "imports")
      .map((edge) => edge.to);
  }

  /**
   * Returns all nodes/files that depend
   * on the given node.
   */
  public getDependents(nodeId: string): string[] {
    return this.graph.edges
      .filter((edge) => edge.to === nodeId && edge.relationship === "imports")
      .map((edge) => edge.from);
  }

  /**
   * Returns all graph edges for a node.
   */
  public getNodeEdges(nodeId: string): GraphEdge[] {
    return this.graph.edges.filter(
      (edge) => edge.from === nodeId || edge.to === nodeId,
    );
  }

  /**
   * Checks whether a node exists.
   */
  public hasNode(nodeId: string): boolean {
    return this.graph.nodes.has(nodeId);
  }

  /**
   * Returns all graph node IDs.
   */
  public getAllNodeIds(): string[] {
    return Array.from(this.graph.nodes.keys());
  }

  /**
   * Returns all graph edges.
   */
  public getAllEdges(): GraphEdge[] {
    return this.graph.edges;
  }

  /**
   * Finds circular dependencies
   * using depth-first traversal.
   */
  public findCircularDependencies(): string[][] {
    const visited = new Set<string>();

    const stack = new Set<string>();

    const cycles: string[][] = [];

    const visit = (nodeId: string, path: string[]): void => {
      if (stack.has(nodeId)) {
        const cycleStart = path.indexOf(nodeId);

        cycles.push(path.slice(cycleStart));

        return;
      }

      if (visited.has(nodeId)) {
        return;
      }

      visited.add(nodeId);

      stack.add(nodeId);

      const dependencies = this.getDependencies(nodeId);

      for (const dependency of dependencies) {
        visit(dependency, [...path, dependency]);
      }

      stack.delete(nodeId);
    };

    for (const nodeId of this.graph.nodes.keys()) {
      visit(nodeId, [nodeId]);
    }

    return cycles;
  }
}
