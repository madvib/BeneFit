import { DomainEvent } from '@bene/shared';

export interface UserJoinedWorkoutEventPayload {
  sessionId: string;
  userId: string;
  userName: string;
}

export class UserJoinedWorkoutEvent implements DomainEvent {
  public readonly eventName = 'UserJoinedWorkout';
  public readonly payload: UserJoinedWorkoutEventPayload;
  public readonly occurredAt: Date;
  public readonly eventId: string;

  constructor(payload: UserJoinedWorkoutEventPayload) {
    this.payload = payload;
    this.occurredAt = new Date();
    this.eventId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`;
  }
}
