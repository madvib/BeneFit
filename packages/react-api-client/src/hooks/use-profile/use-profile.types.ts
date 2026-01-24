import type { GetProfileResponse, GetUserStatsResponse } from './use-profile';

export type UserProfile = GetProfileResponse;
export type FitnessGoals = UserProfile['fitnessGoals'];
export type PrimaryFitnessGoal = FitnessGoals['primary'];
export type TrainingConstraints = UserProfile['trainingConstraints'];
export type UserPreferences = UserProfile['preferences'];
export type ExperienceProfile = UserProfile['experienceProfile'];

export type UserStats = GetUserStatsResponse;
export type Achievement = UserStats['achievements'][number];
