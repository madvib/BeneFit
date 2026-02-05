import { faker } from '@faker-js/faker';
import { WorkoutVerification } from '../workout-verification.types.js';
import { workoutVerificationFromPersistence } from '../workout-verification.factory.js';
/**
 * ============================================================================
 * WORKOUT VERIFICATION FIXTURES (Canonical Pattern)
 * ============================================================================
 * 
 * Uses rehydration factory + realistic faker data.
 * Each fixture represents a common verification scenario.
 */

// ============================================================================
// HELPER: Create fixture via rehydration
// ============================================================================

function createFixture(data: WorkoutVerification): WorkoutVerification {
  const result = workoutVerificationFromPersistence(data);

  if (result.isFailure) {
    throw new Error(`Failed to create WorkoutVerification fixture: ${ result.error }`);
  }

  return result.value;
}

// ============================================================================
// UNVERIFIED
// ============================================================================

export function createUnverifiedWorkoutFixture(
  overrides?: Partial<WorkoutVerification>
): WorkoutVerification {
  return createFixture({
    verified: false,
    verifications: [],
    sponsorEligible: false,
    verifiedAt: undefined,
    ...overrides,
  });
}

export function createManualVerifiedWorkoutFixture(
  overrides?: Partial<WorkoutVerification>
): WorkoutVerification {
  return createFixture({
    verified: false,
    verifications: [
      {
        method: 'manual',
        data: null,
      },
    ],
    sponsorEligible: false,
    verifiedAt: undefined,
    ...overrides,
  });
}

// ============================================================================
// GPS VERIFIED
// ============================================================================

export function createGPSVerifiedWorkoutFixture(
  overrides?: Partial<WorkoutVerification>
): WorkoutVerification {
  // Generate realistic GPS coordinates (major city)
  const latitude = faker.location.latitude({ max: 60, min: 25 }); // Continental US range
  const longitude = faker.location.longitude({ max: -65, min: -125 });

  return createFixture({
    verified: true,
    verifications: [
      {
        method: 'gps',
        data: {
          latitude,
          longitude,
          accuracy: faker.number.int({ min: 5, max: 50 }), // meters
          timestamp: faker.date.recent({ days: 1 }),
        },
      },
    ],
    sponsorEligible: true,
    verifiedAt: faker.date.recent({ days: 1 }),
    ...overrides,
  });
}

// ============================================================================
// GYM CHECK-IN VERIFIED
// ============================================================================

export function createGymCheckinVerifiedWorkoutFixture(
  overrides?: Partial<WorkoutVerification>
): WorkoutVerification {
  const checkinTime = faker.date.recent({ days: 1 });
  const checkoutTime = new Date(checkinTime.getTime() + faker.number.int({ min: 30, max: 120 }) * 60 * 1000);

  // Realistic gym names
  const gymNames = [
    'Gold\'s Gym',
    'Planet Fitness',
    '24 Hour Fitness',
    'LA Fitness',
    'Equinox',
    'Crunch Fitness',
    'Life Time Fitness',
    'Anytime Fitness',
  ];

  return createFixture({
    verified: true,
    verifications: [
      {
        method: 'gym_checkin',
        data: {
          gymId: faker.string.uuid(),
          gymName: faker.helpers.arrayElement(gymNames),
          checkinTime,
          checkoutTime,
        },
      },
    ],
    sponsorEligible: true,
    verifiedAt: checkinTime,
    ...overrides,
  });
}

// ============================================================================
// WEARABLE VERIFIED
// ============================================================================

export function createWearableVerifiedWorkoutFixture(
  overrides?: Partial<WorkoutVerification>
): WorkoutVerification {
  // Realistic wearable devices
  const devices = [
    'Apple Watch Series 9',
    'Apple Watch Ultra 2',
    'Garmin Forerunner 965',
    'Garmin Fenix 7',
    'Fitbit Charge 6',
    'Fitbit Sense 2',
    'Whoop 4.0',
    'Polar Vantage V3',
  ];

  const sources = ['apple_health', 'garmin', 'fitbit', 'strava', 'other'] as const;

  const syncedAt = faker.date.recent({ days: 1 });

  return createFixture({
    verified: true,
    verifications: [
      {
        method: 'wearable',
        data: {
          device: faker.helpers.arrayElement(devices),
          activityId: faker.string.alphanumeric(12),
          source: faker.helpers.arrayElement(sources),
          syncedAt,
        },
      },
    ],
    sponsorEligible: true,
    verifiedAt: syncedAt,
    ...overrides,
  });
}

// ============================================================================
// PHOTO VERIFIED
// ============================================================================

export function createPhotoVerifiedWorkoutFixture(
  overrides?: Partial<WorkoutVerification>
): WorkoutVerification {
  const uploadedAt = faker.date.recent({ days: 1 });

  return createFixture({
    verified: true,
    verifications: [
      {
        method: 'photo',
        data: {
          photoUrl: faker.image.url(),
          uploadedAt,
          verified: true,
        },
      },
    ],
    sponsorEligible: false, // Photos are weak verification
    verifiedAt: uploadedAt,
    ...overrides,
  });
}

// ============================================================================
// WITNESS VERIFIED
// ============================================================================

export function createWitnessVerifiedWorkoutFixture(
  overrides?: Partial<WorkoutVerification>
): WorkoutVerification {
  const verifiedAt = faker.date.recent({ days: 1 });

  return createFixture({
    verified: true,
    verifications: [
      {
        method: 'witness',
        data: {
          witnessUserId: faker.string.uuid(),
          witnessName: faker.person.fullName(),
          verifiedAt,
        },
      },
    ],
    sponsorEligible: false, // Witness is weak verification
    verifiedAt,
    ...overrides,
  });
}

// ============================================================================
// MULTI-VERIFICATION (STRONGEST)
// ============================================================================

export function createMultiVerifiedWorkoutFixture(
  overrides?: Partial<WorkoutVerification>
): WorkoutVerification {
  const timestamp = faker.date.recent({ days: 1 });
  const latitude = faker.location.latitude({ max: 60, min: 25 });
  const longitude = faker.location.longitude({ max: -65, min: -125 });

  const devices = [
    'Apple Watch Series 9',
    'Garmin Forerunner 965',
    'Whoop 4.0',
  ];

  return createFixture({
    verified: true,
    verifications: [
      {
        method: 'gps',
        data: {
          latitude,
          longitude,
          accuracy: faker.number.int({ min: 5, max: 20 }),
          timestamp,
        },
      },
      {
        method: 'wearable',
        data: {
          device: faker.helpers.arrayElement(devices),
          activityId: faker.string.alphanumeric(12),
          source: 'apple_health',
          syncedAt: timestamp,
        },
      },
    ],
    sponsorEligible: true,
    verifiedAt: timestamp,
    ...overrides,
  });
}

// ============================================================================
// GENERIC (RANDOM)
// ============================================================================

/**
 * Creates a random WorkoutVerification with any verification method.
 * Useful for stress testing and variety in tests.
 */
export function createWorkoutVerificationFixture(
  overrides?: Partial<WorkoutVerification>
): WorkoutVerification {
  const methods = [
    createUnverifiedWorkoutFixture,
    createManualVerifiedWorkoutFixture,
    createGPSVerifiedWorkoutFixture,
    createGymCheckinVerifiedWorkoutFixture,
    createWearableVerifiedWorkoutFixture,
    createPhotoVerifiedWorkoutFixture,
    createWitnessVerifiedWorkoutFixture,
    createMultiVerifiedWorkoutFixture,
  ];

  const randomMethod = faker.helpers.arrayElement(methods);
  return randomMethod(overrides);
}
