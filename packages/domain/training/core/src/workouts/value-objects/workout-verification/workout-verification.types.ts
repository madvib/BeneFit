export type VerificationMethod =
  | 'gps' // Location tracking
  | 'gym_checkin' // Gym partner integration
  | 'wearable' // Apple Watch, Garmin, etc.
  | 'photo' // Photo evidence
  | 'witness' // Another user witnessed
  | 'manual'; // Self-reported, no verification

export interface GPSVerification {
  latitude: number;
  longitude: number;
  accuracy: number; // meters
  timestamp: Date;
}

export interface GymCheckinVerification {
  gymId: string;
  gymName: string;
  checkinTime: Date;
  checkoutTime?: Date;
}

export interface WearableVerification {
  device: string; // e.g., "Apple Watch Series 8"
  activityId: string; // ID in wearable system
  source: 'apple_health' | 'garmin' | 'fitbit' | 'strava' | 'other';
  syncedAt: Date;
}

export interface PhotoVerification {
  photoUrl: string;
  uploadedAt: Date;
  verified: boolean; // Manually verified by admin/AI
}

export interface WitnessVerification {
  witnessUserId: string;
  witnessName: string;
  verifiedAt: Date;
}

export type VerificationData =
  | { method: 'gps'; data: GPSVerification }
  | { method: 'gym_checkin'; data: GymCheckinVerification }
  | { method: 'wearable'; data: WearableVerification }
  | { method: 'photo'; data: PhotoVerification }
  | { method: 'witness'; data: WitnessVerification }
  | { method: 'manual'; data: null };

export interface WorkoutVerificationData {
  verified: boolean;
  verifications: VerificationData[];
  sponsorEligible: boolean; // Can corporate sponsors count this?
  verifiedAt?: Date;
}

export type WorkoutVerification = Readonly<WorkoutVerificationData>;
