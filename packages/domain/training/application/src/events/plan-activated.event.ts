import { DomainEvent } from '@bene/shared';

export interface PlanActivatedEventPayload {
  userId: string;
  planId: string;
  startDate: Date;
}

export class PlanActivatedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly planId: string;
  public readonly startDate: Date;

  constructor(payload: PlanActivatedEventPayload) {
    super('PlanActivated');
    this.userId = payload.userId;
    this.planId = payload.planId;
    this.startDate = payload.startDate;
  }
}
