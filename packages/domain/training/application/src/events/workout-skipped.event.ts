import { DomainEvent } from '@bene/shared-domain';

export interface WorkoutSkippedEventPayload {
  userId: string;
  planId: string;
  workoutId: string;
  reason: string;
}

export class WorkoutSkippedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly planId: string;
  public readonly workoutId: string;
  public readonly reason: string;

  constructor(payload: WorkoutSkippedEventPayload) {
    super('WorkoutSkipped');
    this.userId = payload.userId;
    this.planId = payload.planId;
    this.workoutId = payload.workoutId;
    this.reason = payload.reason;
  }
}
