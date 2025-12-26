import { DomainEvent } from '@bene/shared';

export interface PlanAdjustedEventPayload {
  userId: string;
  planId: string;
  feedback: string;
}

export class PlanAdjustedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly planId: string;
  public readonly feedback: string;

  constructor(payload: PlanAdjustedEventPayload) {
    super('PlanAdjusted');
    this.userId = payload.userId;
    this.planId = payload.planId;
    this.feedback = payload.feedback;
  }
}
