import { DomainEvent } from '@bene/shared-domain';

export interface ProactiveCheckInTriggeredEventPayload {
  userId: string;
  checkInId: string;
  trigger: string;
}

export class ProactiveCheckInTriggeredEvent extends DomainEvent {
  public readonly userId: string;
  public readonly checkInId: string;
  public readonly trigger: string;

  constructor(payload: ProactiveCheckInTriggeredEventPayload) {
    super('ProactiveCheckInTriggered');
    this.userId = payload.userId;
    this.checkInId = payload.checkInId;
    this.trigger = payload.trigger;
  }
}
