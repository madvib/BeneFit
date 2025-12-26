import { DomainEvent } from '@bene/shared';

export interface CoachActionPerformedEventPayload {
  userId: string;
  actionType: string;
  details: string;
  timestamp: Date;
}

export class CoachActionPerformedEvent implements DomainEvent {
  public readonly eventName: string;
  public readonly payload: CoachActionPerformedEventPayload;
  public readonly occurredAt: Date;
  public readonly eventId: string;

  constructor(payload: CoachActionPerformedEventPayload) {
    this.payload = payload;
    this.eventName = `Coach${payload.actionType.charAt(0).toUpperCase() + payload.actionType.slice(1)}`;
    this.occurredAt = new Date();
    this.eventId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
  }
}
