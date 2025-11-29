import { describe, it, expect } from 'vitest';
import { createActivityStructure, createEmptyActivityStructure, createIntervalStructure, createExerciseStructure } from './activity-structure.factory.js';
import { isIntervalBased, isExerciseBased, isEmpty, getTotalDuration, getTotalSets, getAverageIntensity, requiresEquipment, getDescription } from './activity-structure.queries.js';
import { adjustDuration, adjustIntensity, addRounds, reduceRounds, increaseRest } from './activity-structure.commands.js';

describe('ActivityStructure', () => {
  describe('factory methods', () => {
    it('should create empty structure', () => {
      const structure = createEmptyActivityStructure();

      expect(isEmpty(structure)).toBe(true);
      expect(structure.intervals).toBeUndefined();
      expect(structure.exercises).toBeUndefined();
    });

    it('should create interval-based structure', () => {
      const intervals = [
        { duration: 300, intensity: 'moderate' as const, rest: 60 },
        { duration: 180, intensity: 'hard' as const, rest: 90 },
      ];
      const result = createIntervalStructure(intervals, 3);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(isIntervalBased(result.value)).toBe(true);
        expect(result.value.intervals?.length).toBe(2);
        expect(result.value.rounds).toBe(3);
      }
    });

    it('should create exercise-based structure', () => {
      const exercises = [
        { name: 'Squats', sets: 3, reps: 10, rest: 90 },
        { name: 'Push-ups', sets: 3, reps: 15, rest: 60 },
      ];
      const result = createExerciseStructure(exercises);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(isExerciseBased(result.value)).toBe(true);
        expect(result.value.exercises?.length).toBe(2);
      }
    });
  });

  describe('validation', () => {
    it('should fail when both intervals and exercises are provided', () => {
      const result = createActivityStructure({
        intervals: [{ duration: 300, intensity: 'moderate', rest: 60 }],
        exercises: [{ name: 'Squats', sets: 3, reps: 10, rest: 90 }],
      });

      expect(result.isFailure).toBe(true);
    });

    it('should validate interval durations are positive', () => {
      const result = createActivityStructure({
        intervals: [{ duration: -300, intensity: 'moderate', rest: 60 }],
      });

      expect(result.isFailure).toBe(true);
    });

    it('should validate exercise sets are positive', () => {
      const result = createActivityStructure({
        exercises: [{ name: 'Squats', sets: 0, reps: 10, rest: 90 }],
      });

      expect(result.isFailure).toBe(true);
    });

    it('should validate rounds are positive when provided', () => {
      const result = createActivityStructure({
        intervals: [{ duration: 300, intensity: 'moderate', rest: 60 }],
        rounds: -1,
      });

      expect(result.isFailure).toBe(true);
    });
  });

  describe('getTotalDuration', () => {
    it('should calculate duration for interval-based structure', () => {
      const result = createIntervalStructure(
        [
          { duration: 300, intensity: 'moderate', rest: 60 },
          { duration: 180, intensity: 'hard', rest: 90 },
        ],
        2
      );

      if (result.isSuccess) {
        // (300 + 60 + 180 + 90) * 2 rounds = 1260
        expect(getTotalDuration(result.value)).toBe(1260);
      }
    });

    it('should calculate duration for exercise-based structure with duration', () => {
      const result = createExerciseStructure([
        { name: 'Plank', sets: 3, duration: 60, rest: 30 },
      ]);

      if (result.isSuccess) {
        // (60 * 3) + (30 * 2) = 180 + 60 = 240
        expect(getTotalDuration(result.value)).toBe(240);
      }
    });

    it('should return 0 for empty structure', () => {
      const structure = createEmptyActivityStructure();

      expect(getTotalDuration(structure)).toBe(0);
    });
  });

  describe('getTotalSets', () => {
    it('should calculate total sets for exercise-based structure', () => {
      const result = createExerciseStructure([
        { name: 'Squats', sets: 3, reps: 10, rest: 90 },
        { name: 'Push-ups', sets: 4, reps: 15, rest: 60 },
      ]);

      if (result.isSuccess) {
        expect(getTotalSets(result.value)).toBe(7); // 3 + 4
      }
    });

    it('should return 0 for interval structure', () => {
      const result = createIntervalStructure(
        [
          { duration: 300, intensity: 'moderate', rest: 60 },
          { duration: 180, intensity: 'hard', rest: 90 },
        ],
        3
      );

      if (result.isSuccess) {
        expect(getTotalSets(result.value)).toBe(0);
      }
    });

    it('should return 0 for empty structure', () => {
      const structure = createEmptyActivityStructure();

      expect(getTotalSets(structure)).toBe(0);
    });
  });

  describe('adjustDuration', () => {
    it('should adjust interval durations', () => {
      const result = createIntervalStructure([
        { duration: 300, intensity: 'moderate', rest: 60 },
      ]);

      if (result.isSuccess) {
        const adjusted = adjustDuration(result.value, 0.8);
        expect(adjusted.intervals![0]!.duration).toBe(240); // 300 * 0.8
      }
    });

    it('should adjust exercise durations', () => {
      const result = createExerciseStructure([
        { name: 'Plank', sets: 3, duration: 60, rest: 30 },
      ]);

      if (result.isSuccess) {
        const adjusted = adjustDuration(result.value, 1.5);
        expect(adjusted.exercises![0]!.duration).toBe(90); // 60 * 1.5
      }
    });

    it('should return same structure if empty', () => {
      const empty = createEmptyActivityStructure();
      const adjusted = adjustDuration(empty, 0.5);

      expect(isEmpty(adjusted)).toBe(true);
    });
  });

  describe('adjustIntensity', () => {
    it('should adjust interval intensity levels', () => {
      const result = createIntervalStructure([
        { duration: 300, intensity: 'moderate', rest: 60 },
        { duration: 180, intensity: 'hard', rest: 90 },
      ]);

      if (result.isSuccess) {
        const easier = adjustIntensity(result.value, 0.8);

        // Should reduce intensity
        expect(easier.intervals).toBeDefined();
      }
    });

    it('should adjust exercise weights', () => {
      const result = createExerciseStructure([
        { name: 'Squats', sets: 3, reps: 10, weight: 100, rest: 90 },
      ]);

      if (result.isSuccess) {
        const lighter = adjustIntensity(result.value, 0.7);
        expect(lighter.exercises![0]!.weight).toBe(70); // 100 * 0.7
      }
    });
  });

  describe('addRounds', () => {
    it('should add rounds to existing structure', () => {
      const result = createIntervalStructure(
        [{ duration: 300, intensity: 'moderate', rest: 60 }],
        2
      );

      if (result.isSuccess) {
        const withMore = addRounds(result.value, 1);
        expect(withMore.rounds).toBe(3);
      }
    });

    it('should initialize rounds if not present', () => {
      const result = createIntervalStructure([
        { duration: 300, intensity: 'moderate', rest: 60 },
      ]);

      if (result.isSuccess) {
        const withRounds = addRounds(result.value, 2);
        expect(withRounds.rounds).toBeDefined();
      }
    });
  });

  describe('reduceRounds', () => {
    it('should reduce rounds', () => {
      const result = createIntervalStructure(
        [{ duration: 300, intensity: 'moderate', rest: 60 }],
        5
      );

      if (result.isSuccess) {
        const withFewer = reduceRounds(result.value, 3);
        expect(withFewer.rounds).toBe(3);
      }
    });

    it('should set to target rounds when lower than current', () => {
      const result = createIntervalStructure(
        [{ duration: 300, intensity: 'moderate', rest: 60 }],
        5
      );

      if (result.isSuccess) {
        const withFewer = reduceRounds(result.value, 2);
        expect(withFewer.rounds).toBe(2); // Math.min(2, 5) = 2
      }
    });
  });

  describe('increaseRest', () => {
    it('should increase rest periods for intervals', () => {
      const result = createIntervalStructure([
        { duration: 300, intensity: 'moderate', rest: 60 },
      ]);

      if (result.isSuccess) {
        const moreRest = increaseRest(result.value, 1.5);
        expect(moreRest.intervals![0]!.rest).toBe(90); // 60 * 1.5
      }
    });

    it('should increase rest periods for exercises', () => {
      const result = createExerciseStructure([
        { name: 'Squats', sets: 3, reps: 10, rest: 90 },
      ]);

      if (result.isSuccess) {
        const moreRest = increaseRest(result.value, 2);
        expect(moreRest.exercises![0]!.rest).toBe(180); // 90 * 2
      }
    });
  });

  describe('getAverageIntensity', () => {
    it('should calculate average intensity for intervals', () => {
      const result = createIntervalStructure([
        { duration: 300, intensity: 'easy', rest: 60 },
        { duration: 180, intensity: 'hard', rest: 90 },
        { duration: 240, intensity: 'moderate', rest: 60 },
      ]);

      if (result.isSuccess) {
        const avgIntensity = getAverageIntensity(result.value);
        expect(avgIntensity).toBeGreaterThan(0);
        expect(avgIntensity).toBeLessThanOrEqual(4);
      }
    });

    it('should return default moderate (2) for non-interval structure', () => {
      const structure = createEmptyActivityStructure();

      expect(getAverageIntensity(structure)).toBe(2);
    });
  });

  describe('requiresEquipment', () => {
    it('should return true when exercises have weight specified', () => {
      const result = createExerciseStructure([
        { name: 'Barbell Squats', sets: 3, reps: 10, weight: 100, rest: 90 },
      ]);

      if (result.isSuccess) {
        expect(requiresEquipment(result.value)).toBe(true);
      }
    });

    it('should return false for bodyweight exercises', () => {
      const result = createExerciseStructure([
        { name: 'Push-ups', sets: 3, reps: 15, rest: 60 },
        { name: 'Air Squats', sets: 3, reps: 20, rest: 60 },
      ]);

      if (result.isSuccess) {
        expect(requiresEquipment(result.value)).toBe(false);
      }
    });
  });

  describe('getDescription', () => {
    it('should describe interval-based structure', () => {
      const result = createIntervalStructure(
        [{ duration: 300, intensity: 'moderate', rest: 60 }],
        3
      );

      if (result.isSuccess) {
        const description = getDescription(result.value);
        expect(description).toContain('interval');
        expect(description.length).toBeGreaterThan(0);
      }
    });

    it('should describe exercise-based structure', () => {
      const result = createExerciseStructure([
        { name: 'Squats', sets: 3, reps: 10, rest: 90 },
        { name: 'Push-ups', sets: 3, reps: 15, rest: 60 },
      ]);

      if (result.isSuccess) {
        const description = getDescription(result.value);
        expect(description).toContain('exercise');
        expect(description.length).toBeGreaterThan(0);
      }
    });

    it('should return no structure description for empty structure', () => {
      const structure = createEmptyActivityStructure();
      const description = getDescription(structure);

      expect(description).toContain('No structure defined');
    });
  });

  describe('complex scenarios', () => {
    it('should handle HIIT workout structure', () => {
      const result = createIntervalStructure(
        [
          { duration: 30, intensity: 'sprint', rest: 30 },
          { duration: 30, intensity: 'sprint', rest: 30 },
          { duration: 30, intensity: 'sprint', rest: 30 },
        ],
        4
      );

      if (result.isSuccess) {
        expect(getTotalDuration(result.value)).toBe(720); // (30+30)*3*4
        expect(getAverageIntensity(result.value)).toBeGreaterThan(0.8);
      }
    });

    it('should handle strength training structure', () => {
      const result = createExerciseStructure([
        { name: 'Barbell Squat', sets: 4, reps: 5, weight: 150, rest: 180 },
        { name: 'Bench Press', sets: 4, reps: 5, weight: 100, rest: 180 },
        { name: 'Deadlift', sets: 3, reps: 5, weight: 180, rest: 240 },
      ]);

      if (result.isSuccess) {
        expect(getTotalSets(result.value)).toBe(11); // 4 + 4 + 3
        expect(requiresEquipment(result.value)).toBe(true);
      }
    });
  });
});
