import { describe, it, expect, beforeEach } from 'vitest';
import { z } from 'zod';
import { CreateFitnessGoalsSchema } from '../fitness-goals.factory.js';
import { createFitnessGoalsFixture } from './fitness-goals.fixtures.js';
import { FitnessGoals } from '../fitness-goals.types.js';

type CreateGoalsInput = z.input<typeof CreateFitnessGoalsSchema>;

describe('FitnessGoals Value Object', () => {
  describe('Factory', () => {
    const validInput: CreateGoalsInput = {
      primary: 'strength',
      motivation: 'Get stronger to lift heavy weights',
    };

    it('should create valid fitness goals', () => {
      // Act
      const result = CreateFitnessGoalsSchema.safeParse(validInput);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const goals = result.data;
        expect(goals.primary).toBe('strength');
        expect(goals.motivation).toBe('Get stronger to lift heavy weights');
        expect(goals.secondary).toEqual([]);
        expect(goals.successCriteria).toEqual([]);
      }
    });

    it('should create with all properties', () => {
      // Arrange
      const targetDate = new Date('2026-12-31');
      const input: CreateGoalsInput = {
        primary: 'weight_loss',
        motivation: 'Lose weight for health',
        secondary: ['improve endurance', 'gain strength'],
        targetWeight: {
          current: 80,
          target: 70,
          unit: 'kg',
        },
        targetBodyFat: 15,
        targetDate,
        successCriteria: ['feel stronger', 'look better'],
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
      }
    });

    it('should fail with empty motivation', () => {
      // Arrange
      const input: CreateGoalsInput = {
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
      const input: CreateGoalsInput = {
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
      const input: CreateGoalsInput = {
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
      const input: CreateGoalsInput = {
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
      const input: CreateGoalsInput = {
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
      const input: CreateGoalsInput = {
        ...validInput,
        targetDate: new Date('2020-01-01'),
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
      const customGoals = createFitnessGoalsFixture({ motivation: 'Be awesome' });
      expect(customGoals.motivation).toBe('Be awesome');
    });
  });
});
