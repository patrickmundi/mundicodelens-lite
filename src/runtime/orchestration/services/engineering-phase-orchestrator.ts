import crypto from "crypto";
import {
  EngineeringExecutionStateService,
  ExecutionPhase,
} from "./engineering-execution-state-service";

import { EngineeringEventBusService } from "./engineering-event-bus-service";

export interface PhaseExecutionStep {
  phase: ExecutionPhase;

  description: string;

  metadata?: Record<string, unknown>;
}

export class EngineeringPhaseOrchestrator {
  constructor(
    private readonly executionStateService: EngineeringExecutionStateService,

    private readonly eventBus: EngineeringEventBusService,
  ) {}

  /**
   * Execute ordered
   * engineering phases.
   */
  public async executePhases(phases: PhaseExecutionStep[]): Promise<void> {
    console.log("[PhaseOrchestrator] Starting execution pipeline.");

    for (const step of phases) {
      await this.executeStep(step);
    }

    this.executionStateService.transitionTo(
      "completed",
      "Engineering execution pipeline completed.",
    );

    console.log("[PhaseOrchestrator] Execution pipeline completed.");
  }

  /**
   * Execute a single
   * orchestration step.
   */
  private async executeStep(step: PhaseExecutionStep): Promise<void> {
    console.log(`[PhaseOrchestrator] Executing phase: ${step.phase}`);

    this.executionStateService.transitionTo(
      step.phase,
      step.description,
      step.metadata,
    );

    this.eventBus.publish({
      id: crypto.randomUUID(),

      type: "engineering.phase.executed",

      timestamp: new Date(),

      source: "EngineeringPhaseOrchestrator",

      payload: {
        phase: step.phase,

        description: step.description,

        metadata: step.metadata,
      },
    });

    /**
     * Simulated orchestration delay.
     */
    await this.delay(100);
  }

  /**
   * Runtime execution delay.
   */
  private async delay(milliseconds: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  }
}
