import { describe, it, expect } from 'vitest';
import {
  CreateTrainingConstraintsSchema,
  createHomeTrainingConstraints,
  createGymTrainingConstraints,
} from '../training-constraints.factory.js';
import {
  hasInjuries,
  canExercise,
  hasEquipment,
  isAvailableDay,
  getAvailableDaysCount,
} from '../training-constraints.commands.js';
import { createTrainingConstraintsFixture, createInjuryFixture } from './training-constraints.fixtures.js';

describe('TrainingConstraints', () => {
  describe('creation & rehydration', () => {
    it('should create valid training constraints with correct defaults', () => {
      // Arrange & Act
      const constraints = createTrainingConstraintsFixture({
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        location: 'gym',
      });

      // Assert
      expect(constraints).toMatchObject({
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        location: 'gym',
      });
    });
  });

  describe('validation', () => {
    it('should fail when availableDays is empty', () => {
      // Arrange
      const invalidInput = {
        availableDays: [],
        availableEquipment: [],
        location: 'home',
      };

      // Act
      const result = CreateTrainingConstraintsSchema.safeParse(invalidInput);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/must have at least one available day/i);
      }
    });

    it('should fail with invalid day names', () => {
      // Arrange
      const invalidInput = {
        availableDays: ['Monday', 'NotADay'],
        availableEquipment: [],
        location: 'home',
      };

      // Act
      const result = CreateTrainingConstraintsSchema.safeParse(invalidInput);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/invalid day: NotADay/i);
      }
    });

    it('should fail with duplicate days', () => {
      // Arrange
      const invalidInput = {
        availableDays: ['Monday', 'Monday'],
        availableEquipment: [],
        location: 'home',
      };

      // Act
      const result = CreateTrainingConstraintsSchema.safeParse(invalidInput);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/duplicate days/i);
      }
    });

    it('should fail when maxDuration is <= 0', () => {
      // Arrange
      const invalidInput = {
        availableDays: ['Monday'],
        maxDuration: 0,
        availableEquipment: [],
        location: 'gym',
      };

      // Act
      const result = CreateTrainingConstraintsSchema.safeParse(invalidInput);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/too_small[\s\S]*minimum[\s\S]*1/i);
      }
    });

    it('should fail when injury bodyPart is empty', () => {
      // Arrange
      const invalidInput = {
        availableDays: ['Monday'],
        availableEquipment: [],
        location: 'home',
        injuries: [
          {
            bodyPart: '',
            severity: 'minor',
            avoidExercises: [],
            reportedDate: new Date(),
          },
        ],
      };

      // Act
      const result = CreateTrainingConstraintsSchema.safeParse(invalidInput);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/too_small[\s\S]*minimum[\s\S]*1/i);
      }
    });
  });

  describe('specialized factories', () => {
    it('should create home training constraints', () => {
      // Act
      const result = createHomeTrainingConstraints(['Monday', 'Thursday'], ['Mat', 'Bands']);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.value).toMatchObject({
        location: 'home',
        availableEquipment: ['Mat', 'Bands'],
        availableDays: ['Monday', 'Thursday'],
      });
    });

    it('should create gym training constraints', () => {
      // Act
      const result = createGymTrainingConstraints(['Monday', 'Wednesday', 'Friday'], 60);

      // Assert
      expect(result.isSuccess).toBe(true);
      expect(result.value).toMatchObject({
        location: 'gym',
        maxDuration: 60,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
      });
    });
  });

  describe('commands & queries', () => {
    it('should correctly report injury status', () => {
      // Arrange
      const injury = createInjuryFixture({ bodyPart: 'Knee', avoidExercises: ['Squats'] });
      const constraints = createTrainingConstraintsFixture({ injuries: [injury] });

      // Act & Assert
      expect(hasInjuries(constraints)).toBe(true);
      expect(canExercise(constraints, 'Squats')).toBe(false);
      expect(canExercise(constraints, 'Pushups')).toBe(true);
    });

    it('should correctly check for equipment', () => {
      // Arrange
      const constraints = createTrainingConstraintsFixture({
        availableEquipment: ['Dumbbells', 'Bench'],
      });

      // Act & Assert
      expect(hasEquipment(constraints, 'Dumbbells')).toBe(true);
      expect(hasEquipment(constraints, 'Barbell')).toBe(false);
    });

    it('should correctly check available days', () => {
      // Arrange
      const constraints = createTrainingConstraintsFixture({
        availableDays: ['Monday', 'Friday'],
      });

      // Act & Assert
      expect(isAvailableDay(constraints, 'Monday')).toBe(true);
      expect(isAvailableDay(constraints, 'Tuesday')).toBe(false);
      expect(getAvailableDaysCount(constraints)).toBe(2);
    });
  });
});