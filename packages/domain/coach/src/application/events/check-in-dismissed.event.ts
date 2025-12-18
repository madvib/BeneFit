import { DomainEvent } from '@bene/shared-domain';

export interface CheckInDismissedEventPayload {
  userId: string;
  checkInId: string;
}

export class CheckInDismissedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly checkInId: string;

  constructor(payload: CheckInDismissedEventPayload) {
    super('CheckInDismissed');
    this.userId = payload.userId;
    this.checkInId = payload.checkInId;
  }
}
