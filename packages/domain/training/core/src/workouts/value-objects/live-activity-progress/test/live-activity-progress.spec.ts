import { describe, it, expect } from 'vitest';
import { CreateLiveActivityProgressSchema } from '../live-activity-progress.factory.js';
import { createLiveActivityProgressFixture, createIntervalProgressFixture, createExerciseProgressFixture } from './live-activity-progress.fixtures.js';

describe('LiveActivityProgress', () => {
  describe('creation', () => {
    it('should create a valid live activity progress with fixture', () => {
      // Arrange & Act
      const progress = createLiveActivityProgressFixture({
        activityType: 'main',
        activityIndex: 0,
        totalActivities: 3,
      });

      // Assert
      expect(progress.activityType).toBe('main');
      expect(progress.activityIndex).toBe(0);
      expect(progress.totalActivities).toBe(3);
      expect(progress.elapsedSeconds).toBeDefined();
      expect(progress.activityStartedAt).toBeDefined();
    });

    it('should create with interval progress', () => {
      // Arrange
      const intervalProgress = createIntervalProgressFixture({
        intervalNumber: 1,
        totalIntervals: 5,
        intervalDurationSeconds: 60,
        elapsedSeconds: 10,
        isResting: false,
      });

      // Act
      const progress = createLiveActivityProgressFixture({
        activityType: 'interval',
        activityIndex: 1,
        totalActivities: 3,
        intervalProgress,
      });

      // Assert
      expect(progress.intervalProgress).toEqual(intervalProgress);
    });

    it('should create with exercise progress', () => {
      // Arrange
      const exerciseProgress = [
        createExerciseProgressFixture({
          exerciseName: 'Squats',
          currentSet: 1,
          totalSets: 3,
          repsCompleted: 10,
        }),
      ];

      // Act
      const progress = createLiveActivityProgressFixture({
        activityType: 'main',
        activityIndex: 1,
        totalActivities: 3,
        exerciseProgress,
      });

      // Assert
      expect(progress.exerciseProgress).toEqual(exerciseProgress);
    });
  });

  describe('validation', () => {
    it('should fail if required properties are missing', () => {
      // Arrange
      const invalidInput = {
        // @ts-expect-error Testing invalid input
        activityType: null,
        activityIndex: 0,
        totalActivities: 3,
      };

      // Act
      const parseResult = CreateLiveActivityProgressSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail if activityIndex is out of range', () => {
      // Arrange
      const invalidInput = {
        activityType: 'main',
        activityIndex: 3,
        totalActivities: 3,
      };

      // Act
      const parseResult = CreateLiveActivityProgressSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail if activityIndex is negative', () => {
      // Arrange
      const invalidInput = {
        activityType: 'main',
        activityIndex: -1,
        totalActivities: 3,
      };

      // Act
      const parseResult = CreateLiveActivityProgressSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });
  });
});
