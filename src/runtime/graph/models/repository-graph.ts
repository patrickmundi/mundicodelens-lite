import type { GraphEdge } from "./graph-edge";
import type { GraphNode } from "./graph-node";

export interface RepositoryGraphMetadata {
  repositoryName?: string;
  repositoryPath?: string;
  totalFiles?: number;
  totalFolders?: number;
  totalDependencies?: number;
  lastScannedAt?: Date;
  version?: string;
  [key: string]: unknown;
}

export interface RepositoryGraph {
  /**
   * All graph nodes indexed by their unique ID.
   */
  nodes: Map<string, GraphNode>;

  /**
   * All graph relationships.
   */
  edges: GraphEdge[];

  /**
   * Optional repository-level metadata.
   */
  metadata?: RepositoryGraphMetadata;

  /**
   * Timestamp of graph creation.
   */
  createdAt: Date;

  /**
   * Timestamp of latest graph update.
   */
  updatedAt: Date;
}
