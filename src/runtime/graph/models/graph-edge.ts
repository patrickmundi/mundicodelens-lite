export type GraphRelationshipType =
  | "imports"
  | "exports"
  | "depends_on"
  | "extends"
  | "implements"
  | "calls"
  | "uses"
  | "contains"
  | "references"
  | "provides"
  | "consumes"
  | "registers"
  | "unknown";

export interface GraphEdgeMetadata {
  isDynamic?: boolean;
  isTypeOnly?: boolean;
  source?: string;
  notes?: string;
  weight?: number;
  [key: string]: unknown;
}

export interface GraphEdge {
  /**
   * Unique edge identifier.
   */
  id: string;

  /**
   * Source node ID.
   */
  from: string;

  /**
   * Target node ID.
   */
  to: string;

  /**
   * Relationship between source and target.
   */
  relationship: GraphRelationshipType;

  /**
   * Optional metadata container.
   */
  metadata?: GraphEdgeMetadata;

  /**
   * Timestamp of edge creation.
   */
  createdAt: Date;

  /**
   * Timestamp of last update.
   */
  updatedAt: Date;
}
