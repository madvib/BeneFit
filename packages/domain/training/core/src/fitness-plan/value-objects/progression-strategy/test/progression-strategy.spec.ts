
import { describe, it, expect } from 'vitest';
import { faker } from '@faker-js/faker';
import {
  CreateProgressionStrategySchema,
  createLinearProgression,
  createUndulatingProgression,
  createAdaptiveProgression,
  createConservativeProgression,
  createAggressiveProgression,
} from '../progression-strategy.factory.js';
import {
  isConservative,
  calculateNextWeekLoad,
} from '../progression-strategy.commands.js';
import { createProgressionStrategyFixture } from '@/fixtures.js';

describe('ProgressionStrategy', () => {
  describe('creation', () => {
    it('should create valid progression strategy with correct defaults', () => {
      // Arrange & Act
      const weeklyIncrease = faker.number.float({ min: 0, max: 0.2, fractionDigits: 2 });
      const strategy = createProgressionStrategyFixture({
        type: 'linear',
        weeklyIncrease,
      });

      // Assert
      expect(strategy.type).toBe('linear');
      expect(strategy.weeklyIncrease).toBe(weeklyIncrease);
    });
  });

  describe('validation', () => {
    it('should fail when weeklyIncrease is < 0', () => {
      // Arrange
      const input = { type: 'linear', weeklyIncrease: -0.1 };

      // Act
      const result = CreateProgressionStrategySchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail when weeklyIncrease is > 1', () => {
      // Arrange
      const input = { type: 'linear', weeklyIncrease: 1.1 };

      // Act
      const result = CreateProgressionStrategySchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail when deloadWeeks contains a week > 52', () => {
      // Arrange
      const input = {
        type: 'linear',
        weeklyIncrease: 0.05,
        deloadWeeks: [53]
      };

      // Act
      const result = CreateProgressionStrategySchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe('specialized factories', () => {
    it('should create linear progression strategy with capped deload weeks', () => {
      // Arrange & Act
      // Use frequency of 10: 10, 20, 30, 40, 50, (60)
      const weeklyIncrease = faker.number.float({ min: 0.01, max: 0.1, fractionDigits: 3 });
      const result = createLinearProgression(weeklyIncrease, 10);

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value).toMatchObject({
          type: 'linear',
          weeklyIncrease,
          deloadWeeks: [10, 20, 30, 40, 50],
        });
      }
    });

    it('should create undulating progression strategy', () => {
      // Arrange & Act
      const weeklyIncrease = faker.number.float({ min: 0.01, max: 0.05, fractionDigits: 3 });
      const result = createUndulatingProgression(weeklyIncrease);

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value).toMatchObject({
          type: 'undulating',
          weeklyIncrease,
          testWeeks: [2, 4, 6, 8, 10, 12],
        });
      }
    });

    it('should create adaptive progression strategy', () => {
      // Arrange & Act
      const weeklyIncrease = faker.number.float({ min: 0.01, max: 0.05, fractionDigits: 3 });
      const result = createAdaptiveProgression(weeklyIncrease);

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value).toMatchObject({
          type: 'adaptive',
          weeklyIncrease,
          testWeeks: [3, 6, 9, 12, 15, 18],
        });
      }
    });

    it('should create conservative progression strategy', () => {
      // Arrange & Act
      const result = createConservativeProgression();

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(isConservative(result.value)).toBe(true);
        expect(result.value.weeklyIncrease).toBe(0.025);
      }
    });

    it('should create aggressive progression strategy', () => {
      // Arrange & Act
      const result = createAggressiveProgression();

      // Assert
      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.weeklyIncrease).toBe(0.075);
      }
    });
  });

  describe('logic & commands', () => {
    it('should calculate next week load correctly for linear progression', () => {
      // Arrange
      const weeklyIncrease = 0.05;
      const strategy = createProgressionStrategyFixture({
        type: 'linear',
        weeklyIncrease,
      });

      // Act
      const baseLoad = faker.number.int({ min: 50, max: 200 });
      const nextLoad = calculateNextWeekLoad(strategy, baseLoad, 1);

      // Assert
      expect(nextLoad).toBe(baseLoad + (baseLoad * weeklyIncrease));
    });

    it('should identify conservative strategy correctly', () => {
      // Arrange
      const strategy = createProgressionStrategyFixture({
        type: 'linear',
        weeklyIncrease: 0.02,
      });

      // Act & Assert
      expect(isConservative(strategy)).toBe(true);
    });
  });
});
