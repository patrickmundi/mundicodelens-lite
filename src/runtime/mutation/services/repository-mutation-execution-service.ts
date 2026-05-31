import * as fs from "fs";

import * as path from "path";

export interface RepositoryMutationTarget {
  filePath: string;

  mutationType: "CREATE" | "UPDATE" | "DELETE";

  content?: string;
}

export interface RepositoryMutationSnapshot {
  snapshotId: string;

  filePath: string;

  originalContent: string;

  timestamp: number;
}

export interface RepositoryMutationExecutionResult {
  success: boolean;

  modifiedFiles: string[];

  generatedDiffs: string[];

  rollbackSnapshots: RepositoryMutationSnapshot[];

  executionLogs: string[];

  error?: string;
}

export class RepositoryMutationExecutionService {
  private readonly rollbackSnapshots: RepositoryMutationSnapshot[] = [];

  /**
   * Execute repository mutations safely.
   */
  public executeMutations(
    targets: RepositoryMutationTarget[],
  ): RepositoryMutationExecutionResult {
    const logs: string[] = [];

    const modifiedFiles: string[] = [];

    const generatedDiffs: string[] = [];

    try {
      for (const target of targets) {
        logs.push(`Processing '${target.filePath}'.`);

        /**
         * Create rollback snapshot.
         */
        const snapshot = this.createRollbackSnapshot(target.filePath);

        if (snapshot) {
          this.rollbackSnapshots.push(snapshot);

          logs.push(`Rollback snapshot created for '${target.filePath}'.`);
        }

        /**
         * Execute mutation.
         */
        switch (target.mutationType) {
          case "CREATE":
            this.createFile(target.filePath, target.content ?? "");

            break;

          case "UPDATE":
            this.updateFile(target.filePath, target.content ?? "");

            break;

          case "DELETE":
            this.deleteFile(target.filePath);

            break;
        }

        modifiedFiles.push(target.filePath);

        generatedDiffs.push(this.generateDiff(target));

        logs.push(`Mutation applied to '${target.filePath}'.`);
      }

      return {
        success: true,

        modifiedFiles,

        generatedDiffs,

        rollbackSnapshots: this.rollbackSnapshots,

        executionLogs: logs,
      };
    } catch (error) {
      logs.push(`Mutation execution failed.`);

      return {
        success: false,

        modifiedFiles,

        generatedDiffs,

        rollbackSnapshots: this.rollbackSnapshots,

        executionLogs: logs,

        error:
          error instanceof Error ? error.message : "Unknown mutation error.",
      };
    }
  }

  /**
   * Create rollback snapshot.
   */
  private createRollbackSnapshot(
    filePath: string,
  ): RepositoryMutationSnapshot | undefined {
    if (!fs.existsSync(filePath)) {
      return undefined;
    }

    const originalContent = fs.readFileSync(filePath, "utf-8");

    return {
      snapshotId: `snapshot-${Date.now()}`,

      filePath,

      originalContent,

      timestamp: Date.now(),
    };
  }

  /**
   * Create file safely.
   */
  private createFile(
    filePath: string,

    content: string,
  ): void {
    this.ensureDirectoryExists(filePath);

    fs.writeFileSync(filePath, content, "utf-8");
  }

  /**
   * Update file safely.
   */
  private updateFile(
    filePath: string,

    content: string,
  ): void {
    this.ensureDirectoryExists(filePath);

    fs.writeFileSync(filePath, content, "utf-8");
  }

  /**
   * Delete file safely.
   */
  private deleteFile(filePath: string): void {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  /**
   * Ensure directory exists.
   */
  private ensureDirectoryExists(filePath: string): void {
    const directory = path.dirname(filePath);

    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, {
        recursive: true,
      });
    }
  }

  /**
   * Generate mutation diff.
   */
  private generateDiff(target: RepositoryMutationTarget): string {
    return [
      `Mutation Type: ${target.mutationType}`,

      `Target File: ${target.filePath}`,

      `Timestamp: ${Date.now()}`,
    ].join("\n");
  }

  /**
   * Restore rollback snapshot.
   */
  public restoreSnapshot(snapshotId: string): boolean {
    const snapshot = this.rollbackSnapshots.find(
      (item) => item.snapshotId === snapshotId,
    );

    if (!snapshot) {
      return false;
    }

    fs.writeFileSync(snapshot.filePath, snapshot.originalContent, "utf-8");

    return true;
  }

  /**
   * Get rollback snapshots.
   */
  public getSnapshots(): RepositoryMutationSnapshot[] {
    return this.rollbackSnapshots;
  }
}
