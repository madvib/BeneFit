import { DomainEvent } from '@bene/shared';

export interface PlanActivatedEventPayload {
  userId: string;
  planId: string;
  startDate: string; // ISO 8601 timestamp
}

export class PlanActivatedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly planId: string;
  public readonly startDate: string;

  constructor(payload: PlanActivatedEventPayload) {
    super('PlanActivated');
    this.userId = payload.userId;
    this.planId = payload.planId;
    this.startDate = payload.startDate;
  }
}
