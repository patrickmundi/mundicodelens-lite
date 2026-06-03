export type TelemetryEventType =
  | "CAPABILITY_REGISTERED"
  | "CAPABILITY_ENABLED"
  | "CAPABILITY_DISABLED"
  | "MUTATION_EXECUTED"
  | "MUTATION_FAILED"
  | "REPOSITORY_SCANNED"
  | "DRY_RUN_COMPLETED"
  | "RUNTIME_WARNING"
  | "RUNTIME_ERROR";

export interface EngineeringTelemetryEvent {
  eventId: string;

  eventType: TelemetryEventType;

  timestamp: Date;

  source: string;

  message: string;

  metadata?: Record<string, unknown>;
}

export interface EngineeringTelemetrySnapshot {
  totalEvents: number;

  totalWarnings: number;

  totalErrors: number;

  totalMutations: number;

  totalScans: number;

  generatedAt: Date;
}

export class EngineeringTelemetryService {
  private readonly events: EngineeringTelemetryEvent[] = [];

  /**
   * Record telemetry event.
   */
  public recordEvent(
    eventType: TelemetryEventType,
    source: string,
    message: string,
    metadata?: Record<string, unknown>,
  ): EngineeringTelemetryEvent {
    const event: EngineeringTelemetryEvent = {
      eventId: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,

      eventType,

      timestamp: new Date(),

      source,

      message,

      metadata,
    };

    this.events.push(event);

    return event;
  }

  /**
   * Retrieve all telemetry events.
   */
  public getEvents(): EngineeringTelemetryEvent[] {
    return [...this.events];
  }

  /**
   * Retrieve events by type.
   */
  public getEventsByType(
    eventType: TelemetryEventType,
  ): EngineeringTelemetryEvent[] {
    return this.events.filter((event) => event.eventType === eventType);
  }

  /**
   * Clear telemetry history.
   */
  public clearEvents(): void {
    this.events.length = 0;
  }

  /**
   * Generate runtime telemetry snapshot.
   */
  public generateSnapshot(): EngineeringTelemetrySnapshot {
    return {
      totalEvents: this.events.length,

      totalWarnings: this.getEventsByType("RUNTIME_WARNING").length,

      totalErrors: this.getEventsByType("RUNTIME_ERROR").length,

      totalMutations:
        this.getEventsByType("MUTATION_EXECUTED").length +
        this.getEventsByType("MUTATION_FAILED").length,

      totalScans: this.getEventsByType("REPOSITORY_SCANNED").length,

      generatedAt: new Date(),
    };
  }
}
