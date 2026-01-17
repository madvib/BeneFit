import { describe, it, expect } from 'vitest';
import { createLiveActivityProgress } from '../live-activity-progress.factory.js';

describe('LiveActivityProgress', () => {
  describe('createLiveActivityProgress', () => {
    it('should create a valid live activity progress', () => {
      const result = createLiveActivityProgress({
        activityType: 'main',
        activityIndex: 0,
        totalActivities: 3,
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.activityType).toBe('main');
        expect(result.value.activityIndex).toBe(0);
        expect(result.value.totalActivities).toBe(3);
        expect(result.value.elapsedSeconds).toBe(0);
        expect(result.value.activityStartedAt).toBeDefined();
      }
    });

    it('should fail if required properties are missing', () => {
      const result = createLiveActivityProgress({
        // @ts-expect-error Testing invalid input
        activityType: null,
        activityIndex: 0,
        totalActivities: 3,
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail if activityIndex is out of range', () => {
      const result = createLiveActivityProgress({
        activityType: 'main',
        activityIndex: 3,
        totalActivities: 3,
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail if activityIndex is negative', () => {
      const result = createLiveActivityProgress({
        activityType: 'main',
        activityIndex: -1,
        totalActivities: 3,
      });

      expect(result.isFailure).toBe(true);
    });

    it('should create with interval progress', () => {
      const intervalProgress = {
        intervalNumber: 1,
        totalIntervals: 5,
        intervalDurationSeconds: 60,
        elapsedSeconds: 10,
        isResting: false,
      };

      const result = createLiveActivityProgress({
        activityType: 'main',
        activityIndex: 1,
        totalActivities: 3,
        intervalProgress,
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.intervalProgress).toEqual(intervalProgress);
      }
    });

    it('should create with exercise progress', () => {
      const exerciseProgress = [
        {
          exerciseName: 'Squats',
          currentSet: 1,
          totalSets: 3,
          repsCompleted: 10,
        },
      ];

      const result = createLiveActivityProgress({
        activityType: 'main',
        activityIndex: 1,
        totalActivities: 3,
        exerciseProgress,
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.exerciseProgress).toEqual(exerciseProgress);
      }
    });
  });
});
