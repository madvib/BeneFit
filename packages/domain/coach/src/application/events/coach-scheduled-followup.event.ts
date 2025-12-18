import { DomainEvent } from '@bene/shared-domain';

export interface CoachScheduledFollowupEventPayload {
  userId: string;
  details: string;
  timestamp: Date;
}

export class CoachScheduledFollowupEvent implements DomainEvent {
  public readonly eventName = 'CoachScheduledFollowup';
  public readonly payload: CoachScheduledFollowupEventPayload;
  public readonly occurredAt: Date;
  public readonly eventId: string;

  constructor(payload: CoachScheduledFollowupEventPayload) {
    this.payload = payload;
    this.occurredAt = new Date();
    this.eventId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
  }
}