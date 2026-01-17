import { describe, it, expect } from 'vitest';
import { createUserProfile, CreateUserProfileParams } from '../user-profile.factory.js';
import { createUserProfileFixture } from './user-profile.fixtures.js';
import {
  createExperienceProfileFixture,
  createFitnessGoalsFixture,
  createUserPreferencesFixture,
  createUserStatsFixture
} from '../../../value-objects/index.js';
import { createTrainingConstraintsFixture } from '../../../../shared/index.js';
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

describe('UserProfile Aggregate', () => {
  const validExperienceProfile = createExperienceProfileFixture({
    level: 'intermediate',
    capabilities: {
      canDoFullPushup: true,
      canDoFullPullup: false,
      canRunMile: true,
      canSquatBelowParallel: true,
      estimatedMaxes: { unit: 'kg' },
    },
  });

  const validFitnessGoals = createFitnessGoalsFixture({
    primary: 'strength',
    motivation: 'Get stronger',
  });

  const validConstraints = createTrainingConstraintsFixture({
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableEquipment: [],
    location: 'home',
  });

  const validParams: CreateUserProfileParams = {
    userId: 'user-123',
    displayName: 'John Doe',
    timezone: 'UTC',
    experienceProfile: validExperienceProfile,
    fitnessGoals: validFitnessGoals,
    trainingConstraints: validConstraints,
    bio: 'Fitness enthusiast',
    avatar: 'https://example.com/avatar.jpg',
    location: 'New York',
  };

  describe('Factory', () => {
    it('should create a valid user profile', () => {
      const result = createUserProfile(validParams);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        const profile = result.value;
        expect(profile.userId).toBe('user-123');
        expect(profile.displayName).toBe('John Doe');
        expect(profile.experienceProfile).toEqual(validExperienceProfile);
        expect(profile.fitnessGoals).toEqual(validFitnessGoals);
        expect(profile.preferences).toBeDefined();
        expect(profile.stats).toBeDefined();
      }
    });

    it('should fail with empty userId', () => {
      const result = createUserProfile({
        ...validParams,
        userId: '',
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail with empty displayName', () => {
      const result = createUserProfile({
        ...validParams,
        displayName: '',
      });

      expect(result.isFailure).toBe(true);
    });

    it('should fail with display name too long', () => {
      const result = createUserProfile({
        ...validParams,
        displayName: 'A'.repeat(101),
      });

      expect(result.isFailure).toBe(true);
    });
  });

  describe('Commands', () => {
    it('should update display name', () => {
      const profile = createUserProfileFixture(validParams);
      const updatedResult = updateDisplayName(profile, 'Jane Doe');

      expect(updatedResult.isSuccess).toBe(true);
      if (updatedResult.isSuccess) {
        const updatedProfile = updatedResult.value;
        expect(updatedProfile.displayName).toBe('Jane Doe');
        // Since both operations happen quickly, we just check that updated date is set
        expect(updatedProfile.updatedAt).toBeDefined();
      }
    });

    it('should fail to update with empty display name', () => {
      const profile = createUserProfileFixture(validParams);
      const updatedResult = updateDisplayName(profile, '');

      expect(updatedResult.isFailure).toBe(true);
    });

    it('should update bio', () => {
      const profile = createUserProfileFixture(validParams);
      const updatedResult = updateBio(profile, 'New bio');

      expect(updatedResult.isSuccess).toBe(true);
      if (updatedResult.isSuccess) {
        const updatedProfile = updatedResult.value;
        expect(updatedProfile.bio).toBe('New bio');
        // Since both operations happen quickly, we just check that updated date is set
        expect(updatedProfile.updatedAt).toBeDefined();
      }
    });

    it('should update fitness goals', () => {
      const profile = createUserProfileFixture(validParams);
      const newGoals = createFitnessGoalsFixture({
        primary: 'hypertrophy',
        motivation: 'Build muscle',
      });

      const updatedResult = updateFitnessGoals(profile, newGoals);

      expect(updatedResult.isSuccess).toBe(true);
      if (updatedResult.isSuccess) {
        const updatedProfile = updatedResult.value;
        expect(updatedProfile.fitnessGoals.primary).toBe('hypertrophy');
        // Since both operations happen quickly, we just check that updated date is set
        expect(updatedProfile.updatedAt).toBeDefined();
      }
    });

    it('should record workout completed', () => {
      const profile = createUserProfileFixture({
        ...validParams,
        stats: createUserStatsFixture({
          totalWorkouts: 0,
          totalMinutes: 0,
          totalVolume: 0,
          lastWorkoutDate: undefined,
        })
      });
      const workoutDate = new Date();
      const updatedProfile = recordWorkoutCompleted(profile, workoutDate, 60, 500);

      expect(updatedProfile.stats.totalWorkouts).toBe(1);
      expect(updatedProfile.stats.totalMinutes).toBe(60);
      expect(updatedProfile.stats.totalVolume).toBe(500);
      expect(updatedProfile.stats.lastWorkoutDate).toEqual(workoutDate);
    });
  });

  describe('Queries', () => {
    it('should check if streak is active', () => {
      const profile = createUserProfileFixture({
        ...validParams,
        stats: createUserStatsFixture({ lastWorkoutDate: undefined })
      });
      // Since lastWorkoutDate is undefined initially, streak is not active
      expect(isStreakActive(profile)).toBe(false);
    });

    it('should get days since last workout', () => {
      const profile = createUserProfileFixture({
        ...validParams,
        stats: createUserStatsFixture({ lastWorkoutDate: undefined })
      });
      const days = getDaysSinceLastWorkout(profile);
      expect(days).toBeNull(); // Because no last workout date yet
    });

    it('should calculate average workout duration', () => {
      const profile = createUserProfileFixture({
        ...validParams,
        stats: createUserStatsFixture({ totalWorkouts: 0 })
      });
      const duration = getAverageWorkoutDuration(profile);
      expect(duration).toBe(0); // Because no workouts yet
    });
  });
});
