export abstract class DomainEvent {
  public transient = false; // Flag to indicate if the event should be persisted
  public readonly occurredAt: string;
  public readonly eventId: string;

  constructor(public readonly eventName: string) {
    this.occurredAt = new Date().toISOString();
    this.eventId = crypto.randomUUID();
  }

  /**
   * Converts the event to a plain object for serialization.
   * This is required for Cloudflare Workers RPC which doesn't support class instances.
   */
  public toJSON(): Record<string, any> {
    return {
      ...this,
      eventType: this.constructor.name,
    };
  }
}

