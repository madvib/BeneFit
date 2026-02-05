import { DomainEvent } from '@bene/shared';

export interface CheckInRespondedEventPayload {
  userId: string;
  checkInId: string;
  actionsApplied: number;
}

export class CheckInRespondedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly checkInId: string;
  public readonly actionsApplied: number;

  constructor(payload: CheckInRespondedEventPayload) {
    super('CheckInResponded');
    this.userId = payload.userId;
    this.checkInId = payload.checkInId;
    this.actionsApplied = payload.actionsApplied;
  }
}
