import { describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';
import { CreateLiveActivityProgressSchema } from '../live-activity-progress.factory.js';
import {
  createLiveActivityProgressFixture,
  createIntervalProgressFixture,
  createExerciseProgressFixture,
} from '@/fixtures.js';

describe('LiveActivityProgress', () => {
  describe('creation', () => {
    it('should create a valid live activity progress with fixture', () => {
      // Arrange & Act
      const activityIndex = faker.number.int({ min: 0, max: 2 });
      const totalActivities = 3;
      const progress = createLiveActivityProgressFixture({
        activityType: 'main',
        activityIndex,
        totalActivities,
      });

      // Assert
      expect(progress.activityType).toBe('main');
      expect(progress.activityIndex).toBe(activityIndex);
      expect(progress.totalActivities).toBe(totalActivities);
      expect(progress.elapsedSeconds).toBeDefined();
      expect(progress.activityStartedAt).toBeDefined();
    });

    it('should create with interval progress', () => {
      // Arrange
      const intervalNumber = faker.number.int({ min: 1, max: 5 });
      const totalIntervals = 5;
      const intervalProgress = createIntervalProgressFixture({
        intervalNumber,
        totalIntervals,
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
      const currentSet = faker.number.int({ min: 1, max: 3 });
      const exerciseProgress = [
        createExerciseProgressFixture({
          currentSet,
          totalSets: 3,
          repsCompleted: 10,
        }),
      ];

      // Act
      const progress = createLiveActivityProgressFixture({
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
