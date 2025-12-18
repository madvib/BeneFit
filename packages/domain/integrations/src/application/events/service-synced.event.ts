import { DomainEvent } from '@bene/shared-domain';

export interface ServiceSyncedEventPayload {
  userId: string;
  serviceId: string;
  workoutsSynced: number;
}

export class ServiceSyncedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly serviceId: string;
  public readonly workoutsSynced: number;

  constructor(payload: ServiceSyncedEventPayload) {
    super('ServiceSynced');
    this.userId = payload.userId;
    this.serviceId = payload.serviceId;
    this.workoutsSynced = payload.workoutsSynced;
  }
}
