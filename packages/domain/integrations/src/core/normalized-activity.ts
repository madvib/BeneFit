/**
 * Normalized activity data structure for cross-domain consumption.
 * Integrations domain maps external service data to this shape.
 * Other domains (e.g., Training) consume this without knowing about Strava/etc.
 */
export interface NormalizedActivity {
  externalId: string; // e.g., Strava activity ID
  type: string; // e.g., 'Run', 'Ride', 'Swim'
  name: string;
  startDate: string; // ISO 8601
  duration: number; // seconds
  distance?: number; // meters
  isManual: boolean; // Was it manually entered or GPS-tracked?

  // Performance metrics (all optional)
  averageHeartRate?: number;
  maxHeartRate?: number;
  averagePower?: number;
  maxPower?: number;
  averageCadence?: number;
  averageSpeed?: number;
  maxSpeed?: number;
  elevationGain?: number; // meters
  calories?: number;

  // Location data (optional)
  startLatitude?: number;
  startLongitude?: number;

  // Privacy/sharing
  isPrivate: boolean;
}
