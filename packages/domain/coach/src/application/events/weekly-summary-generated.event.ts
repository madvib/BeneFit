import { DomainEvent } from '@bene/shared-domain';

export interface WeeklySummaryGeneratedEventPayload {
  userId: string;
  summary: string;
}

export class WeeklySummaryGeneratedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly summary: string;

  constructor(payload: WeeklySummaryGeneratedEventPayload) {
    super('WeeklySummaryGenerated');
    this.userId = payload.userId;
    this.summary = payload.summary;
  }
}
