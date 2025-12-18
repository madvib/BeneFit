import { DomainEvent } from '@bene/shared-domain';

export interface ServiceDisconnectedEventPayload {
  userId: string;
  serviceId: string;
  serviceType: string;
}

export class ServiceDisconnectedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly serviceId: string;
  public readonly serviceType: string;

  constructor(payload: ServiceDisconnectedEventPayload) {
    super('ServiceDisconnected');
    this.userId = payload.userId;
    this.serviceId = payload.serviceId;
    this.serviceType = payload.serviceType;
  }
}