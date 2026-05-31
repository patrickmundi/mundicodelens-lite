import * as fs from "fs";

import * as path from "path";

export interface RepositoryMutationFileSnapshot {
  filePath: string;

  originalContent: string;
}

export interface RepositoryMutationOperation {
  operationId: string;

  filePath: string;

  updatedContent: string;
}

export interface RepositoryMutationTransaction {
  transactionId: string;

  startedAt: number;

  completedAt?: number;

  status: "PENDING" | "RUNNING" | "COMPLETED" | "FAILED" | "ROLLED_BACK";

  operations: RepositoryMutationOperation[];

  snapshots: RepositoryMutationFileSnapshot[];

  diagnostics: string[];
}

export interface RepositoryMutationTransactionResult {
  success: boolean;

  transaction: RepositoryMutationTransaction;

  error?: string;
}

export class RepositoryMutationTransactionService {
  /**
   * Execute repository mutation transaction.
   */
  public executeTransaction(
    operations: RepositoryMutationOperation[],
  ): RepositoryMutationTransactionResult {
    const transaction: RepositoryMutationTransaction = {
      transactionId: `repository-transaction-${Date.now()}`,

      startedAt: Date.now(),

      status: "PENDING",

      operations,

      snapshots: [],

      diagnostics: [],
    };

    try {
      transaction.status = "RUNNING";

      transaction.diagnostics.push("Repository mutation transaction started.");

      /**
       * Create snapshots.
       */
      for (const operation of operations) {
        const snapshot = this.createSnapshot(operation.filePath);

        transaction.snapshots.push(snapshot);

        transaction.diagnostics.push(
          `Snapshot created for '${operation.filePath}'.`,
        );
      }

      /**
       * Apply mutations.
       */
      for (const operation of operations) {
        transaction.diagnostics.push(
          `Applying mutation '${operation.operationId}'.`,
        );

        fs.writeFileSync(operation.filePath, operation.updatedContent, "utf-8");

        transaction.diagnostics.push(
          `Mutation applied to '${operation.filePath}'.`,
        );
      }

      transaction.status = "COMPLETED";

      transaction.completedAt = Date.now();

      transaction.diagnostics.push(
        "Repository mutation transaction completed successfully.",
      );

      return {
        success: true,

        transaction,
      };
    } catch (error) {
      transaction.status = "FAILED";

      transaction.completedAt = Date.now();

      transaction.diagnostics.push("Repository mutation transaction failed.");

      /**
       * Rollback transaction.
       */
      this.rollbackTransaction(transaction);

      transaction.status = "ROLLED_BACK";

      transaction.diagnostics.push(
        "Repository rollback completed successfully.",
      );

      return {
        success: false,

        transaction,

        error:
          error instanceof Error
            ? error.message
            : "Unknown repository transaction failure.",
      };
    }
  }

  /**
   * Create repository snapshot.
   */
  private createSnapshot(filePath: string): RepositoryMutationFileSnapshot {
    const originalContent = fs.existsSync(filePath)
      ? fs.readFileSync(filePath, "utf-8")
      : "";

    return {
      filePath,

      originalContent,
    };
  }

  /**
   * Rollback repository transaction.
   */
  private rollbackTransaction(
    transaction: RepositoryMutationTransaction,
  ): void {
    transaction.diagnostics.push("Initiating repository rollback.");

    for (const snapshot of transaction.snapshots) {
      fs.writeFileSync(snapshot.filePath, snapshot.originalContent, "utf-8");

      transaction.diagnostics.push(`Rollback restored '${snapshot.filePath}'.`);
    }
  }

  /**
   * Validate repository paths.
   */
  public validateTransactionPaths(
    operations: RepositoryMutationOperation[],
  ): boolean {
    return operations.every((operation) => {
      const normalized = path.normalize(operation.filePath);

      return normalized.endsWith(".ts") || normalized.endsWith(".tsx");
    });
  }

  /**
   * Generate repository transaction report.
   */
  public generateTransactionReport(
    result: RepositoryMutationTransactionResult,
  ): string {
    return [
      "=== Repository Mutation Transaction Report ===",

      "",

      `Success: ${result.success}`,

      `Transaction ID: ${result.transaction.transactionId}`,

      `Status: ${result.transaction.status}`,

      "",

      "Operations:",

      ...result.transaction.operations.map(
        (operation) => `- ${operation.operationId}`,
      ),

      "",

      "Snapshots:",

      ...result.transaction.snapshots.map(
        (snapshot) => `- ${snapshot.filePath}`,
      ),

      "",

      "Diagnostics:",

      ...result.transaction.diagnostics.map((diagnostic) => `- ${diagnostic}`),
    ].join("\n");
  }
}
