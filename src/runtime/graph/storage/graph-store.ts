import fs from "fs";
import path from "path";

import type { RepositoryGraph } from "../models/repository-graph";

export interface GraphStoreOptions {
  storagePath: string;
}

export class GraphStore {
  private readonly storagePath: string;

  constructor(options: GraphStoreOptions) {
    this.storagePath = path.normalize(options.storagePath);
  }

  /**
   * Saves the repository graph to disk.
   */
  public save(graph: RepositoryGraph): void {
    try {
      const serializedGraph = JSON.stringify(
        {
          ...graph,

          nodes: Array.from(graph.nodes.entries()),
        },
        null,
        2,
      );

      this.ensureStorageDirectory();

      fs.writeFileSync(this.storagePath, serializedGraph, "utf-8");
    } catch (error) {
      console.error("[GraphStore] Failed to save graph:", error);

      throw error;
    }
  }

  /**
   * Loads the repository graph from disk.
   */
  public load(): RepositoryGraph | null {
    try {
      if (!fs.existsSync(this.storagePath)) {
        return null;
      }

      const rawContent = fs.readFileSync(this.storagePath, "utf-8");

      const parsed = JSON.parse(rawContent);

      return {
        ...parsed,

        nodes: new Map(parsed.nodes),
      } as RepositoryGraph;
    } catch (error) {
      console.error("[GraphStore] Failed to load graph:", error);

      return null;
    }
  }

  /**
   * Deletes the persisted graph file.
   */
  public clear(): void {
    try {
      if (fs.existsSync(this.storagePath)) {
        fs.unlinkSync(this.storagePath);
      }
    } catch (error) {
      console.error("[GraphStore] Failed to clear graph store:", error);

      throw error;
    }
  }

  /**
   * Checks whether persisted graph data exists.
   */
  public exists(): boolean {
    return fs.existsSync(this.storagePath);
  }

  /**
   * Ensures the storage directory exists.
   */
  private ensureStorageDirectory(): void {
    const directory = path.dirname(this.storagePath);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, {
        recursive: true,
      });
    }
  }
}
