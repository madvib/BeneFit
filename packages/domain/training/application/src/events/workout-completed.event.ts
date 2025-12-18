import { DomainEvent } from '@bene/shared-domain';

export interface WorkoutCompletedEventPayload {
  userId: string;
  workoutId: string;
  planId?: string;
}

export class WorkoutCompletedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly workoutId: string;
  public readonly planId?: string;

  constructor(payload: WorkoutCompletedEventPayload) {
    super('WorkoutCompleted');
    this.userId = payload.userId;
    this.workoutId = payload.workoutId;
    this.planId = payload.planId;
  }
}
