import { z } from 'zod';
import { DomainBrandTag } from '@bene/shared';
import { TrainingConstraintsSchema } from '@/shared/index.js';
import {
  ExperienceProfileSchema,
  FitnessGoalsSchema,
  UserPreferencesSchema,
  UserStatsSchema,
} from '../../value-objects/index.js';

/**
 * 1. DEFINE CORE SCHEMA
 */
export const UserProfileSchema = z
  .object({
    userId: z.uuid(), // References AuthUser

    // Personal info
    displayName: z.string().min(1).max(100),
    avatar: z.url().optional(),
    bio: z.string().max(500).optional(),
    location: z.string().max(100).optional(),
    timezone: z.string().min(1).max(50),

    // Fitness profile
    experienceProfile: ExperienceProfileSchema,
    fitnessGoals: FitnessGoalsSchema,
    trainingConstraints: TrainingConstraintsSchema,

    // App preferences
    preferences: UserPreferencesSchema,

    // Stats and progress
    stats: UserStatsSchema,

    // Metadata
    createdAt: z.coerce.date<Date>(),
    updatedAt: z.coerce.date<Date>(),
    lastActiveAt: z.coerce.date<Date>(),
  })
  .brand<DomainBrandTag>();

export type UserProfile = Readonly<z.infer<typeof UserProfileSchema>>;
