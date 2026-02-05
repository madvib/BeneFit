import { DomainEvent } from '@bene/shared';
import { TrainingConstraints } from '@bene/training-core';

export interface TrainingConstraintsUpdatedEventPayload {
  userId: string;
  constraints: TrainingConstraints;
  injuriesChanged: boolean;
  availableDaysChanged: boolean;
}

export class TrainingConstraintsUpdatedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly constraints: TrainingConstraints;
  public readonly injuriesChanged: boolean;
  public readonly availableDaysChanged: boolean;

  constructor(payload: TrainingConstraintsUpdatedEventPayload) {
    super('TrainingConstraintsUpdated');
    this.userId = payload.userId;
    this.constraints = payload.constraints;
    this.injuriesChanged = payload.injuriesChanged;
    this.availableDaysChanged = payload.availableDaysChanged;
  }
}
