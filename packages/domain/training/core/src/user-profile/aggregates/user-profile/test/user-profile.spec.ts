import { describe, it, expect, beforeAll } from 'vitest';

import { omit } from '@bene/shared';
import {
  createTrainingConstraintsFixture,
  createExperienceProfileFixture,
  createFitnessGoalsFixture,
  createUserStatsFixture,
} from '@/fixtures.js';
import {
  ExperienceProfile,
  FitnessGoals,
  Achievement,
} from '@/user-profile/value-objects/index.js';
import { TrainingConstraints } from '@/shared/index.js';

import {
  updateDisplayName,
  updateAvatar,
  updateBio,
  updateFitnessGoals,
  updateTrainingConstraints,
  updateExperienceProfile,
  updatePreferences,
  recordWorkoutCompleted,
  awardAchievement,
  updateLastActive,
} from '../user-profile.commands.js';
import {
  isStreakActive,
  getDaysSinceLastWorkout,
  getAverageWorkoutDuration,
  shouldReceiveCheckIn,
  getMemberSinceDays,
} from '../user-profile.queries.js';
import { CreateUserProfileSchema, type CreateUserProfileInput } from '../user-profile.factory.js';
import { createUserProfileFixture } from './user-profile.fixtures.js';

describe('UserProfile Aggregate', () => {
  let validExperienceProfile: ExperienceProfile;
  let validFitnessGoals: FitnessGoals;
  let validConstraints: TrainingConstraints;
  let validParams: CreateUserProfileInput;

  beforeAll(() => {
    validExperienceProfile = createExperienceProfileFixture({
      level: 'intermediate',
      capabilities: {
        canDoFullPushup: true,
        canDoFullPullup: false,
        canRunMile: true,
        canSquatBelowParallel: true,
        estimatedMaxes: { unit: 'kg' },
      },
    });

    validFitnessGoals = createFitnessGoalsFixture({
      primary: 'strength',
      motivation: 'Test motivation',
    });

    validConstraints = createTrainingConstraintsFixture({
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      availableEquipment: [],
      location: 'home',
    });

    const fullProfile = createUserProfileFixture({
      displayName: 'Test User Profile',
      experienceProfile: validExperienceProfile,
      fitnessGoals: validFitnessGoals,
      trainingConstraints: validConstraints,
      bio: 'Test bio',
      avatar: 'https://example.com/avatar.png',
      location: 'Test City',
    });

    validParams = fullProfile;
  });

  describe('Factory', () => {
    it('should create a valid user profile', () => {
      // Act
      const result = CreateUserProfileSchema.safeParse(validParams);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toMatchObject({
          userId: validParams.userId,
          displayName: validParams.displayName,
          experienceProfile: validExperienceProfile,
          fitnessGoals: validFitnessGoals,
        });
      }
    });

    it('should generate defaults when optional fields are omitted', () => {
      // Arrange
      // Explicitly remove optional fields to test default generation logic
      const minimalParams = omit(validParams, [
        'stats',
        'preferences',
        'createdAt',
        'updatedAt',
        'lastActiveAt',
        'experienceProfile',
        'fitnessGoals',
        'trainingConstraints',
      ]);

      // Act
      const result = CreateUserProfileSchema.safeParse(minimalParams);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.preferences).toBeDefined();
        expect(result.data.stats).toBeDefined();
        expect(result.data.stats.totalWorkouts).toBe(0); // Default value check
        expect(result.data.createdAt).toBeInstanceOf(Date);

        // Assert defaults for new optional fields
        expect(result.data.experienceProfile).toBeDefined();
        expect(result.data.experienceProfile.level).toBe('beginner');

        expect(result.data.fitnessGoals).toBeDefined();
        expect(result.data.fitnessGoals.primary).toBe('strength');

        expect(result.data.trainingConstraints).toBeDefined();
        expect(result.data.trainingConstraints.location).toBe('mixed');
      }
    });

    it('should fail with invalid userId', () => {
      // Act
      const result = CreateUserProfileSchema.safeParse({
        ...validParams,
        userId: 'not-a-uuid',
      });

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/invalid[\s\S]*uuid/i);
      }
    });

    it('should fail with empty displayName', () => {
      // Act
      const result = CreateUserProfileSchema.safeParse({
        ...validParams,
        displayName: '',
      });

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/too_small[\s\S]*minimum[\s\S]*1/i);
      }
    });

    it('should fail with display name too long', () => {
      // Act
      const result = CreateUserProfileSchema.safeParse({
        ...validParams,
        displayName: 'A'.repeat(101),
      });

      // Assert
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.message).toMatch(/too_big[\s\S]*maximum[\s\S]*100/i);
      }
    });
  });

  describe('Commands', () => {
    it('should update display name', () => {
      // Arrange
      const profile = createUserProfileFixture();
      const newName = 'Updated Test User';

      // Act
      const updatedResult = updateDisplayName(profile, newName);

      // Assert
      expect(updatedResult.isSuccess).toBe(true);
      expect(updatedResult.value.displayName).toBe(newName);
      expect(updatedResult.value.updatedAt).toBeDefined();
    });

    it('should fail to update with empty display name', () => {
      // Arrange
      const profile = createUserProfileFixture();

      // Act
      const updatedResult = updateDisplayName(profile, '');

      // Assert
      expect(updatedResult.isFailure).toBe(true);
    });

    it('should update bio', () => {
      // Arrange
      const profile = createUserProfileFixture();
      const newBio = 'Updated test bio';

      // Act
      const updatedResult = updateBio(profile, newBio);

      // Assert
      expect(updatedResult.isSuccess).toBe(true);
      expect(updatedResult.value.bio).toBe(newBio);
      expect(updatedResult.value.updatedAt).toBeDefined();
    });

    it('should update fitness goals', () => {
      // Arrange
      const profile = createUserProfileFixture();
      const newGoals = createFitnessGoalsFixture({
        primary: 'hypertrophy',
        motivation: 'Updated motivation',
      });

      // Act
      const updatedResult = updateFitnessGoals(profile, newGoals);

      // Assert
      expect(updatedResult.isSuccess).toBe(true);
      expect(updatedResult.value.fitnessGoals.primary).toBe('hypertrophy');
      expect(updatedResult.value.updatedAt).toBeDefined();
    });

    it('should record workout completed', () => {
      // Arrange
      const profile = createUserProfileFixture({
        stats: createUserStatsFixture({
          totalWorkouts: 0,
          totalMinutes: 0,
          totalVolume: 0,
          lastWorkoutDate: undefined,
        }),
      });
      const workoutDate = new Date();
      const duration = 45;
      const volume = 5000;

      // Act
      const updatedProfile = recordWorkoutCompleted(profile, workoutDate, duration, volume);

      // Assert
      expect(updatedProfile.stats).toMatchObject({
        totalWorkouts: 1,
        totalMinutes: duration,
        totalVolume: volume,
        lastWorkoutDate: workoutDate,
      });
    });

    it('should update avatar', () => {
      const profile = createUserProfileFixture();
      const newAvatar = 'https://example.com/new-avatar.png';
      const result = updateAvatar(profile, newAvatar);
      expect(result.isSuccess).toBe(true);
      expect(result.value.avatar).toBe(newAvatar);
    });

    it('should update training constraints', () => {
      const profile = createUserProfileFixture();
      const newConstraints = createTrainingConstraintsFixture({ location: 'gym' });
      const result = updateTrainingConstraints(profile, newConstraints);
      expect(result.isSuccess).toBe(true);
      expect(result.value.trainingConstraints.location).toBe('gym');
    });

    it('should update experience profile', () => {
      const profile = createUserProfileFixture();
      const newExp = createExperienceProfileFixture({ level: 'advanced' });
      const result = updateExperienceProfile(profile, newExp);
      expect(result.isSuccess).toBe(true);
      expect(result.value.experienceProfile.level).toBe('advanced');
    });

    it('should update preferences', () => {
      const profile = createUserProfileFixture();
      const newPrefs = { units: 'imperial' as const };
      const updated = updatePreferences(profile, newPrefs);
      expect(updated.preferences.units).toBe('imperial');
    });

    it('should award achievement', () => {
      const profile = createUserProfileFixture({
        stats: createUserStatsFixture({ achievements: [] }),
      });
      const achievementId = crypto.randomUUID();
      const achievement: Achievement = {
        id: achievementId,
        type: 'first_workout',
        name: 'Test Achievement Name',
        earnedAt: new Date(),
        description: 'Test achievement description',
      };
      const updated = awardAchievement(profile, achievement);
      expect(updated.stats.achievements).toHaveLength(1);
      expect(updated.stats.achievements[0]?.id).toBe(achievementId);
    });

    it('should update last active', () => {
      const profile = createUserProfileFixture();
      const original = profile.lastActiveAt;
      const updated = updateLastActive(profile);
      expect(updated.lastActiveAt.getTime()).toBeGreaterThanOrEqual(original?.getTime() || 0);
    });
  });

  describe('Queries', () => {
    it('should check if streak is active', () => {
      // Arrange
      const profile = createUserProfileFixture({
        stats: createUserStatsFixture({ lastWorkoutDate: undefined }),
      });

      // Act & Assert
      expect(isStreakActive(profile)).toBe(false);
    });

    it('should get days since last workout', () => {
      // Arrange
      const profile = createUserProfileFixture({
        stats: createUserStatsFixture({ lastWorkoutDate: undefined }),
      });

      // Act
      const days = getDaysSinceLastWorkout(profile);

      // Assert
      expect(days).toBeNull();
    });

    it('should calculate average workout duration', () => {
      // Arrange
      const profile = createUserProfileFixture({
        stats: createUserStatsFixture({ totalWorkouts: 0 }),
      });

      // Act
      const duration = getAverageWorkoutDuration(profile);

      // Assert
      expect(duration).toBe(0);
    });

    it('should determine if check-in is needed', () => {
      const profile = createUserProfileFixture();
      const result = shouldReceiveCheckIn(profile);
      expect(typeof result).toBe('boolean');
    });

    it('should get member since days', () => {
      const profile = createUserProfileFixture();
      const days = getMemberSinceDays(profile);
      expect(days).toBeGreaterThanOrEqual(0);
    });
  });
});
