import { describe, it, expect } from 'vitest';
import { CreateTemplateRulesSchema } from '../template-rules.factory.js';
import { createTemplateRulesFixture } from './template-rules.fixtures.js';

describe('TemplateRules', () => {
  describe('creation', () => {
    it('should create valid rules with all properties defined', () => {
      // Arrange & Act
      const rules = createTemplateRulesFixture();

      // Assert - fixture already proves creation works
      expect(rules.minExperienceLevel).toBeDefined();
      expect(rules.maxExperienceLevel).toBeDefined();
      expect(rules.requiredDaysPerWeek).toBeGreaterThanOrEqual(1);
      expect(rules.requiredDaysPerWeek).toBeLessThanOrEqual(7);
    });

    it('should allow customization through overrides', () => {
      // Arrange & Act
      const rules = createTemplateRulesFixture({
        minExperienceLevel: 'advanced',
        maxExperienceLevel: 'advanced',
        requiredDaysPerWeek: 5,
      });

      // Assert
      expect(rules.minExperienceLevel).toBe('advanced');
      expect(rules.maxExperienceLevel).toBe('advanced');
      expect(rules.requiredDaysPerWeek).toBe(5);
    });
  });

  describe('validation', () => {
    it('should fail with descriptive error when minExperienceLevel is invalid', () => {
      // Arrange
      const invalidInput = {
        minExperienceLevel: 'expert',
        maxExperienceLevel: 'advanced' as const,
      };

      // Act
      const parseResult = CreateTemplateRulesSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail when experience levels are in wrong order', () => {
      // Arrange
      const invalidInput = {
        minExperienceLevel: 'advanced' as const,
        maxExperienceLevel: 'beginner' as const, // min > max violates domain rule
      };

      // Act
      const parseResult = CreateTemplateRulesSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail when requiredDaysPerWeek exceeds 7', () => {
      // Arrange
      const invalidInput = {
        minExperienceLevel: 'beginner' as const,
        maxExperienceLevel: 'advanced' as const,
        requiredDaysPerWeek: 8, // Invalid: more than 7 days in a week
      };

      // Act
      const parseResult = CreateTemplateRulesSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should fail when requiredDaysPerWeek is less than 1', () => {
      // Arrange
      const invalidInput = {
        minExperienceLevel: 'beginner' as const,
        maxExperienceLevel: 'advanced' as const,
        requiredDaysPerWeek: 0, // Invalid: must be at least 1
      };

      // Act
      const parseResult = CreateTemplateRulesSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });
  });

  describe('restrictions', () => {
    it('should accept valid session duration restrictions', () => {
      // Arrange & Act
      const rules = createTemplateRulesFixture({
        restrictions: {
          minSessionMinutes: 30,
          maxSessionMinutes: 90,
        }
      });

      // Assert
      expect(rules.restrictions?.minSessionMinutes).toBe(30);
      expect(rules.restrictions?.maxSessionMinutes).toBe(90);
    });

    it('should fail when minSessionMinutes exceeds maxSessionMinutes', () => {
      // Arrange
      const invalidInput = {
        minExperienceLevel: 'beginner' as const,
        maxExperienceLevel: 'advanced' as const,
        restrictions: {
          minSessionMinutes: 90,
          maxSessionMinutes: 30, // min > max violates domain rule
        }
      };

      // Act
      const parseResult = CreateTemplateRulesSchema.safeParse(invalidInput);

      // Assert
      expect(parseResult.success).toBe(false);
    });

    it('should accept optional equipment requirements', () => {
      // Arrange & Act
      const rules = createTemplateRulesFixture({
        requiredEquipment: ['Dumbbells', 'Barbell']
      });

      // Assert
      expect(rules.requiredEquipment).toEqual(['Dumbbells', 'Barbell']);
    });

    it('should accept optional location requirements', () => {
      // Arrange & Act
      const rules = createTemplateRulesFixture({
        restrictions: {
          minSessionMinutes: 30,
          maxSessionMinutes: 60,
          requiresLocation: ['gym', 'home']
        }
      });

      // Assert
      expect(rules.restrictions?.requiresLocation).toEqual(['gym', 'home']);
    });
  });
});
