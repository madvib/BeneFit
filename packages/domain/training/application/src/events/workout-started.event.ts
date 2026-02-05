import { DomainEvent } from '@bene/shared';

export interface WorkoutStartedEventPayload {
  userId: string;
  sessionId: string;
  planId?: string;
}

export class WorkoutStartedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly sessionId: string;
  public readonly planId?: string;

  constructor(payload: WorkoutStartedEventPayload) {
    super('WorkoutStarted');
    this.userId = payload.userId;
    this.sessionId = payload.sessionId;
    this.planId = payload.planId;
  }
}
