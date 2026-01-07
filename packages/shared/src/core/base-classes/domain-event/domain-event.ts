export abstract class DomainEvent {
  public readonly occurredAt: string;
  public readonly eventId: string;
  constructor(public readonly eventName: string) {
    this.occurredAt = new Date().toISOString();
    this.eventId = crypto.randomUUID();
  }
}

