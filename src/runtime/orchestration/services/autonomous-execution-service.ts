import { EngineeringDependencyGraphService } from "./engineering-dependency-graph-service";

import { EngineeringExecutionStateService } from "./engineering-execution-state-service";

import {
  EngineeringPhaseOrchestrator,
  PhaseExecutionStep,
} from "./engineering-phase-orchestrator";

export interface AutonomousExecutionResult {
  success: boolean;

  executedPhases: string[];

  failedPhase?: string;

  error?: string;
}

export class AutonomousExecutionService {
  constructor(
    private readonly dependencyGraph: EngineeringDependencyGraphService,

    private readonly executionState: EngineeringExecutionStateService,

    private readonly orchestrator: EngineeringPhaseOrchestrator,
  ) {}

  /**
   * Execute autonomous runtime pipeline.
   */
  public async execute(): Promise<AutonomousExecutionResult> {
    console.log("[AutonomousExecution] Starting autonomous execution.");

    const resolution = this.dependencyGraph.resolveExecutionOrder();

    if (!resolution.success) {
      console.error("[AutonomousExecution] Circular dependency detected.");

      return {
        success: false,

        executedPhases: [],

        error: "Circular dependency graph detected.",
      };
    }

    const executionSteps: PhaseExecutionStep[] = resolution.ordered.map(
      (node) => ({
        phase: node.id as any,

        description: `Executing ${node.id}`,

        metadata: node.metadata,
      }),
    );

    try {
      await this.orchestrator.executePhases(executionSteps);

      return {
        success: true,

        executedPhases: executionSteps.map((step) => step.phase),
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown execution failure.";

      console.error("[AutonomousExecution] Execution failed:", message);

      this.executionState.transitionTo(
        "rollback",

        "Execution failure triggered rollback.",
      );

      return {
        success: false,

        executedPhases: executionSteps.map((step) => step.phase),

        failedPhase: this.executionState.getCurrentPhase(),

        error: message,
      };
    }
  }
}
