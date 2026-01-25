import type { GetActivePlanResponse, GeneratePlanResponse } from './use-fitness-plan';

export type FitnessPlan = NonNullable<GetActivePlanResponse['plan']>;
export type FitnessPlanWeek = FitnessPlan['weeks'][number];
export type FitnessPlanWorkout = FitnessPlanWeek['workouts'][number];
export type FitnessPlanStatus = FitnessPlan['status'];
export type FitnessPlanWorkoutStatus = FitnessPlanWorkout['status'];
export type FitnessPlanWorkoutCategory = FitnessPlanWorkout['category'];
export type FitnessPlanWorkoutImportance = FitnessPlanWorkout['importance'];
export type FitnessPlanGoal = FitnessPlanWorkout['goals'];

export type FitnessPlanPreview = GeneratePlanResponse['preview'];

