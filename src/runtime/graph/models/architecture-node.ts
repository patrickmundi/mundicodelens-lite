import type { GraphNode, GraphNodeMetadata } from "./graph-node";

export type ArchitectureLayer =
  | "presentation"
  | "application"
  | "domain"
  | "infrastructure"
  | "runtime"
  | "orchestration"
  | "memory"
  | "observability"
  | "governance"
  | "unknown";

export interface ArchitectureViolation {
  rule: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
}

export interface ArchitectureNodeMetadata extends GraphNodeMetadata {
  boundedContext?: string;
  module?: string;
  layer?: ArchitectureLayer;
  owner?: string;
  tags?: string[];
  violations?: ArchitectureViolation[];
  isEntrypoint?: boolean;
  isShared?: boolean;
  stability?: "stable" | "experimental" | "deprecated";
}

export interface ArchitectureNode extends GraphNode {
  /**
   * Architecture-specific metadata.
   */
  metadata?: ArchitectureNodeMetadata;

  /**
   * Logical architecture layer.
   */
  layer: ArchitectureLayer;

  /**
   * Whether the node is governed by architecture rules.
   */
  governed: boolean;

  /**
   * Optional architecture boundary.
   */
  boundary?: string;
}
