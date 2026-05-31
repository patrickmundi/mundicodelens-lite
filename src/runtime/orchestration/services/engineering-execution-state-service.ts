import {
  EngineeringEvent,
  EngineeringEventBusService,
} from "./engineering-event-bus-service";

export type ExecutionPhase =
  | "idle"
  | "planning"
  | "validation"
  | "mutation"
  | "rollback"
  | "completed"
  | "failed";

export interface ExecutionStateSnapshot {
  phase: ExecutionPhase;

  timestamp: Date;

  description: string;

  metadata?: Record<string, unknown>;
}

export class EngineeringExecutionStateService {
  private currentPhase: ExecutionPhase = "idle";

  private readonly history: ExecutionStateSnapshot[] = [];

  constructor(private readonly eventBus: EngineeringEventBusService) {}

  /**
   * Transition runtime
   * execution phase.
   */
  public transitionTo(
    phase: ExecutionPhase,
    description: string,
    metadata?: Record<string, unknown>,
  ): void {
    this.currentPhase = phase;

    const snapshot: ExecutionStateSnapshot = {
      phase,

      timestamp: new Date(),

      description,

      metadata,
    };

    this.history.push(snapshot);

    console.log(`[ExecutionState] Transitioned to phase: ${phase}`);

    const event: EngineeringEvent = {
      id: crypto.randomUUID(),

      type: "execution.phase.transition",

      timestamp: new Date(),

      source: "EngineeringExecutionStateService",

      payload: {
        phase,

        description,

        metadata,
      },
    };

    this.eventBus.publish(event);
  }

  /**
   * Returns current
   * execution phase.
   */
  public getCurrentPhase(): ExecutionPhase {
    return this.currentPhase;
  }

  /**
   * Returns execution
   * history snapshots.
   */
  public getHistory(): ExecutionStateSnapshot[] {
    return [...this.history];
  }

  /**
   * Returns latest
   * execution snapshot.
   */
  public getLatestSnapshot(): ExecutionStateSnapshot | undefined {
    return this.history[this.history.length - 1];
  }

  /**
   * Clears runtime
   * execution history.
   */
  public clearHistory(): void {
    this.history.length = 0;

    console.log("[ExecutionState] History cleared.");
  }

  /**
   * Detects whether runtime
   * execution is active.
   */
  public isExecutionActive(): boolean {
    return (
      this.currentPhase !== "idle" &&
      this.currentPhase !== "completed" &&
      this.currentPhase !== "failed"
    );
  }
}
