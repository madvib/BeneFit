import { DomainEvent } from '@bene/shared';

export interface ProfileCreatedEventPayload {
  userId: string;
}

export class ProfileCreatedEvent extends DomainEvent {
  public readonly userId: string;

  constructor(payload: ProfileCreatedEventPayload) {
    super('ProfileCreated');
    this.userId = payload.userId;
  }
}
