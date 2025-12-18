import { DomainEvent } from '@bene/shared-domain';

export interface WorkoutReactionAddedEventPayload {
  workoutId: string;
  workoutOwnerId: string;
  reactorId: string;
  reactorName: string;
  reactionType: 'fire' | 'strong' | 'clap' | 'heart' | 'smile';
}

export class WorkoutReactionAddedEvent extends DomainEvent {
  public readonly workoutId: string;
  public readonly workoutOwnerId: string;
  public readonly reactorId: string;
  public readonly reactorName: string;
  public readonly reactionType: 'fire' | 'strong' | 'clap' | 'heart' | 'smile';

  constructor(payload: WorkoutReactionAddedEventPayload) {
    super('WorkoutReactionAdded');
    this.workoutId = payload.workoutId;
    this.workoutOwnerId = payload.workoutOwnerId;
    this.reactorId = payload.reactorId;
    this.reactorName = payload.reactorName;
    this.reactionType = payload.reactionType;
  }
}
