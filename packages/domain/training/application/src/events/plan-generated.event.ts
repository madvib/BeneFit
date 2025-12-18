import { DomainEvent } from '@bene/shared-domain';
import { PlanGoals } from '@bene/training-core';

export interface PlanGeneratedEventPayload {
  userId: string;
  planId: string;
  goals: PlanGoals;
}

export class PlanGeneratedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly planId: string;
  public readonly goals: PlanGoals;

  constructor(payload: PlanGeneratedEventPayload) {
    super('PlanGenerated');
    this.userId = payload.userId;
    this.planId = payload.planId;
    this.goals = payload.goals;
  }
}
