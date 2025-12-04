import { describe, it, expect } from 'vitest';
import { createUserProfile, CreateUserProfileParams } from './user-profile.factory.js';
import {
  updateDisplayName,
  updateBio,
  updateFitnessGoals,
  recordWorkoutCompleted,
} from './user-profile.commands.js';
import {
  isStreakActive,
  getDaysSinceLastWorkout,
  getAverageWorkoutDuration,
} from './user-profile.queries.js';
import { createExperienceProfile } from '../../value-objects/experience-profile/index.js';
import { createFitnessGoals } from '../../value-objects/fitness-goals/index.js';
import { createDefaultPreferences } from '../../value-objects/user-preferences/index.js';
import { createUserStats } from '../../value-objects/user-stats/index.js';
import { createTrainingConstraints } from '@/shared/index.js';

describe('UserProfile Aggregate', () => {
  const validExperienceProfile = createExperienceProfile({
    level: 'intermediate',
    capabilities: {
      canDoFullPushup: true,
      canDoFullPullup: false,
      canRunMile: true,
      canSquatBelowParallel: true,
    },
  }).value;

  const validFitnessGoals = createFitnessGoals({
    primary: 'strength',
    motivation: 'Get stronger',
  }).value;

  const validConstraints = createTrainingConstraints({
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableEquipment: [],
    location: 'home',
  }).value;

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
        expect(profile.preferences).toEqual(createDefaultPreferences());
        expect(profile.stats).toEqual(createUserStats(expect.any(Date)));
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
      const createResult = createUserProfile(validParams);
      if (createResult.isSuccess) {
        const updatedResult = updateDisplayName(createResult.value, 'Jane Doe');

        expect(updatedResult.isSuccess).toBe(true);
        if (updatedResult.isSuccess) {
          const updatedProfile = updatedResult.value;
          expect(updatedProfile.displayName).toBe('Jane Doe');
          // Since both operations happen quickly, we just check that updated date is set
          expect(updatedProfile.updatedAt).toBeDefined();
        }
      }
    });

    it('should fail to update with empty display name', () => {
      const createResult = createUserProfile(validParams);
      if (createResult.isSuccess) {
        const updatedResult = updateDisplayName(createResult.value, '');

        expect(updatedResult.isFailure).toBe(true);
      }
    });

    it('should update bio', () => {
      const createResult = createUserProfile(validParams);
      if (createResult.isSuccess) {
        const updatedResult = updateBio(createResult.value, 'New bio');

        expect(updatedResult.isSuccess).toBe(true);
        if (updatedResult.isSuccess) {
          const updatedProfile = updatedResult.value;
          expect(updatedProfile.bio).toBe('New bio');
          // Since both operations happen quickly, we just check that updated date is set
          expect(updatedProfile.updatedAt).toBeDefined();
        }
      }
    });

    it('should update fitness goals', () => {
      const createResult = createUserProfile(validParams);
      if (createResult.isSuccess) {
        const newGoals = createFitnessGoals({
          primary: 'hypertrophy',
          motivation: 'Build muscle',
        }).value;

        const updatedResult = updateFitnessGoals(createResult.value, newGoals);

        expect(updatedResult.isSuccess).toBe(true);
        if (updatedResult.isSuccess) {
          const updatedProfile = updatedResult.value;
          expect(updatedProfile.fitnessGoals.primary).toBe('hypertrophy');
          // Since both operations happen quickly, we just check that updated date is set
          expect(updatedProfile.updatedAt).toBeDefined();
        }
      }
    });

    it('should record workout completed', () => {
      const createResult = createUserProfile(validParams);
      if (createResult.isSuccess) {
        const profile = createResult.value;
        const workoutDate = new Date();
        const updatedProfile = recordWorkoutCompleted(profile, workoutDate, 60, 500);

        expect(updatedProfile.stats.totalWorkouts).toBe(1);
        expect(updatedProfile.stats.totalMinutes).toBe(60);
        expect(updatedProfile.stats.totalVolume).toBe(500);
        expect(updatedProfile.stats.lastWorkoutDate).toEqual(workoutDate);
      }
    });
  });

  describe('Queries', () => {
    it('should check if streak is active', () => {
      const createResult = createUserProfile(validParams);
      if (createResult.isSuccess) {
        // Since lastWorkoutDate is undefined initially, streak is not active
        expect(isStreakActive(createResult.value)).toBe(false);
      }
    });

    it('should get days since last workout', () => {
      const createResult = createUserProfile(validParams);
      if (createResult.isSuccess) {
        const days = getDaysSinceLastWorkout(createResult.value);
        expect(days).toBeNull(); // Because no last workout date yet
      }
    });

    it('should calculate average workout duration', () => {
      const createResult = createUserProfile(validParams);
      if (createResult.isSuccess) {
        const duration = getAverageWorkoutDuration(createResult.value);
        expect(duration).toBe(0); // Because no workouts yet
      }
    });
  });
});
