import { DomainEvent } from '@bene/shared';
import type { NormalizedActivity } from '@core/normalized-activity.js';

export interface ActivitiesSyncedEventPayload {
  userId: string;
  serviceId: string;
  serviceType: string;
  activities: NormalizedActivity[]; // Normalized contract, not Strava-specific
  syncedAt: string; // ISO 8601 timestamp
}

/**
 * Event emitted when activities are synced from an external service.
 * Activities are normalized to a common structure.
 */
export class ActivitiesSyncedEvent extends DomainEvent {
  public readonly userId: string;
  public readonly serviceId: string;
  public readonly serviceType: string;
  public readonly activities: NormalizedActivity[];
  public readonly syncedAt: string;

  constructor(payload: ActivitiesSyncedEventPayload) {
    super('ActivitiesSynced');
    this.userId = payload.userId;
    this.serviceId = payload.serviceId;
    this.serviceType = payload.serviceType;
    this.activities = payload.activities;
    this.syncedAt = payload.syncedAt;
  }
}
