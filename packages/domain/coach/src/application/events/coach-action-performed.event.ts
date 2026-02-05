import { DomainEvent } from '@bene/shared';

export interface CoachActionPerformedEventPayload {
  userId: string;
  actionType: string;
  details: string;
  timestamp: string;
}

export class CoachActionPerformedEvent extends DomainEvent {
  public readonly payload: CoachActionPerformedEventPayload;

  constructor(payload: CoachActionPerformedEventPayload) {
    // Dynamic event name based on action type
    const eventName = `Coach${ payload.actionType.charAt(0).toUpperCase() + payload.actionType.slice(1) }`;
    super(eventName);
    this.payload = payload;
  }
}
