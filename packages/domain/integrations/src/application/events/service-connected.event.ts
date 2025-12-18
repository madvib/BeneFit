import { DomainEvent } from '@bene/shared-domain';

export interface ServiceConnectedEventPayload {
  userId: string;
  serviceId: string;
  serviceType: string;
}

export class ServiceConnectedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly serviceId: string;
  public readonly serviceType: string;

  constructor(payload: ServiceConnectedEventPayload) {
    super('ServiceConnected');
    this.userId = payload.userId;
    this.serviceId = payload.serviceId;
    this.serviceType = payload.serviceType;
  }
}