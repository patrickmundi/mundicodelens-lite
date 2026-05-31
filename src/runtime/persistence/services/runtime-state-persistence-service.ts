import * as fs from "fs";

import * as path from "path";

import { MutationApprovalRequest } from "../../governance/services/mutation-approval-workflow-service";

import { RuntimeTelemetrySnapshot } from "../../telemetry/services/runtime-cognition-telemetry-service";

export interface RuntimePersistenceState {
  persistedAt: number;

  approvalRequests: MutationApprovalRequest[];

  telemetrySnapshots: RuntimeTelemetrySnapshot[];

  repositoryEvolutionHistory: string[];

  governanceAuditTrail: string[];

  cognitionContinuityState: Record<string, unknown>;
}

export interface RuntimePersistenceResult {
  success: boolean;

  persistenceFilePath: string;

  diagnostics: string[];

  error?: string;
}

export class RuntimeStatePersistenceService {
  private readonly persistenceDirectory = path.resolve(
    process.cwd(),
    ".mundicodelens",
  );

  private readonly persistenceFilePath = path.resolve(
    this.persistenceDirectory,
    "runtime-state.json",
  );

  /**
   * Persist runtime state.
   */
  public persistRuntimeState(
    state: RuntimePersistenceState,
  ): RuntimePersistenceResult {
    const diagnostics: string[] = [];

    try {
      diagnostics.push("Initializing runtime persistence pipeline.");

      /**
       * Ensure persistence directory exists.
       */
      if (!fs.existsSync(this.persistenceDirectory)) {
        fs.mkdirSync(this.persistenceDirectory, {
          recursive: true,
        });

        diagnostics.push("Persistence directory created successfully.");
      }

      /**
       * Serialize runtime state.
       */
      const serializedState = JSON.stringify(state, null, 2);

      /**
       * Persist runtime state.
       */
      fs.writeFileSync(this.persistenceFilePath, serializedState, "utf-8");

      diagnostics.push(
        `Runtime state persisted to '${this.persistenceFilePath}'.`,
      );

      diagnostics.push(
        `Persisted ${state.approvalRequests.length} approval requests.`,
      );

      diagnostics.push(
        `Persisted ${state.telemetrySnapshots.length} telemetry snapshots.`,
      );

      diagnostics.push(
        `Persisted ${state.repositoryEvolutionHistory.length} repository evolution records.`,
      );

      diagnostics.push("Runtime persistence completed successfully.");

      return {
        success: true,

        persistenceFilePath: this.persistenceFilePath,

        diagnostics,
      };
    } catch (error) {
      return {
        success: false,

        persistenceFilePath: this.persistenceFilePath,

        diagnostics,

        error:
          error instanceof Error
            ? error.message
            : "Unknown runtime persistence failure.",
      };
    }
  }

  /**
   * Load persisted runtime state.
   */
  public loadRuntimeState(): RuntimePersistenceState | null {
    try {
      if (!fs.existsSync(this.persistenceFilePath)) {
        return null;
      }

      const rawState = fs.readFileSync(this.persistenceFilePath, "utf-8");

      return JSON.parse(rawState) as RuntimePersistenceState;
    } catch {
      return null;
    }
  }

  /**
   * Clear persisted runtime state.
   */
  public clearRuntimeState(): RuntimePersistenceResult {
    const diagnostics: string[] = [];

    try {
      diagnostics.push("Clearing persisted runtime state.");

      if (fs.existsSync(this.persistenceFilePath)) {
        fs.unlinkSync(this.persistenceFilePath);

        diagnostics.push("Persisted runtime state removed successfully.");
      } else {
        diagnostics.push("No persisted runtime state detected.");
      }

      return {
        success: true,

        persistenceFilePath: this.persistenceFilePath,

        diagnostics,
      };
    } catch (error) {
      return {
        success: false,

        persistenceFilePath: this.persistenceFilePath,

        diagnostics,

        error:
          error instanceof Error
            ? error.message
            : "Unknown runtime state clearing failure.",
      };
    }
  }

  /**
   * Append repository evolution record.
   */
  public appendEvolutionRecord(record: string): RuntimePersistenceResult {
    const currentState = this.loadRuntimeState() ?? this.buildDefaultState();

    currentState.repositoryEvolutionHistory.push(record);

    currentState.persistedAt = Date.now();

    return this.persistRuntimeState(currentState);
  }

  /**
   * Append governance audit event.
   */
  public appendGovernanceAudit(auditRecord: string): RuntimePersistenceResult {
    const currentState = this.loadRuntimeState() ?? this.buildDefaultState();

    currentState.governanceAuditTrail.push(auditRecord);

    currentState.persistedAt = Date.now();

    return this.persistRuntimeState(currentState);
  }

  /**
   * Update cognition continuity state.
   */
  public updateCognitionContinuity(
    key: string,

    value: unknown,
  ): RuntimePersistenceResult {
    const currentState = this.loadRuntimeState() ?? this.buildDefaultState();

    currentState.cognitionContinuityState[key] = value;

    currentState.persistedAt = Date.now();

    return this.persistRuntimeState(currentState);
  }

  /**
   * Build default persistence state.
   */
  private buildDefaultState(): RuntimePersistenceState {
    return {
      persistedAt: Date.now(),

      approvalRequests: [],

      telemetrySnapshots: [],

      repositoryEvolutionHistory: [],

      governanceAuditTrail: [],

      cognitionContinuityState: {},
    };
  }

  /**
   * Generate persistence report.
   */
  public generatePersistenceReport(result: RuntimePersistenceResult): string {
    return [
      "=== Runtime State Persistence Report ===",

      "",

      `Success: ${result.success}`,

      `Persistence File: ${result.persistenceFilePath}`,

      "",

      "Diagnostics:",

      ...result.diagnostics.map((diagnostic) => `- ${diagnostic}`),

      "",

      result.error
        ? `Error: ${result.error}`
        : "Runtime persistence completed successfully.",
    ].join("\n");
  }
}
