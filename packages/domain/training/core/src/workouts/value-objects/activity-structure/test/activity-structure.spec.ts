import { describe, it, expect, beforeAll } from 'vitest';
import {
  CreateActivityStructureSchema,
  activityStructureFromPersistence,
} from '../activity-structure.factory.js';
import { createActivityStructureFixture } from '@/fixtures.js';
import {
  isIntervalBased,
  isExerciseBased,
  isEmpty,
  getTotalDuration,
  getTotalSets,
  getAverageIntensity,
  requiresEquipment,
  getDescription,
} from '../activity-structure.queries.js';
import {
  adjustDuration,
  adjustIntensity,
  addRounds,
  reduceRounds,
  increaseRest,
} from '../activity-structure.commands.js';
import { Interval, Exercise } from '../activity-structure.types.js';

describe('ActivityStructure', () => {
  // Shared test data for validation tests
  let validIntervals: Interval[];
  let validExercises: Exercise[];
  beforeAll(() => {
    validIntervals = [
      { duration: 300, intensity: 'moderate' as const, rest: 60 },
      { duration: 180, intensity: 'hard' as const, rest: 90 },
    ];
    validExercises = [
      { name: 'Bench Press', sets: 3, reps: 10, rest: 90 },
      { name: 'Squat', sets: 3, reps: 15, rest: 60 },
    ];
  });

  describe('creation', () => {
    it('should create empty structure', () => {
      // Arrange
      const emptyData = {};

      // Act
      const result = activityStructureFromPersistence(emptyData);

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(isEmpty(result.value)).toBe(true);
        expect(result.value.intervals).toBeUndefined();
        expect(result.value.exercises).toBeUndefined();
      }
    });

    it('should create interval-based structure with fixture', () => {
      // Arrange & Act
      const rounds = 3;
      const structure = createActivityStructureFixture({
        intervals: validIntervals,
        rounds,
        exercises: undefined,
      });

      // Assert
      expect(isIntervalBased(structure)).toBe(true);
      expect(structure.intervals?.length).toBe(2);
      expect(structure.rounds).toBe(rounds);
    });

    it('should create exercise-based structure with fixture', () => {
      // Arrange & Act
      const structure = createActivityStructureFixture({
        exercises: validExercises,
        intervals: undefined,
      });

      // Assert
      expect(isExerciseBased(structure)).toBe(true);
      expect(structure.exercises?.length).toBe(2);
    });
  });

  describe('validation', () => {
    it('should fail when both intervals and exercises are provided', () => {
      // Arrange
      const invalidInput = {
        intervals: [{ duration: 300, intensity: 'moderate' as const, rest: 60 }],
        exercises: [{ name: 'Test Exercise', sets: 3, reps: 10, rest: 90 }],
      };

      // Act
      const parseResult = CreateActivityStructureSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail when interval durations are negative', () => {
      // Arrange
      const invalidInput = {
        intervals: [{ duration: -300, intensity: 'moderate' as const, rest: 60 }],
      };

      // Act
      const parseResult = CreateActivityStructureSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail when exercise sets are not positive', () => {
      // Arrange
      const invalidInput = {
        exercises: [{ name: 'Test Exercise', sets: 0, reps: 10, rest: 90 }],
      };

      // Act
      const parseResult = CreateActivityStructureSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail when rounds are negative', () => {
      // Arrange
      const invalidInput = {
        intervals: validIntervals,
        rounds: -1,
      };

      // Act
      const parseResult = CreateActivityStructureSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });
  });

  describe('queries', () => {
    describe('getTotalDuration', () => {
      it('should calculate duration for interval-based structure', () => {
        // Arrange
        const structure = createActivityStructureFixture({
          intervals: [
            { duration: 300, intensity: 'moderate' as const, rest: 60 },
            { duration: 180, intensity: 'hard' as const, rest: 90 },
          ],
          rounds: 2,
          exercises: undefined,
        });

        // Act
        const totalDuration = getTotalDuration(structure);

        // Assert
        // (300 + 60 + 180 + 90) * 2 rounds = 1260
        expect(totalDuration).toBe(1260);
      });

      it('should calculate duration for exercise-based structure with duration', () => {
        // Arrange
        const structure = createActivityStructureFixture({
          exercises: [{ name: 'Test Exercise', sets: 3, duration: 60, rest: 30 }],
          rounds: 1,
          intervals: undefined,
        });

        // Act
        const totalDuration = getTotalDuration(structure);

        // Assert
        // (60 * 3) + (30 * 2) = 180 + 60 = 240
        expect(totalDuration).toBe(240);
      });

      it('should return 0 for empty structure', () => {
        // Arrange
        const result = activityStructureFromPersistence({});
        const structure = result.value;

        // Act
        const totalDuration = getTotalDuration(structure);

        // Assert
        expect(totalDuration).toBe(0);
      });
    });

    describe('getTotalSets', () => {
      it('should calculate total sets for exercise-based structure', () => {
        // Arrange
        const sets1 = 3;
        const sets2 = 4;
        const structure = createActivityStructureFixture({
          exercises: [
            { name: 'Bench Press', sets: sets1, reps: 10, rest: 90 },
            { name: 'Squat', sets: sets2, reps: 15, rest: 60 },
          ],
          rounds: 1,
          intervals: undefined,
        });

        // Act
        const totalSets = getTotalSets(structure);

        // Assert
        expect(totalSets).toBe(sets1 + sets2);
      });

      it('should return 0 for interval structure', () => {
        // Arrange
        const structure = createActivityStructureFixture({
          intervals: [
            { duration: 300, intensity: 'moderate' as const, rest: 60 },
            { duration: 180, intensity: 'hard' as const, rest: 90 },
          ],
          rounds: 3,
          exercises: undefined,
        });

        // Act
        const totalSets = getTotalSets(structure);

        // Assert
        expect(totalSets).toBe(0);
      });

      it('should return 0 for empty structure', () => {
        // Arrange
        const result = activityStructureFromPersistence({});
        const structure = result.value;

        // Act
        const totalSets = getTotalSets(structure);

        // Assert
        expect(totalSets).toBe(0);
      });
    });
  });

  describe('commands', () => {
    describe('adjustDuration', () => {
      it('should adjust interval durations', () => {
        // Arrange
        const duration = 300;
        const factor = 1.2;
        const structure = createActivityStructureFixture({
          intervals: [{ duration, intensity: 'moderate' as const, rest: 60 }],
          exercises: undefined,
        });

        // Act
        const adjusted = adjustDuration(structure, factor);

        // Assert
        expect(adjusted.intervals![0]!.duration).toBe(Math.round(duration * factor));
      });

      it('should adjust exercise durations', () => {
        // Arrange
        const duration = 60;
        const factor = 1.5;
        const structure = createActivityStructureFixture({
          exercises: [{ name: 'Test Exercise', sets: 3, duration, rest: 30 }],
          intervals: undefined,
        });

        // Act
        const adjusted = adjustDuration(structure, factor);

        // Assert
        expect(adjusted.exercises![0]!.duration).toBe(Math.round(duration * factor));
      });

      it('should return same structure if empty', () => {
        // Arrange
        const result = activityStructureFromPersistence({});
        const empty = result.value;

        // Act
        const adjusted = adjustDuration(empty, 0.5);

        // Assert
        expect(isEmpty(adjusted)).toBe(true);
      });
    });

    describe('adjustIntensity', () => {
      it('should adjust interval intensity levels', () => {
        // Arrange
        const structure = createActivityStructureFixture({
          intervals: [
            { duration: 300, intensity: 'moderate' as const, rest: 60 },
            { duration: 180, intensity: 'hard' as const, rest: 90 },
          ],
          exercises: undefined,
        });

        // Act
        const easier = adjustIntensity(structure, 0.8);

        // Assert
        expect(easier.intervals).toBeDefined();
      });

      it('should adjust exercise weights', () => {
        // Arrange
        const weight = 100;
        const factor = 0.7;
        const structure = createActivityStructureFixture({
          exercises: [{ name: 'Test Exercise', sets: 3, reps: 10, weight, rest: 90 }],
          intervals: undefined,
        });

        // Act
        const lighter = adjustIntensity(structure, factor);

        // Assert
        expect(lighter.exercises![0]!.weight).toBe(Math.round(weight * factor * 10) / 10);
      });
    });

    describe('addRounds', () => {
      it('should add rounds to existing structure', () => {
        // Arrange
        const rounds = 2;
        const added = 1;
        const structure = createActivityStructureFixture({
          intervals: [{ duration: 300, intensity: 'moderate' as const, rest: 60 }],
          rounds,
          exercises: undefined,
        });

        // Act
        const withMore = addRounds(structure, added);

        // Assert
        expect(withMore.rounds).toBe(rounds + added);
      });

      it('should initialize rounds if not present', () => {
        // Arrange
        const added = 2;
        const structure = createActivityStructureFixture({
          intervals: [{ duration: 300, intensity: 'moderate' as const, rest: 60 }],
          rounds: undefined,
          exercises: undefined,
        });

        // Act
        const withRounds = addRounds(structure, added);

        // Assert
        expect(withRounds.rounds).toBe(1 + added);
      });
    });

    describe('reduceRounds', () => {
      it('should reduce rounds', () => {
        // Arrange
        const structure = createActivityStructureFixture({
          intervals: [{ duration: 300, intensity: 'moderate' as const, rest: 60 }],
          rounds: 5,
          exercises: undefined,
        });

        // Act
        const withFewer = reduceRounds(structure, 3);

        // Assert
        expect(withFewer.rounds).toBe(3);
      });

      it('should set to target rounds when lower than current', () => {
        // Arrange
        const structure = createActivityStructureFixture({
          intervals: [{ duration: 300, intensity: 'moderate' as const, rest: 60 }],
          rounds: 5,
          exercises: undefined,
        });

        // Act
        const withFewer = reduceRounds(structure, 2);

        // Assert
        expect(withFewer.rounds).toBe(2); // Math.min(2, 5) = 2
      });
    });

    describe('increaseRest', () => {
      it('should increase rest periods for intervals', () => {
        // Arrange
        const rest = 60;
        const factor = 1.5;
        const structure = createActivityStructureFixture({
          intervals: [{ duration: 300, intensity: 'moderate' as const, rest }],
          exercises: undefined,
        });

        // Act
        const moreRest = increaseRest(structure, factor);

        // Assert
        expect(moreRest.intervals![0]!.rest).toBe(Math.round(rest * factor));
      });

      it('should increase rest periods for exercises', () => {
        // Arrange
        const rest = 90;
        const factor = 2;
        const structure = createActivityStructureFixture({
          exercises: [{ name: 'Test Exercise', sets: 3, reps: 10, rest }],
          intervals: undefined,
        });

        // Act
        const moreRest = increaseRest(structure, factor);

        // Assert
        expect(moreRest.exercises![0]!.rest).toBe(Math.round(rest * factor));
      });
    });

    describe('getAverageIntensity', () => {
      it('should calculate average intensity for intervals', () => {
        // Arrange
        const structure = createActivityStructureFixture({
          intervals: [
            { duration: 300, intensity: 'easy' as const, rest: 60 },
            { duration: 180, intensity: 'hard' as const, rest: 90 },
            { duration: 240, intensity: 'moderate' as const, rest: 60 },
          ],
          exercises: undefined,
        });

        // Act
        const avgIntensity = getAverageIntensity(structure);

        // Assert
        expect(avgIntensity).toBeGreaterThan(0);
        expect(avgIntensity).toBeLessThanOrEqual(4);
      });

      it('should return default moderate (2) for non-interval structure', () => {
        // Arrange
        const result = activityStructureFromPersistence({});
        const structure = result.value;

        // Act
        const avgIntensity = getAverageIntensity(structure);

        // Assert
        expect(avgIntensity).toBe(2);
      });
    });

    describe('requiresEquipment', () => {
      it('should return true when exercises have weight specified', () => {
        // Arrange
        const structure = createActivityStructureFixture({
          exercises: [{ name: 'Test Exercise', sets: 3, reps: 10, weight: 100, rest: 90 }],
          intervals: undefined,
        });

        // Act
        const needsEquipment = requiresEquipment(structure);

        // Assert
        expect(needsEquipment).toBe(true);
      });

      it('should return false for bodyweight exercises', () => {
        // Arrange
        const structure = createActivityStructureFixture({
          exercises: [
            { name: 'Push-ups', sets: 3, reps: 15, rest: 60 },
            { name: 'Squats', sets: 3, reps: 20, rest: 60 },
          ],
          intervals: undefined,
        });

        // Act
        const needsEquipment = requiresEquipment(structure);

        // Assert
        expect(needsEquipment).toBe(false);
      });
    });

    describe('getDescription', () => {
      it('should describe interval-based structure', () => {
        // Arrange
        const structure = createActivityStructureFixture({
          intervals: [{ duration: 300, intensity: 'moderate' as const, rest: 60 }],
          rounds: 3,
          exercises: undefined,
        });

        // Act
        const description = getDescription(structure);

        // Assert
        expect(description).toContain('interval');
        expect(description.length).toBeGreaterThan(0);
      });

      it('should describe exercise-based structure', () => {
        // Arrange
        const structure = createActivityStructureFixture({
          exercises: [
            { name: 'Bench Press', sets: 3, reps: 10, rest: 90 },
            { name: 'Squat', sets: 3, reps: 15, rest: 60 },
          ],
          intervals: undefined,
        });

        // Act
        const description = getDescription(structure);

        // Assert
        expect(description).toContain('exercise');
        expect(description.length).toBeGreaterThan(0);
      });

      it('should return no structure description for empty structure', () => {
        // Arrange
        const result = activityStructureFromPersistence({});
        const structure = result.value;

        // Act
        const description = getDescription(structure);

        // Assert
        expect(description).toContain('No structure defined');
      });
    });

    describe('complex scenarios', () => {
      it('should handle HIIT workout structure', () => {
        // Arrange
        const structure = createActivityStructureFixture({
          intervals: [
            { duration: 30, intensity: 'sprint' as const, rest: 30 },
            { duration: 30, intensity: 'sprint' as const, rest: 30 },
            { duration: 30, intensity: 'sprint' as const, rest: 30 },
          ],
          rounds: 4,
          exercises: undefined,
        });

        // Act
        const totalDuration = getTotalDuration(structure);
        const avgIntensity = getAverageIntensity(structure);

        // Assert
        expect(totalDuration).toBe(720); // (30+30)*3*4
        expect(avgIntensity).toBeGreaterThan(0.8);
      });

      it('should handle strength training structure', () => {
        // Arrange
        const structure = createActivityStructureFixture({
          exercises: [
            { name: 'Bench Press', sets: 4, reps: 5, weight: 150, rest: 180 },
            { name: 'Squat', sets: 4, reps: 5, weight: 100, rest: 180 },
            { name: 'Deadlift', sets: 3, reps: 5, weight: 180, rest: 240 },
          ],
          rounds: 1,
          intervals: undefined,
        });

        // Act
        const totalSets = getTotalSets(structure);
        const needsEquipment = requiresEquipment(structure);

        // Assert
        expect(totalSets).toBe(11); // 4 + 4 + 3
        expect(needsEquipment).toBe(true);
      });
    });
  });
});
