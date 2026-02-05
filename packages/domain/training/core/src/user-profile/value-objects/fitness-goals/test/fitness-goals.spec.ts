import z from 'zod';
import { describe, it, expect, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { CreateFitnessGoalsSchema } from '../fitness-goals.factory.js';
import { createFitnessGoalsFixture } from '@/fixtures.js';
import { FitnessGoals } from '../fitness-goals.types.js';
type CreateFitnessGoalsInput = z.input<typeof CreateFitnessGoalsSchema>;
describe('FitnessGoals Value Object', () => {
  describe('Factory', () => {
    const validInput: CreateFitnessGoalsInput = {
      primary: 'strength',
      motivation: 'Test motivation',
    };

    it('should create valid fitness goals', () => {
      // Act
      const result = CreateFitnessGoalsSchema.safeParse(validInput);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const goals = result.data;
        expect(goals.primary).toBe('strength');
        expect(goals.motivation).toBe(validInput.motivation);
        expect(goals.secondary).toEqual([]);
        expect(goals.successCriteria).toEqual([]);
      }
    });

    it('should create with all properties', () => {
      // Arrange
      const targetDate = faker.date.future();
      const motivation = 'Test motivation for all properties';
      const secondary = ['strength', 'endurance'];
      const successCriteria = ['criteria1', 'criteria2'];
      const input: CreateFitnessGoalsInput = {
        primary: 'weight_loss',
        motivation,
        secondary,
        targetWeight: {
          current: 80,
          target: 70,
          unit: 'kg',
        },
        targetBodyFat: 15,
        targetDate,
        successCriteria,
      };

      // Act
      const result = CreateFitnessGoalsSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const goals = result.data;
        expect(goals.primary).toBe('weight_loss');
        expect(goals.targetWeight).toEqual({
          current: 80,
          target: 70,
          unit: 'kg',
        });
        expect(goals.targetDate).toEqual(targetDate);
        expect(goals.motivation).toBe(motivation);
        expect(goals.secondary).toEqual(secondary);
        expect(goals.successCriteria).toEqual(successCriteria);
      }
    });

    it('should fail with empty motivation', () => {
      // Arrange
      const input: CreateFitnessGoalsInput = {
        ...validInput,
        motivation: '',
      };

      // Act
      const result = CreateFitnessGoalsSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/too_small/);
      }
    });

    it('should fail with too long motivation', () => {
      // Arrange
      const input: CreateFitnessGoalsInput = {
        ...validInput,
        motivation: 'A'.repeat(1001),
      };

      // Act
      const result = CreateFitnessGoalsSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/too_big/);
      }
    });

    it('should fail with negative target weight', () => {
      // Arrange
      const input: CreateFitnessGoalsInput = {
        ...validInput,
        targetWeight: {
          current: -100,
          target: 70,
          unit: 'kg',
        },
      };

      // Act
      const result = CreateFitnessGoalsSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail with zero target weight', () => {
      // Arrange
      const input: CreateFitnessGoalsInput = {
        ...validInput,
        targetWeight: {
          current: 0,
          target: 70,
          unit: 'kg',
        },
      };

      // Act
      const result = CreateFitnessGoalsSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail with invalid body fat percentage', () => {
      // Arrange
      const input: CreateFitnessGoalsInput = {
        ...validInput,
        targetBodyFat: 61,
      };

      // Act
      const result = CreateFitnessGoalsSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail with past target date', () => {
      // Arrange
      const input: CreateFitnessGoalsInput = {
        ...validInput,
        targetDate: faker.date.past(),
      };

      // Act
      const result = CreateFitnessGoalsSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/targetDate must be in the future/);
      }
    });
  });

  describe('Fixtures', () => {
    let validGoals: FitnessGoals;

    beforeEach(() => {
      validGoals = createFitnessGoalsFixture({
        primary: 'hypertrophy',
        targetBodyFat: 12,
      });
    });

    it('should create valid fixture', () => {
      expect(validGoals.primary).toBe('hypertrophy');
      expect(validGoals.targetBodyFat).toBe(12);
      expect(validGoals.successCriteria.length).toBeGreaterThan(0);
    });

    it('should allow fixture overrides', () => {
      const motivation = 'Test fixture override motivation';
      const customGoals = createFitnessGoalsFixture({ motivation });
      expect(customGoals.motivation).toBe(motivation);
    });
  });
});
