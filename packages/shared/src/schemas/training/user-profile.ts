import { z } from 'zod';
import { ExperienceProfileSchema } from './experience-profile.js';
import { FitnessGoalsSchema } from './fitness-goals.js';
import { TrainingConstraintsSchema } from './training-constraints.js';
import { UserPreferencesSchema } from './user-preferences.js';
import { UserStatsSchema } from './user-stats.js';

// User Profile Schemas

export const UserProfileSchema = z.object({
  // Personal info
  displayName: z.string(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string(),
  // Fitness profile
  experienceProfile: ExperienceProfileSchema,
  fitnessGoals: FitnessGoalsSchema,
  trainingConstraints: TrainingConstraintsSchema,
  // App preferences
  preferences: UserPreferencesSchema,
  // Stats and progress
  stats: UserStatsSchema,
  // Metadata
  lastActiveAt: z.string(), // ISO date string
});

// Export inferred types
export type UserProfile = z.infer<typeof UserProfileSchema>;
