import { z } from 'zod';
import { describe, it, expect, beforeAll } from 'vitest';

import { createTrainingConstraintsFixture } from '@/shared/index.js';
import {
  createExperienceProfileFixture,
  createFitnessGoalsFixture,
  createUserStatsFixture,
} from '@/user-profile/value-objects/index.js';
import { ExperienceProfile, FitnessGoals } from '@/user-profile/value-objects/index.js';
import { TrainingConstraints } from '@/shared/index.js';

import {
  updateDisplayName,
  updateBio,
  updateFitnessGoals,
  recordWorkoutCompleted,
} from '../user-profile.commands.js';
import {
  isStreakActive,
  getDaysSinceLastWorkout,
  getAverageWorkoutDuration,
} from '../user-profile.queries.js';
import { CreateUserProfileSchema } from '../user-profile.factory.js';
import { createUserProfileFixture } from './user-profile.fixtures.js';

type CreateUserProfileInput = z.input<typeof CreateUserProfileSchema>;

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
      motivation: 'Get stronger',
    });

    validConstraints = createTrainingConstraintsFixture({
      availableDays: ['Monday', 'Wednesday', 'Friday'],
      availableEquipment: [],
      location: 'home',
    });

    validParams = {
      userId: '550e8400-e29b-41d4-a716-446655440000',
      displayName: 'John Doe',
      timezone: 'UTC',
      experienceProfile: validExperienceProfile,
      fitnessGoals: validFitnessGoals,
      trainingConstraints: validConstraints,
      bio: 'Fitness enthusiast',
      avatar: 'https://example.com/avatar.jpg',
      location: 'New York',
    };
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
          displayName: 'John Doe',
          experienceProfile: validExperienceProfile,
          fitnessGoals: validFitnessGoals,
        });
        expect(result.data.preferences).toBeDefined();
        expect(result.data.stats).toBeDefined();
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

      // Act
      const updatedResult = updateDisplayName(profile, 'Jane Doe');

      // Assert
      expect(updatedResult.isSuccess).toBe(true);
      expect(updatedResult.value.displayName).toBe('Jane Doe');
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

      // Act
      const updatedResult = updateBio(profile, 'New bio');

      // Assert
      expect(updatedResult.isSuccess).toBe(true);
      expect(updatedResult.value.bio).toBe('New bio');
      expect(updatedResult.value.updatedAt).toBeDefined();
    });

    it('should update fitness goals', () => {
      // Arrange
      const profile = createUserProfileFixture();
      const newGoals = createFitnessGoalsFixture({
        primary: 'hypertrophy',
        motivation: 'Build muscle',
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
        })
      });
      const workoutDate = new Date();

      // Act
      const updatedProfile = recordWorkoutCompleted(profile, workoutDate, 60, 500);

      // Assert
      expect(updatedProfile.stats).toMatchObject({
        totalWorkouts: 1,
        totalMinutes: 60,
        totalVolume: 500,
        lastWorkoutDate: workoutDate,
      });
    });
  });

  describe('Queries', () => {
    it('should check if streak is active', () => {
      // Arrange
      const profile = createUserProfileFixture({
        stats: createUserStatsFixture({ lastWorkoutDate: undefined })
      });

      // Act & Assert
      expect(isStreakActive(profile)).toBe(false);
    });

    it('should get days since last workout', () => {
      // Arrange
      const profile = createUserProfileFixture({
        stats: createUserStatsFixture({ lastWorkoutDate: undefined })
      });

      // Act
      const days = getDaysSinceLastWorkout(profile);

      // Assert
      expect(days).toBeNull();
    });

    it('should calculate average workout duration', () => {
      // Arrange
      const profile = createUserProfileFixture({
        stats: createUserStatsFixture({ totalWorkouts: 0 })
      });

      // Act
      const duration = getAverageWorkoutDuration(profile);

      // Assert
      expect(duration).toBe(0);
    });
  });
});
