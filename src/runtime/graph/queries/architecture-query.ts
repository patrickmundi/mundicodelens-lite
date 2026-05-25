import { DependencyQuery } from "./dependency-query";

import type { RepositoryGraph } from "../models/repository-graph";

export interface ArchitectureRule {
  sourcePattern: RegExp;

  forbiddenPattern: RegExp;

  message: string;
}

export interface ArchitectureViolation {
  source: string;

  dependency: string;

  message: string;
}

export class ArchitectureQuery {
  private readonly dependencyQuery: DependencyQuery;

  constructor(private readonly graph: RepositoryGraph) {
    this.dependencyQuery = new DependencyQuery(graph);
  }

  /**
   * Validates repository architecture
   * against governance rules.
   */
  public validateRules(rules: ArchitectureRule[]): ArchitectureViolation[] {
    const violations: ArchitectureViolation[] = [];

    const nodeIds = this.dependencyQuery.getAllNodeIds();

    for (const nodeId of nodeIds) {
      const dependencies = this.dependencyQuery.getDependencies(nodeId);

      for (const dependency of dependencies) {
        for (const rule of rules) {
          const sourceMatches = rule.sourcePattern.test(nodeId);

          const dependencyMatches = rule.forbiddenPattern.test(dependency);

          if (sourceMatches && dependencyMatches) {
            violations.push({
              source: nodeId,

              dependency,

              message: rule.message,
            });
          }
        }
      }
    }

    return violations;
  }

  /**
   * Finds all dependencies
   * matching a pattern.
   */
  public findDependenciesMatching(pattern: RegExp): string[] {
    const matches = new Set<string>();

    const nodeIds = this.dependencyQuery.getAllNodeIds();

    for (const nodeId of nodeIds) {
      const dependencies = this.dependencyQuery.getDependencies(nodeId);

      for (const dependency of dependencies) {
        if (pattern.test(dependency)) {
          matches.add(dependency);
        }
      }
    }

    return Array.from(matches);
  }

  /**
   * Finds all nodes matching pattern.
   */
  public findNodesMatching(pattern: RegExp): string[] {
    return this.dependencyQuery
      .getAllNodeIds()
      .filter((nodeId) => pattern.test(nodeId));
  }
}
