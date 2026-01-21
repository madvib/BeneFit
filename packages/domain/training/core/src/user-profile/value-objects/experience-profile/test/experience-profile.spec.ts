import { describe, it, expect, beforeEach } from 'vitest';
import { z } from 'zod';
import { CreateExperienceProfileSchema } from '../experience-profile.factory.js';
import { createExperienceProfileFixture } from './experience-profile.fixtures.js';
import { ExperienceProfile } from '../experience-profile.types.js';

type CreateProfileInput = z.input<typeof CreateExperienceProfileSchema>;

describe('ExperienceProfile Value Object', () => {
  describe('Factory', () => {
    const validInput: CreateProfileInput = {
      level: 'intermediate',
      capabilities: {
        canDoFullPushup: true,
        canDoFullPullup: false,
        canRunMile: true,
        canSquatBelowParallel: true,
      },
    };

    it('should create a valid experience profile', () => {
      // Act
      const result = CreateExperienceProfileSchema.safeParse(validInput);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const profile = result.data;
        expect(profile.level).toBe('intermediate');
        expect(profile.capabilities.canDoFullPushup).toBe(true);
        expect(profile.history.previousPrograms).toEqual([]);
        expect(profile.lastAssessmentDate).toBeInstanceOf(Date);
      }
    });

    it('should create with history', () => {
      // Arrange
      const input: CreateProfileInput = {
        ...validInput,
        level: 'advanced',
        history: {
          yearsTraining: 5,
          previousPrograms: ['Starting Strength', 'StrongLifts 5x5'],
          sports: ['Basketball', 'Swimming'],
          certifications: ['CPT'],
        },
      };

      // Act
      const result = CreateExperienceProfileSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const profile = result.data;
        expect(profile.history.yearsTraining).toBe(5);
        expect(profile.history.previousPrograms).toEqual(['Starting Strength', 'StrongLifts 5x5']);
      }
    });

    it('should fail with years training less than 0', () => {
      // Arrange
      const input: CreateProfileInput = {
        ...validInput,
        history: {
          yearsTraining: -1,
        },
      };

      // Act
      const result = CreateExperienceProfileSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/too_small/);
      }
    });

    it('should fail with missing level', () => {
      // Arrange
      // @ts-expect-error Testing runtime required field validation
      const { level, ...inputWithoutLevel } = validInput;

      // Act
      const result = CreateExperienceProfileSchema.safeParse(inputWithoutLevel);

      // Assert
      expect(result.success).toBe(false);
    });

    it('should fail with missing capabilities', () => {
      // Arrange
      // @ts-expect-error Testing runtime required field validation
      const { capabilities, ...inputWithoutCapabilities } = validInput;

      // Act
      const result = CreateExperienceProfileSchema.safeParse(inputWithoutCapabilities);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe('Fixtures', () => {
    let validProfile: ExperienceProfile;

    beforeEach(() => {
      validProfile = createExperienceProfileFixture({
        level: 'intermediate',
        capabilities: {
          canDoFullPushup: true,
          canDoFullPullup: false,
          canRunMile: true,
          canSquatBelowParallel: true,
          estimatedMaxes: { unit: 'kg' },
        },
      });
    });

    it('should create valid fixture', () => {
      expect(validProfile.level).toBe('intermediate');
      expect(validProfile.lastAssessmentDate).toBeInstanceOf(Date);
    });

    it('should allow fixture overrides', () => {
      const advanced = createExperienceProfileFixture({ level: 'advanced' });
      expect(advanced.level).toBe('advanced');
    });
  });
});