import { describe, it, expect } from 'vitest';
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
import { createWorkoutGoalsFixture } from './workout-goals.fixtures.js';

describe('WorkoutGoals', () => {
  describe('creation', () => {
    it('should create valid workout goals with distance goal', () => {
      // Arrange & Act
      const goals = createWorkoutGoalsFixture({
        distance: { value: 5000, unit: 'meters' },
        duration: undefined, // Ensure only one goal
      });

      // Assert
      expect(goals.distance?.value).toBe(5000);
      expect(goals.distance?.unit).toBe('meters');
      expect(hasDistanceGoal(goals)).toBe(true);
    });

    it('should create valid workout goals with duration goal', () => {
      // Arrange & Act
      const goals = createWorkoutGoalsFixture({
        duration: { value: 3600, intensity: 'moderate' },
      });

      // Assert
      expect(goals.duration?.value).toBe(3600);
      expect(goals.duration?.intensity).toBe('moderate');
      expect(hasDurationGoal(goals)).toBe(true);
    });

    it('should create valid workout goals with volume goal', () => {
      // Arrange & Act
      const goals = createWorkoutGoalsFixture({
        volume: { totalSets: 4, totalReps: 12, targetWeight: 'moderate' },
        duration: undefined, // Ensure only one goal
      });

      // Assert
      expect(goals.volume?.totalSets).toBe(4);
      expect(goals.volume?.totalReps).toBe(12);
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

      // Act
      const result = createDistanceWorkout(5000, 'meters', criteria);

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.distance?.value).toBe(5000);
        expect(result.value.distance?.unit).toBe('meters');
        expect(isCompletionRequired(result.value)).toBe(true);
      }
    });

    it('should create duration workout', () => {
      // Arrange
      const criteria = { mustComplete: false, autoVerifiable: false };

      // Act
      const result = createDurationWorkout(30, criteria, 'moderate');

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.duration?.value).toBe(30);
        expect(result.value.duration?.intensity).toBe('moderate');
        expect(isCompletionRequired(result.value)).toBe(false);
      }
    });

    it('should create volume workout', () => {
      // Arrange
      const criteria = { mustComplete: true, autoVerifiable: true };

      // Act
      const result = createVolumeWorkout(4, 12, criteria);

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.volume?.totalSets).toBe(4);
        expect(result.value.volume?.totalReps).toBe(12);
        expect(isCompletionRequired(result.value)).toBe(true);
      }
    });
  });
});