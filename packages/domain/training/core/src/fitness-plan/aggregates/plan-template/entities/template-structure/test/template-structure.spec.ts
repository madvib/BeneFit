import { describe, it, expect } from 'vitest';
import { CreateTemplateStructureSchema } from '../template-structure.factory.js';
import { createTemplateStructureFixture } from './template-structure.fixtures.js';

describe('TemplateStructure', () => {
  describe('creation', () => {
    it('should create valid structure with all required properties', () => {
      // Arrange & Act
      const structure = createTemplateStructureFixture();

      // Assert - fixture already proves creation works
      expect(structure.duration).toBeDefined();
      expect(structure.frequency).toBeDefined();
      expect(structure.weeks).toBeDefined();
      expect(structure.weeks.length).toBeGreaterThan(0);
    });

    it('should allow customization through overrides', () => {
      // Arrange & Act
      const structure = createTemplateStructureFixture({
        duration: { type: 'fixed', weeks: 8 },
        progressionFormula: 'custom formula',
      });

      // Assert
      expect(structure.duration).toEqual({ type: 'fixed', weeks: 8 });
      expect(structure.progressionFormula).toBe('custom formula');
    });
  });

  describe('validation', () => {
    it('should fail when duration weeks is negative', () => {
      // Arrange
      const invalidInput = {
        duration: { type: 'fixed' as const, weeks: -5 }, // Invalid negative value
        frequency: { type: 'fixed' as const, workoutsPerWeek: 3 },
        weeks: [{
          weekNumber: 1,
          workouts: [{
            type: 'cardio' as const,
            durationMinutes: 30,
            activities: [{ activityType: 'main' as const, template: 'Run', variables: {} }]
          }]
        }],
      };

      // Act
      const parseResult = CreateTemplateStructureSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail when workouts per week is zero', () => {
      // Arrange
      const invalidInput = {
        duration: { type: 'fixed' as const, weeks: 4 },
        frequency: { type: 'fixed' as const, workoutsPerWeek: 0 }, // Invalid 0 value
        weeks: [{
          weekNumber: 1,
          workouts: [{
            type: 'cardio' as const,
            durationMinutes: 30,
            activities: [{ activityType: 'main' as const, template: 'Run', variables: {} }]
          }]
        }],
      };

      // Act
      const parseResult = CreateTemplateStructureSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail when week number is negative', () => {
      // Arrange
      const invalidInput = {
        duration: { type: 'fixed' as const, weeks: 4 },
        frequency: { type: 'fixed' as const, workoutsPerWeek: 3 },
        weeks: [{
          weekNumber: -1, // Invalid negative value
          workouts: []
        }],
      };

      // Act
      const parseResult = CreateTemplateStructureSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail when weeks array is empty', () => {
      // Arrange
      const invalidInput = {
        duration: { type: 'fixed' as const, weeks: 4 },
        frequency: { type: 'fixed' as const, workoutsPerWeek: 3 },
        weeks: [], // Invalid empty array
      };

      // Act
      const parseResult = CreateTemplateStructureSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail when workouts array is empty', () => {
      // Arrange
      const invalidInput = {
        duration: { type: 'fixed' as const, weeks: 4 },
        frequency: { type: 'fixed' as const, workoutsPerWeek: 3 },
        weeks: [{
          weekNumber: 1,
          workouts: [] // Invalid empty workouts
        }],
      };

      // Act
      const parseResult = CreateTemplateStructureSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });
  });

  describe('range validation', () => {
    it('should fail when variable duration min exceeds max', () => {
      // Arrange
      const invalidInput = {
        duration: { type: 'variable' as const, min: 8, max: 4 }, // min > max
        frequency: { type: 'fixed' as const, workoutsPerWeek: 3 },
        weeks: [{
          weekNumber: 1,
          workouts: [{
            type: 'cardio' as const,
            durationMinutes: 30,
            activities: [{ activityType: 'main' as const, template: 'Run', variables: {} }]
          }]
        }],
      };

      // Act
      const parseResult = CreateTemplateStructureSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail when flexible frequency min exceeds max', () => {
      // Arrange
      const invalidInput = {
        duration: { type: 'fixed' as const, weeks: 4 },
        frequency: { type: 'flexible' as const, min: 5, max: 3 }, // min > max
        weeks: [{
          weekNumber: 1,
          workouts: [{
            type: 'cardio' as const,
            durationMinutes: 30,
            activities: [{ activityType: 'main' as const, template: 'Run', variables: {} }]
          }]
        }],
      };

      // Act
      const parseResult = CreateTemplateStructureSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });
  });
});
