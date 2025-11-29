import type { TrainingConstraints } from '@bene/domain-shared';
import {
  FitnessGoals,
  UserPreferences,
  UserStats,
  ExperienceProfile,
} from '../../value-objects/index.js';

export interface UserProfileData {
  userId: string; // References AuthUser

  // Personal info
  displayName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  timezone: string;

  // Fitness profile
  experienceProfile: ExperienceProfile;
  fitnessGoals: FitnessGoals;
  trainingConstraints: TrainingConstraints; // From planning module

  // App preferences
  preferences: UserPreferences;

  // Stats and progress
  stats: UserStats;

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date;
}

export type UserProfile = Readonly<UserProfileData>;
