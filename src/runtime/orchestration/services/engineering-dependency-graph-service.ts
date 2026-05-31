export interface DependencyNode {
  id: string;

  dependencies: string[];

  metadata?: Record<string, unknown>;
}

export interface DependencyResolutionResult {
  ordered: DependencyNode[];

  circularDependencies: string[][];

  success: boolean;
}

export class EngineeringDependencyGraphService {
  private readonly nodes = new Map<string, DependencyNode>();

  /**
   * Register dependency node.
   */
  public registerNode(node: DependencyNode): void {
    this.nodes.set(node.id, node);
  }

  /**
   * Resolve execution order.
   */
  public resolveExecutionOrder(): DependencyResolutionResult {
    const ordered: DependencyNode[] = [];

    const visited = new Set<string>();

    const active = new Set<string>();

    const circularDependencies: string[][] = [];

    for (const node of this.nodes.values()) {
      this.visitNode(node, visited, active, ordered, circularDependencies);
    }

    return {
      ordered,

      circularDependencies,

      success: circularDependencies.length === 0,
    };
  }

  /**
   * Visit dependency node.
   */
  private visitNode(
    node: DependencyNode,

    visited: Set<string>,

    active: Set<string>,

    ordered: DependencyNode[],

    circularDependencies: string[][],
  ): void {
    if (visited.has(node.id)) {
      return;
    }

    if (active.has(node.id)) {
      circularDependencies.push([...active, node.id]);

      return;
    }

    active.add(node.id);

    for (const dependencyId of node.dependencies) {
      const dependency = this.nodes.get(dependencyId);

      if (!dependency) {
        continue;
      }

      this.visitNode(
        dependency,
        visited,
        active,
        ordered,
        circularDependencies,
      );
    }

    active.delete(node.id);

    visited.add(node.id);

    ordered.push(node);
  }

  /**
   * Get graph node count.
   */
  public getNodeCount(): number {
    return this.nodes.size;
  }

  /**
   * Clear graph state.
   */
  public clear(): void {
    this.nodes.clear();
  }
}
