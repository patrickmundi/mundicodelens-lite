import path from "path";

import { DependencyScanner } from "./dependency-scanner";

import type { GraphEdge } from "../models/graph-edge";
import type { GraphNode } from "../models/graph-node";
import type { RepositoryGraph } from "../models/repository-graph";

export interface GraphBuilderOptions {
  rootPath: string;
  tsConfigFilePath?: string;
}

export class GraphBuilder {
  private readonly dependencyScanner: DependencyScanner;

  constructor(options: GraphBuilderOptions) {
    this.dependencyScanner = new DependencyScanner({
      rootPath: options.rootPath,
      tsConfigFilePath: options.tsConfigFilePath,
    });
  }

  /**
   * Builds the repository knowledge graph.
   */
  public build(): RepositoryGraph {
    const dependencyMap = this.dependencyScanner.scan();

    const nodes = new Map<string, GraphNode>();

    const edges: GraphEdge[] = [];

    for (const [filePath, dependencies] of dependencyMap.entries()) {
      const fileNode = this.createFileNode(filePath);

      nodes.set(fileNode.id, fileNode);

      for (const importedModule of dependencies.imports) {
        const targetId = this.normalizePath(importedModule.moduleSpecifier);

        if (!nodes.has(targetId)) {
          nodes.set(targetId, this.createExternalNode(targetId));
        }

        const edge: GraphEdge = {
          id: `${fileNode.id}->${targetId}`,

          from: fileNode.id,

          to: targetId,

          relationship: "imports",

          metadata: {
            isTypeOnly: importedModule.isTypeOnly,
          },

          createdAt: new Date(),

          updatedAt: new Date(),
        };

        edges.push(edge);
      }
    }

    return {
      nodes,
      edges,

      metadata: {
        totalFiles: nodes.size,
        totalDependencies: edges.length,
        lastScannedAt: new Date(),
      },

      createdAt: new Date(),

      updatedAt: new Date(),
    };
  }

  /**
   * Creates a graph node representing a repository file.
   */
  private createFileNode(filePath: string): GraphNode {
    const normalizedPath = this.normalizePath(filePath);

    return {
      id: normalizedPath,

      name: path.basename(normalizedPath),

      type: "file",

      path: normalizedPath,

      metadata: {
        extension: path.extname(normalizedPath),
      },

      createdAt: new Date(),

      updatedAt: new Date(),
    };
  }

  /**
   * Creates a placeholder node for external imports.
   */
  private createExternalNode(modulePath: string): GraphNode {
    return {
      id: modulePath,

      name: modulePath,

      type: "module",

      path: modulePath,

      metadata: {
        external: true,
      },

      createdAt: new Date(),

      updatedAt: new Date(),
    };
  }

  /**
   * Normalizes paths for graph consistency.
   */
  private normalizePath(filePath: string): string {
    return path.normalize(filePath).replace(/\\/g, "/");
  }
}
