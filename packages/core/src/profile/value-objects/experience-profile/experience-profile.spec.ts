import { describe, it, expect } from 'vitest';
import { createExperienceProfile, ExperienceLevel, ExperienceProfile } from './experience-profile.js';

describe('ExperienceProfile Value Object', () => {
  describe('Factory', () => {
    it('should create a valid experience profile', () => {
      const result = createExperienceProfile({
        level: 'intermediate',
        capabilities: {
          canDoFullPushup: true,
          canDoFullPullup: false,
          canRunMile: true,
          canSquatBelowParallel: true,
        },
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const profile = result.value;
        expect(profile.level).toBe('intermediate');
        expect(profile.capabilities.canDoFullPushup).toBe(true);
        expect(profile.capabilities.canDoFullPullup).toBe(false);
        expect(profile.capabilities.canRunMile).toBe(true);
        expect(profile.capabilities.canSquatBelowParallel).toBe(true);
        expect(profile.history.previousPrograms).toEqual([]);
        expect(profile.history.sports).toEqual([]);
        expect(profile.history.certifications).toEqual([]);
        expect(profile.lastAssessmentDate).toBeInstanceOf(Date);
      }
    });

    it('should create with history', () => {
      const result = createExperienceProfile({
        level: 'advanced',
        history: {
          yearsTraining: 5,
          previousPrograms: ['Starting Strength', 'StrongLifts 5x5'],
          sports: ['Basketball', 'Swimming'],
          certifications: ['CPT'],
        },
        capabilities: {
          canDoFullPushup: true,
          canDoFullPullup: true,
          canRunMile: true,
          canSquatBelowParallel: true,
        },
      });

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const profile = result.value;
        expect(profile.level).toBe('advanced');
        expect(profile.history.yearsTraining).toBe(5);
        expect(profile.history.previousPrograms).toEqual(['Starting Strength', 'StrongLifts 5x5']);
        expect(profile.history.sports).toEqual(['Basketball', 'Swimming']);
        expect(profile.history.certifications).toEqual(['CPT']);
      }
    });

    it('should fail with years training less than 0', () => {
      const result = createExperienceProfile({
        level: 'beginner',
        history: {
          yearsTraining: -1,
        },
        capabilities: {
          canDoFullPushup: false,
          canDoFullPullup: false,
          canRunMile: false,
          canSquatBelowParallel: false,
        },
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail with missing level', () => {
      const result = createExperienceProfile({
        level: undefined as any,
        capabilities: {
          canDoFullPushup: false,
          canDoFullPullup: false,
          canRunMile: false,
          canSquatBelowParallel: false,
        },
      } as any);

      expect(result.isFailure).toBe(true);
    });

    it('should fail with missing capabilities', () => {
      const result = createExperienceProfile({
        level: 'beginner',
        capabilities: undefined as any,
      } as any);

      expect(result.isFailure).toBe(true);
    });
  });

  describe('Update methods', () => {
    let validProfile: ExperienceProfile;

    beforeEach(() => {
      const result = createExperienceProfile({
        level: 'intermediate',
        capabilities: {
          canDoFullPushup: true,
          canDoFullPullup: false,
          canRunMile: true,
          canSquatBelowParallel: true,
        },
      });
      
      if (result.isSuccess) {
        validProfile = result.value;
      } else {
        throw new Error('Could not create valid profile for tests');
      }
    });

    it('should update assessment date when changed', () => {
      const updatedProfile = {
        ...validProfile,
        level: 'advanced',
        lastAssessmentDate: new Date(),
      };

      expect(updatedProfile.level).toBe('advanced');
      expect(updatedProfile.lastAssessmentDate).toBeInstanceOf(Date);
    });
  });
});