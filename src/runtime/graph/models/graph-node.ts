export type GraphNodeType =
  | "file"
  | "folder"
  | "module"
  | "class"
  | "function"
  | "interface"
  | "type"
  | "service"
  | "component"
  | "hook"
  | "api"
  | "context"
  | "provider"
  | "unknown";

export interface GraphNodeMetadata {
  size?: number;
  extension?: string;
  imports?: string[];
  exports?: string[];
  tags?: string[];
  lastModified?: Date;
  [key: string]: unknown;
}

export interface GraphNode {
  /**
   * Unique identifier for the node.
   * Usually the normalized file path or symbol name.
   */
  id: string;

  /**
   * Human-readable node name.
   */
  name: string;

  /**
   * Type of engineering entity represented.
   */
  type: GraphNodeType;

  /**
   * Absolute or relative repository path.
   */
  path: string;

  /**
   * Optional parent node ID.
   * Useful for folder/module hierarchies.
   */
  parentId?: string;

  /**
   * Optional metadata container.
   */
  metadata?: GraphNodeMetadata;

  /**
   * Timestamp of node creation in graph memory.
   */
  createdAt: Date;

  /**
   * Timestamp of last graph update.
   */
  updatedAt: Date;
}
