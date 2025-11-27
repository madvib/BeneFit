import { describe, it, expect } from 'vitest';
import {
  createWorkoutGoals,
  createDistanceWorkout,
  createDurationWorkout,
  createVolumeWorkout,
} from './index.js';
import {
  hasDistanceGoal,
  hasDurationGoal,
  hasVolumeGoal,
  isCompletionRequired
} from './workout-goals.commands.js';

describe('WorkoutGoals', () => {
  describe('create', () => {
    it('should create workout goals with distance goal', () => {
      const result = createWorkoutGoals({
        distance: { value: 5000, unit: 'meters' },
        completionCriteria: { mustComplete: true, autoVerifiable: false },
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.distance?.value).toBe(5000);
        expect(result.value.distance?.unit).toBe('meters');
        expect(hasDistanceGoal(result.value)).toBe(true);
      }
    });

    it('should create workout goals with duration goal', () => {
      const result = createWorkoutGoals({
        duration: { value: 3600, intensity: 'moderate' },
        completionCriteria: { mustComplete: true, autoVerifiable: true },
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.duration?.value).toBe(3600);
        expect(result.value.duration?.intensity).toBe('moderate');
        expect(hasDurationGoal(result.value)).toBe(true);
      }
    });

    it('should create workout goals with volume goal', () => {
      const result = createWorkoutGoals({
        volume: { totalSets: 4, totalReps: 12, targetWeight: 'moderate' },
        completionCriteria: { mustComplete: false, autoVerifiable: true },
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.volume?.totalSets).toBe(4);
        expect(result.value.volume?.totalReps).toBe(12);
        expect(hasVolumeGoal(result.value)).toBe(true);
      }
    });

    it('should fail when no goal type is specified', () => {
      const result = createWorkoutGoals({
        completionCriteria: { mustComplete: true, autoVerifiable: false },
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail when multiple goal types are specified', () => {
      const result = createWorkoutGoals({
        distance: { value: 5000, unit: 'meters' },
        duration: { value: 3600, intensity: 'moderate' },
        completionCriteria: { mustComplete: true, autoVerifiable: false },
      });

      expect(result.isFailure).toBe(true);
    });
  });

  describe('factory methods', () => {
    it('should create distance workout', () => {
      const criteria = { mustComplete: true, autoVerifiable: true };
      const result = createDistanceWorkout(5000, 'meters', criteria);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.distance?.value).toBe(5000);
        expect(result.value.distance?.unit).toBe('meters');
        expect(isCompletionRequired(result.value)).toBe(true);
      }
    });

    it('should create duration workout', () => {
      const criteria = { mustComplete: false, autoVerifiable: false };
      const result = createDurationWorkout(30, criteria, 'moderate');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.duration?.value).toBe(30);
        expect(result.value.duration?.intensity).toBe('moderate');
        expect(isCompletionRequired(result.value)).toBe(false);
      }
    });

    it('should create volume workout', () => {
      const criteria = { mustComplete: true, autoVerifiable: true };
      const result = createVolumeWorkout(4, 12, criteria);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.volume?.totalSets).toBe(4);
        expect(result.value.volume?.totalReps).toBe(12);
        expect(isCompletionRequired(result.value)).toBe(true);
      }
    });
  });
});