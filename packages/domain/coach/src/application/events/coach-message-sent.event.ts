import { DomainEvent } from '@bene/shared-domain';

export interface CoachMessageSentEventPayload {
  userId: string;
  conversationId: string;
  actionsApplied: number;
}

export class CoachMessageSentEvent extends DomainEvent {
  public readonly userId: string;
  public readonly conversationId: string;
  public readonly actionsApplied: number;

  constructor(payload: CoachMessageSentEventPayload) {
    super('CoachMessageSent');
    this.userId = payload.userId;
    this.conversationId = payload.conversationId;
    this.actionsApplied = payload.actionsApplied;
  }
}