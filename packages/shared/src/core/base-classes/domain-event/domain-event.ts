export abstract class DomainEvent {
  public readonly occurredAt: Date;
  public readonly eventId: string;
  constructor(public readonly eventName: string) {
    this.occurredAt = new Date();
    this.eventId = crypto.randomUUID();
  }
}
