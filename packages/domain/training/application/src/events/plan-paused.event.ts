import { DomainEvent } from '@bene/shared-domain';

export interface PlanPausedEventPayload {
  userId: string;
  planId: string;
  reason?: string;
}

export class PlanPausedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly planId: string;
  public readonly reason?: string;

  constructor(payload: PlanPausedEventPayload) {
    super('PlanPaused');
    this.userId = payload.userId;
    this.planId = payload.planId;
    this.reason = payload.reason;
  }
}
