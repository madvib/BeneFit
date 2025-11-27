import { isCredentialExpired, willExpireSoon } from "../../value-objects/oauth-credentials/oauth-credentials.js";
import { ConnectedService } from "./connected-service.js";

export function needsCredentialRefresh(service: ConnectedService): boolean {
  return isCredentialExpired(service.credentials) ||
    willExpireSoon(service.credentials, 30);
}

export function canSync(service: ConnectedService): boolean {
  return service.isActive &&
    !service.isPaused &&
    !isCredentialExpired(service.credentials);
}

export function shouldRetrySync(service: ConnectedService): boolean {
  if (!service.syncStatus.error) {
    return false;
  }

  if (service.syncStatus.error.retriesRemaining <= 0) {
    return false;
  }

  if (service.syncStatus.error.willRetryAt) {
    return new Date() >= service.syncStatus.error.willRetryAt;
  }

  return true;
}

export function getTimeSinceLastSync(service: ConnectedService): number | null {
  if (!service.lastSyncAt) {
    return null;
  }

  return Date.now() - service.lastSyncAt.getTime();
}

export function isSyncHealthy(service: ConnectedService): boolean {
  if (!service.isActive || service.isPaused) {
    return false;
  }

  // If never synced, that's okay (might be new)
  if (service.syncStatus.state === 'never_synced') {
    const hoursSinceConnection =
      (Date.now() - service.connectedAt.getTime()) / (1000 * 60 * 60);
    return hoursSinceConnection < 24; // Give 24 hours for first sync
  }

  // Check for recent errors
  if (service.syncStatus.consecutiveFailures >= 3) {
    return false;
  }

  // Check if we've synced recently (within 48 hours)
  const timeSinceSync = getTimeSinceLastSync(service);
  if (timeSinceSync === null || timeSinceSync > 48 * 60 * 60 * 1000) {
    return false;
  }

  return true;
}

export function getTotalSyncedItems(service: ConnectedService): number {
  return service.syncStatus.workoutsSynced +
    service.syncStatus.activitiesSynced +
    service.syncStatus.heartRateDataSynced;
}

export function getSyncSuccessRate(service: ConnectedService): number {
  // This would need to track attempts vs successes
  // For now, simple heuristic based on consecutive failures
  if (service.syncStatus.consecutiveFailures === 0) {
    return 1.0;
  }

  return Math.max(0, 1 - (service.syncStatus.consecutiveFailures * 0.2));
}