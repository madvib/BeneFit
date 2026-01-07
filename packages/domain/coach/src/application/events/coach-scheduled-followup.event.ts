import { DomainEvent } from '@bene/shared';

export interface CoachScheduledFollowupEventPayload {
  userId: string;
  details: string;
  timestamp: string;
}

export class CoachScheduledFollowupEvent extends DomainEvent {
  public readonly payload: CoachScheduledFollowupEventPayload;

  constructor(payload: CoachScheduledFollowupEventPayload) {
    super('CoachScheduledFollowup');
    this.payload = payload;
  }
}
