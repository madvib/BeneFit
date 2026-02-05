import { DomainEvent } from '@bene/shared';

export interface UserJoinedWorkoutEventPayload {
  sessionId: string;
  userId: string;
  userName: string;
}

export class UserJoinedWorkoutEvent extends DomainEvent {
  public readonly payload: UserJoinedWorkoutEventPayload;

  constructor(payload: UserJoinedWorkoutEventPayload) {
    super('UserJoinedWorkout');
    this.payload = payload;
  }
}
