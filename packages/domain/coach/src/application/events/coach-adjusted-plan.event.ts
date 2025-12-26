import { DomainEvent } from '@bene/shared';

export interface CoachAdjustedPlanEventPayload {
  userId: string;
  details: string;
  planChangeId?: string;
  timestamp: Date;
}

export class CoachAdjustedPlanEvent implements DomainEvent {
  public readonly eventName = 'CoachAdjustedPlan';
  public readonly payload: CoachAdjustedPlanEventPayload;
  public readonly occurredAt: Date;
  public readonly eventId: string;

  constructor(payload: CoachAdjustedPlanEventPayload) {
    this.payload = payload;
    this.occurredAt = new Date();
    this.eventId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
  }
}
