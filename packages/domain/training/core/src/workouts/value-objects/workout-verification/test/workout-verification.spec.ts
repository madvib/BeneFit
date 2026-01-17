import { describe, it, expect } from 'vitest';
import { createWorkoutVerification } from '../workout-verification.factory.js';

describe('WorkoutVerification', () => {
  describe('createWorkoutVerification', () => {
    it('should create manual verification', () => {
      const result = createWorkoutVerification({
        verifications: [{ method: 'manual', data: null }],
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.verified).toBe(false);
        expect(result.value.sponsorEligible).toBe(false);
      }
    });

    it('should create valid GPS verification', () => {
      const result = createWorkoutVerification({
        verifications: [
          {
            method: 'gps',
            data: {
              latitude: 40.7128,
              longitude: -74.006,
              accuracy: 10,
              timestamp: new Date(),
            },
          },
        ],
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.verified).toBe(true);
        expect(result.value.sponsorEligible).toBe(true);
        expect(result.value.verifiedAt).toBeDefined();
      }
    });

    it('should create valid Gym Checkin verification', () => {
      const result = createWorkoutVerification({
        verifications: [
          {
            method: 'gym_checkin',
            data: {
              gymId: 'gym-123',
              gymName: 'Gold Gym',
              checkinTime: new Date(),
            },
          },
        ],
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.verified).toBe(true);
        expect(result.value.sponsorEligible).toBe(true);
      }
    });

    it('should fail if GPS coordinates are invalid', () => {
      const result = createWorkoutVerification({
        verifications: [
          {
            method: 'gps',
            data: {
              latitude: 100, // Invalid
              longitude: -74.006,
              accuracy: 10,
              timestamp: new Date(),
            },
          },
        ],
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail if gym checkout is before checkin', () => {
      const checkinTime = new Date('2023-01-01T10:00:00Z');
      const checkoutTime = new Date('2023-01-01T09:00:00Z');

      const result = createWorkoutVerification({
        verifications: [
          {
            method: 'gym_checkin',
            data: {
              gymId: 'gym-123',
              gymName: 'Gold Gym',
              checkinTime,
              checkoutTime,
            },
          },
        ],
      });

      expect(result.isFailure).toBe(true);
    });
  });
});
