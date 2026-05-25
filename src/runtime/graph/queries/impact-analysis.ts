import { DependencyQuery } from "./dependency-query";

import type { RepositoryGraph } from "../models/repository-graph";

export interface ImpactAnalysisResult {
  target: string;

  directDependents: string[];

  indirectDependents: string[];

  totalAffectedNodes: number;
}

export class ImpactAnalysis {
  private readonly dependencyQuery: DependencyQuery;

  constructor(private readonly graph: RepositoryGraph) {
    this.dependencyQuery = new DependencyQuery(graph);
  }

  /**
   * Analyzes repository impact
   * starting from a target node.
   */
  public analyze(targetNodeId: string): ImpactAnalysisResult {
    /**
     * Tracks traversal state.
     */
    const visited = new Set<string>();

    /**
     * Direct dependents.
     */
    const directDependents = this.dependencyQuery.getDependents(targetNodeId);

    /**
     * Tracks unique indirect dependents.
     */
    const indirectDependentSet = new Set<string>();

    /**
     * Traverse recursively.
     */
    for (const dependent of directDependents) {
      this.traverseDependents(dependent, visited, indirectDependentSet);
    }

    /**
     * Prevent overlap between
     * direct and indirect results.
     */
    for (const directDependent of directDependents) {
      indirectDependentSet.delete(directDependent);
    }

    const indirectDependents = Array.from(indirectDependentSet);

    return {
      target: targetNodeId,

      directDependents,

      indirectDependents,

      totalAffectedNodes: directDependents.length + indirectDependents.length,
    };
  }

  /**
   * Recursively traverses
   * dependency relationships.
   */
  private traverseDependents(
    nodeId: string,
    visited: Set<string>,
    results: Set<string>,
  ): void {
    if (visited.has(nodeId)) {
      return;
    }

    visited.add(nodeId);

    const dependents = this.dependencyQuery.getDependents(nodeId);

    for (const dependent of dependents) {
      /**
       * Deduplicated insertion.
       */
      results.add(dependent);

      this.traverseDependents(dependent, visited, results);
    }
  }
}
