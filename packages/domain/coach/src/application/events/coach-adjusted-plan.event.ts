import { DomainEvent } from '@bene/shared';

export interface CoachAdjustedPlanEventPayload {
  userId: string;
  details: string;
  planChangeId?: string;
  timestamp: string;
}

export class CoachAdjustedPlanEvent extends DomainEvent {
  public readonly payload: CoachAdjustedPlanEventPayload;

  constructor(payload: CoachAdjustedPlanEventPayload) {
    super('CoachAdjustedPlan');
    this.payload = payload;
  }
}
