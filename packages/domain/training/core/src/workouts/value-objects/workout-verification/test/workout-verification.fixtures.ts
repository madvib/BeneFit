import { WorkoutVerification } from '../workout-verification.types.js';
import { createWorkoutVerification } from '../workout-verification.factory.js';

/**
 * Canonical Fixtures for WorkoutVerification
 */

export function createUnverifiedWorkoutFixture(overrides?: Partial<WorkoutVerification>): WorkoutVerification {
  const result = createWorkoutVerification({
    verifications: [],
  });

  if (result.isFailure) {
    throw new Error(`Failed to create fixture: ${ result.error }`);
  }

  return { ...result.value, ...overrides };
}

export function createGPSVerifiedWorkoutFixture(overrides?: Partial<WorkoutVerification>): WorkoutVerification {
  const result = createWorkoutVerification({

    verifications: [{
      method: 'gps',
      data: {
        latitude: 37.7749,
        longitude: -122.4194,
        accuracy: 10,
        timestamp: new Date(),
      },
    }],
  });

  if (result.isFailure) {
    throw new Error(`Failed to create fixture: ${ result.error }`);
  }

  return { ...result.value, ...overrides };
}

export function createWearableVerifiedWorkoutFixture(overrides?: Partial<WorkoutVerification>): WorkoutVerification {
  const result = createWorkoutVerification({
    verifications: [{
      method: 'wearable',
      data: {
        device: 'Apple Watch Series 8',
        activityId: 'workout-123',
        source: 'apple_health',
        syncedAt: new Date(),
      },
    }],
  });

  if (result.isFailure) {
    throw new Error(`Failed to create fixture: ${ result.error }`);
  }

  return { ...result.value, ...overrides };
}

export function createGymCheckinVerifiedWorkoutFixture(overrides?: Partial<WorkoutVerification>): WorkoutVerification {
  const result = createWorkoutVerification({
    verifications: [{
      method: 'gym_checkin',
      data: {
        gymId: 'gym-456',
        gymName: 'Gold\'s Gym',
        checkinTime: new Date('2024-01-15T10:00:00Z'),
        checkoutTime: new Date('2024-01-15T11:30:00Z'),
      },
    }],
  });

  if (result.isFailure) {
    throw new Error(`Failed to create fixture: ${ result.error }`);
  }

  return { ...result.value, ...overrides };
}
