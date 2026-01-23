
import { describe, it, expect } from 'vitest';
import { CreateWorkoutVerificationSchema } from '../workout-verification.factory.js';
import { WorkoutVerificationSchema } from '../workout-verification.types.js';
import { toWorkoutVerificationView } from '../workout-verification.view.js';
import { createGPSVerifiedWorkoutFixture } from '@/fixtures.js';

describe('WorkoutVerification', () => {
  describe('creation', () => {
    it('should create manual verification', () => {
      // Act
      const result = CreateWorkoutVerificationSchema.safeParse({
        verifications: [{ method: 'manual', data: null }],
      });

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.verified).toBe(false);
        expect(result.data.sponsorEligible).toBe(false);
      }
    });

    it('should create valid GPS verification', () => {
      // Act
      const result = CreateWorkoutVerificationSchema.safeParse({
        verifications: [
          {
            method: 'gps',
            data: {
              latitude: 40.7128, // Example latitude (New York City)
              longitude: -74.0060, // Example longitude (New York City)
              accuracy: 10,
              timestamp: new Date(),
            },
          },
        ],
      });

      // Assert
      if (!result.success) {
        console.log('GPS Verification Error:', JSON.stringify(result.error.format(), null, 2));
      }
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.verified).toBe(true);
        expect(result.data.sponsorEligible).toBe(true);
        expect(result.data.verifiedAt).toBeDefined();
      }
    });

    it('should create valid Gym Checkin verification', () => {
      // Act
      const gymName = 'Fitness Plus Gym';
      const result = CreateWorkoutVerificationSchema.safeParse({
        verifications: [
          {
            method: 'gym_checkin',
            data: {
              gymId: crypto.randomUUID(),
              gymName,
              checkinTime: new Date(),
            },
          },
        ],
      });

      // Assert
      if (!result.success) {
        console.log('Gym Checkin Error:', JSON.stringify(result.error.format(), null, 2));
      }
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.verified).toBe(true);
        expect(result.data.sponsorEligible).toBe(true);
      }
    });
  });

  describe('validation', () => {
    it('should fail if GPS coordinates are invalid', () => {
      // Act
      const result = CreateWorkoutVerificationSchema.safeParse({
        verifications: [
          {
            method: 'gps',
            data: {
              latitude: 100, // Invalid (> 90)
              longitude: -74.0060, // Example longitude (New York City)
              accuracy: 10,
              timestamp: new Date(),
            },
          },
        ],
      });

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail if gym checkout is before checkin', () => {
      // Arrange
      const checkinTime = new Date('2023-01-01T10:00:00Z');
      const checkoutTime = new Date('2023-01-01T09:00:00Z');

      // Act
      const result = CreateWorkoutVerificationSchema.safeParse({
        verifications: [
          {
            method: 'gym_checkin',
            data: {
              gymId: crypto.randomUUID(),
              gymName: 'Fitness Plus Gym',
              checkinTime,
              checkoutTime,
            },
          },
        ],
      });

      // Assert
      expect(result.success).toBe(false);
    });
  });
});


describe('WorkoutVerification View', () => {
  it('should map valid verification to view DTO', () => {
    const verification = createGPSVerifiedWorkoutFixture();
    const view = toWorkoutVerificationView(verification);
    const result = WorkoutVerificationSchema.safeParse(view);

    if (!result.success) {
      console.log(JSON.stringify(result.error.format(), null, 2));
    }

    expect(result.success).toBe(true);
    if (view.verifiedAt) {
      expect(typeof view.verifiedAt).toBe('string');
    }
  });
});
