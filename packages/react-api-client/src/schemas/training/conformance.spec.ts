import { describe, it } from 'vitest';
import type {
  CreateProfileRequest,
  UpdateGoalsRequest,
  UpdateConstraintsRequest
} from '../../hooks/use-profile/use-profile';
import type { CompleteWorkoutRequest } from '../../hooks/use-workouts/use-workouts';
import {
  OnboardingFormValues,
  UpdateFitnessGoalsFormValues,
  UpdateTrainingConstraintsFormValues,
  CompleteWorkoutFormValues
} from './index';

/**
 * 🛰️ API Conformance Tests
 * 
 * These tests don't run code; they use the TypeScript compiler to ensure that 
 * our UI-optimized form values can be correctly mapped to the API request types.
 * 
 * If the API changes in a way that breaks our forms, these tests will fail at 
 * the type-checking stage.
 */
describe('Training Schemas Conformance', () => {
  it('OnboardingFormValues should satisfy CreateProfileRequest requirements', () => {
    type ApiBody = CreateProfileRequest['json'];

    // This allows us to verify mapping logic without cluttering source files
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _map = (v: OnboardingFormValues): ApiBody => ({
      displayName: v.displayName,
      timezone: 'UTC',
      experienceProfile: {
        level: v.experienceLevel,
        history: {
          previousPrograms: [],
          sports: [],
          certifications: [],
          yearsTraining: 0
        },
        capabilities: {
          canDoFullPushup: false,
          canDoFullPullup: false,
          canRunMile: false,
          canSquatBelowParallel: false
        }
      },
      fitnessGoals: {
        primary: v.primaryGoal,
        secondary: v.secondaryGoals,
        motivation: '',
        successCriteria: []
      },
      trainingConstraints: {
        availableDays: [],
        availableEquipment: v.equipment as string[],
        location: 'gym',
        maxDuration: v.minutesPerWorkout
      },
      bio: v.bio,
      location: v.location,
    });
  });

  it('UpdateFitnessGoalsFormValues should satisfy UpdateGoalsRequest requirements', () => {
    type ApiGoals = UpdateGoalsRequest['json']['goals'];

    // Verify that our form values structure is a subset or compatible with ApiGoals
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _check = (v: UpdateFitnessGoalsFormValues): ApiGoals => ({
      ...v,
      primary: v.primary,
      motivation: v.motivation || '',
      successCriteria: v.successCriteria || [],
    });
  });

  it('UpdateTrainingConstraintsFormValues should satisfy UpdateConstraintsRequest requirements', () => {
    type ApiConstraints = UpdateConstraintsRequest['json']['constraints'];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _check = (v: UpdateTrainingConstraintsFormValues): ApiConstraints => ({
      ...v,
      preferredTime: v.preferredTime as any,
      injuries: v.injuries as any[]
    });
  });

  it('CompleteWorkoutFormValues should satisfy CompleteWorkoutRequest requirements', () => {
    type ApiPerformance = CompleteWorkoutRequest['json']['performance'];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const _check = (v: CompleteWorkoutFormValues): Partial<ApiPerformance> => ({
      ...v.performance,
    });
  });
});
