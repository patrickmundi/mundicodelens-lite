export interface EngineeringEvent {
  id: string;

  type: string;

  timestamp: Date;

  source: string;

  payload?: Record<string, unknown>;
}

export type EngineeringEventHandler = (event: EngineeringEvent) => void;

export interface EventSubscription {
  eventType: string;

  handler: EngineeringEventHandler;
}

export class EngineeringEventBusService {
  private readonly subscriptions: Map<string, EngineeringEventHandler[]> =
    new Map();

  /**
   * Subscribe to engineering events.
   */
  public subscribe(subscription: EventSubscription): void {
    const existingHandlers =
      this.subscriptions.get(subscription.eventType) ?? [];

    existingHandlers.push(subscription.handler);

    this.subscriptions.set(subscription.eventType, existingHandlers);

    console.log(
      `[EngineeringEventBus] Subscribed to event: ${subscription.eventType}`,
    );
  }

  /**
   * Publish engineering event.
   */
  public publish(event: EngineeringEvent): void {
    console.log(`[EngineeringEventBus] Publishing event: ${event.type}`);

    const handlers = this.subscriptions.get(event.type) ?? [];

    if (handlers.length === 0) {
      console.log(
        `[EngineeringEventBus] No handlers registered for: ${event.type}`,
      );

      return;
    }

    for (const handler of handlers) {
      try {
        handler(event);

        console.log(
          `[EngineeringEventBus] Event handled successfully: ${event.type}`,
        );
      } catch (error) {
        console.error(
          `[EngineeringEventBus] Event handler failure: ${event.type}`,
          error,
        );
      }
    }
  }

  /**
   * Remove all subscriptions
   * for a specific event type.
   */
  public clearEvent(eventType: string): void {
    this.subscriptions.delete(eventType);

    console.log(
      `[EngineeringEventBus] Cleared subscriptions for: ${eventType}`,
    );
  }

  /**
   * Clear all runtime subscriptions.
   */
  public clearAll(): void {
    this.subscriptions.clear();

    console.log("[EngineeringEventBus] Cleared all subscriptions.");
  }

  /**
   * Returns registered event types.
   */
  public getRegisteredEventTypes(): string[] {
    return Array.from(this.subscriptions.keys());
  }

  /**
   * Returns subscription count
   * for an event type.
   */
  public getSubscriptionCount(eventType: string): number {
    return this.subscriptions.get(eventType)?.length ?? 0;
  }
}
