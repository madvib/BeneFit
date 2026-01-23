
import { describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';
import {
  CreateWorkoutGoalsSchema,
  createDistanceWorkout,
  createDurationWorkout,
  createVolumeWorkout,
} from '../workout-goals.factory.js';
import {
  hasDistanceGoal,
  hasDurationGoal,
  hasVolumeGoal,
  isCompletionRequired
} from '../workout-goals.commands.js';
import { createWorkoutGoalsFixture } from '@/fixtures.js';

describe('WorkoutGoals', () => {
  describe('creation', () => {
    it('should create valid workout goals with distance goal', () => {
      // Arrange & Act
      const value = faker.number.int({ min: 1000, max: 10000 });
      const goals = createWorkoutGoalsFixture({
        distance: { value, unit: 'meters' },
        duration: undefined, // Ensure only one goal
      });

      // Assert
      expect(goals.distance?.value).toBe(value);
      expect(goals.distance?.unit).toBe('meters');
      expect(hasDistanceGoal(goals)).toBe(true);
    });

    it('should create valid workout goals with duration goal', () => {
      // Arrange & Act
      const value = faker.number.int({ min: 300, max: 7200 });
      const goals = createWorkoutGoalsFixture({
        duration: { value, intensity: 'moderate' },
      });

      // Assert
      expect(goals.duration?.value).toBe(value);
      expect(goals.duration?.intensity).toBe('moderate');
      expect(hasDurationGoal(goals)).toBe(true);
    });

    it('should create valid workout goals with volume goal', () => {
      // Arrange & Act
      const totalSets = faker.number.int({ min: 1, max: 10 });
      const totalReps = faker.number.int({ min: 1, max: 20 });
      const goals = createWorkoutGoalsFixture({
        volume: { totalSets, totalReps, targetWeight: 'moderate' },
        duration: undefined, // Ensure only one goal
      });

      // Assert
      expect(goals.volume?.totalSets).toBe(totalSets);
      expect(goals.volume?.totalReps).toBe(totalReps);
      expect(hasVolumeGoal(goals)).toBe(true);
    });
  });

  describe('validation', () => {
    it('should fail when no goal type is specified', () => {
      // Arrange
      const invalidInput = {
        completionCriteria: { mustComplete: true, autoVerifiable: false },
      };

      // Act
      const result = CreateWorkoutGoalsSchema.safeParse(invalidInput);

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail when multiple goal types are specified', () => {
      // Arrange
      const invalidInput = {
        distance: { value: 5000, unit: 'meters' },
        duration: { value: 3600, intensity: 'moderate' },
        completionCriteria: { mustComplete: true, autoVerifiable: false },
      };

      // Act
      const result = CreateWorkoutGoalsSchema.safeParse(invalidInput);

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail when minimumEffort is out of range', () => {
      // Arrange
      const invalidInput = {
        duration: { value: 3600, intensity: 'moderate' },
        completionCriteria: {
          mustComplete: true,
          autoVerifiable: false,
          minimumEffort: 101 // Invalid
        },
      };

      // Act
      const result = CreateWorkoutGoalsSchema.safeParse(invalidInput);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe('specialized factories', () => {
    it('should create distance workout', () => {
      // Arrange
      const criteria = { mustComplete: true, autoVerifiable: true };
      const distance = faker.number.int({ min: 1000, max: 10000 });

      // Act
      const result = createDistanceWorkout(distance, 'meters', criteria);

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.distance?.value).toBe(distance);
        expect(result.value.distance?.unit).toBe('meters');
        expect(isCompletionRequired(result.value)).toBe(true);
      }
    });

    it('should create duration workout', () => {
      // Arrange
      const criteria = { mustComplete: false, autoVerifiable: false };
      const duration = faker.number.int({ min: 10, max: 120 });

      // Act
      const result = createDurationWorkout(duration, criteria, 'moderate');

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.duration?.value).toBe(duration);
        expect(result.value.duration?.intensity).toBe('moderate');
        expect(isCompletionRequired(result.value)).toBe(false);
      }
    });

    it('should create volume workout', () => {
      // Arrange
      const criteria = { mustComplete: true, autoVerifiable: true };
      const sets = faker.number.int({ min: 1, max: 10 });
      const reps = faker.number.int({ min: 1, max: 20 });

      // Act
      const result = createVolumeWorkout(sets, reps, criteria);

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.volume?.totalSets).toBe(sets);
        expect(result.value.volume?.totalReps).toBe(reps);
        expect(isCompletionRequired(result.value)).toBe(true);
      }
    });
  });
});