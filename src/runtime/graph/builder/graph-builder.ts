import fs from "fs";
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

    /**
     * First pass:
     * create repository file nodes.
     */
    for (const [filePath] of dependencyMap.entries()) {
      const fileNode = this.createFileNode(filePath);

      nodes.set(fileNode.id, fileNode);
    }

    /**
     * Second pass:
     * build dependency edges.
     */
    for (const [filePath, dependencies] of dependencyMap.entries()) {
      const sourceId = this.normalizePath(filePath);

      for (const importedModule of dependencies.imports) {
        const targetId = this.resolveImportTarget(importedModule);

        if (!targetId) {
          continue;
        }

        /**
         * Create placeholder node
         * for unresolved external modules.
         */
        if (!nodes.has(targetId)) {
          nodes.set(targetId, this.createExternalNode(targetId));
        }

        const edge: GraphEdge = {
          id: `${sourceId}->${targetId}`,

          from: sourceId,

          to: targetId,

          relationship: "imports",

          metadata: {
            isTypeOnly: importedModule.isTypeOnly,

            isExternal: importedModule.isExternal,
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
   * Resolves import target into
   * actual repository path when possible.
   */
  private resolveImportTarget(importedModule: any): string | null {
    /**
     * External dependency.
     */
    if (importedModule.isExternal) {
      return this.normalizePath(importedModule.moduleSpecifier);
    }

    /**
     * Relative dependency.
     */
    const candidatePath = importedModule.resolvedCandidatePath;

    if (!candidatePath) {
      return null;
    }

    const resolvedPath = this.resolveExistingFile(candidatePath);

    if (!resolvedPath) {
      return this.normalizePath(candidatePath);
    }

    return resolvedPath;
  }

  /**
   * Attempts to resolve actual
   * repository file path.
   */
  private resolveExistingFile(basePath: string): string | null {
    const possibleExtensions = [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      "/index.ts",
      "/index.tsx",
      "/index.js",
      "/index.jsx",
    ];

    /**
     * Direct file match.
     */
    if (fs.existsSync(basePath) && fs.statSync(basePath).isFile()) {
      return this.normalizePath(basePath);
    }

    /**
     * Extension-based resolution.
     */
    for (const extension of possibleExtensions) {
      const fullPath = `${basePath}${extension}`;

      if (fs.existsSync(fullPath)) {
        return this.normalizePath(fullPath);
      }
    }

    return null;
  }

  /**
   * Creates a graph node representing
   * a repository file.
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
   * Creates placeholder node
   * for unresolved/external modules.
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
   * Normalizes paths for
   * graph consistency.
   */
  private normalizePath(filePath: string): string {
    return path.normalize(filePath).replace(/\\/g, "/");
  }
}
