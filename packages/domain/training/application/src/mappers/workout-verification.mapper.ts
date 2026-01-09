import {
  WorkoutVerification,
  VerificationData,
} from '@bene/training-core';
import {
  type WorkoutVerification as SharedWorkoutVerification,
} from '@bene/shared';

export function toDomainWorkoutVerification(
  verification: SharedWorkoutVerification,
): WorkoutVerification {
  // New shared schema has verifications array with discriminated union
  // Map each verification item from shared to domain format

  const verificationItems: VerificationData[] = verification.verifications.map((item) => {
    switch (item.method) {
      case 'gps':
        return {
          method: 'gps' as const,
          data: {
            latitude: item.data.latitude,
            longitude: item.data.longitude,
            accuracy: item.data.accuracy,
            timestamp: new Date(item.data.timestamp),
          },
        };
      case 'gym_checkin':
        return {
          method: 'gym_checkin' as const,
          data: {
            gymId: item.data.gymId,
            gymName: item.data.gymName,
            checkinTime: new Date(item.data.checkinTime),
            checkoutTime: item.data.checkoutTime ? new Date(item.data.checkoutTime) : undefined,
          },
        };
      case 'wearable':
        return {
          method: 'wearable' as const,
          data: {
            device: item.data.device,
            activityId: item.data.activityId,
            source: item.data.source as 'strava' | 'garmin' | 'apple_health' | 'other',
            syncedAt: new Date(item.data.syncedAt),
          },
        };
      case 'photo':
        return {
          method: 'photo' as const,
          data: {
            photoUrl: item.data.photoUrl,
            uploadedAt: new Date(item.data.uploadedAt),
            verified: item.data.verified,
          },
        };
      case 'witness':
        return {
          method: 'witness' as const,
          data: {
            witnessUserId: item.data.witnessUserId,
            witnessName: item.data.witnessName,
            verifiedAt: new Date(item.data.verifiedAt),
          },
        };
      case 'manual':
      default:
        return {
          method: 'manual' as const,
          data: null,
        };
    }
  });

  return {
    verified: verification.verified,
    verifications: verificationItems,
    sponsorEligible: verification.sponsorEligible || false,
    verifiedAt: verification.verifiedAt ? new Date(verification.verifiedAt) : undefined,
  };
}
