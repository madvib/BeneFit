import { DomainEvent } from '@bene/shared-domain';
import { FitnessGoals } from '@bene/training-core';

export interface FitnessGoalsUpdatedEventPayload {
  userId: string;
  oldGoals: FitnessGoals;
  newGoals: FitnessGoals;
  significantChange: boolean;
}

export class FitnessGoalsUpdatedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly oldGoals: FitnessGoals;
  public readonly newGoals: FitnessGoals;
  public readonly significantChange: boolean;

  constructor(payload: FitnessGoalsUpdatedEventPayload) {
    super('FitnessGoalsUpdated');
    this.userId = payload.userId;
    this.oldGoals = payload.oldGoals;
    this.newGoals = payload.newGoals;
    this.significantChange = payload.significantChange;
  }
}
