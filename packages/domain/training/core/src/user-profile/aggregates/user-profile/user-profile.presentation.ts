import { z } from 'zod';
import { TrainingConstraintsSchema } from '@/shared/value-objects/training-constraints/training-constraints.presentation.js';
import { UserStatsSchema, toUserStatsSchema, UserPreferencesSchema, toUserPreferencesSchema, FitnessGoalsSchema, toFitnessGoalsSchema, ExperienceProfileSchema, toExperienceProfileSchema } from '../../value-objects/index.js';
import { isStreakActive, getDaysSinceLastWorkout, getAverageWorkoutDuration, shouldReceiveCheckIn } from './user-profile.queries.js';
import { UserProfile } from './user-profile.types.js';



export const UserProfileSchema = z.object({
  userId: z.string(),
  displayName: z.string().min(1).max(100),
  avatar: z.string().url().optional(),
  bio: z.string().min(1).max(500).optional(),
  location: z.string().min(1).max(100).optional(),
  timezone: z.string().min(1).max(50),
  experienceProfile: ExperienceProfileSchema,
  fitnessGoals: FitnessGoalsSchema,
  trainingConstraints: TrainingConstraintsSchema,
  preferences: UserPreferencesSchema,
  stats: UserStatsSchema,

  // Computations
  streakActive: z.boolean(),
  daysSinceLastWorkout: z.number().int().min(0).max(10000).nullable(),
  averageWorkoutDuration: z.number().int().min(0).max(240),
  achievementsCount: z.number().int().min(0).max(10000),
  shouldReceiveCheckIn: z.boolean(),
  memberSinceDays: z.number().int().min(0).max(10000),

  createdAt: z.iso.datetime(),
  lastActiveAt: z.iso.datetime(),
});

export type UserProfilePresentation = z.infer<typeof UserProfileSchema>;

export function toUserProfileSchema(profile: UserProfile): UserProfilePresentation {
  const now = new Date();
  const memberSinceDays = Math.floor((now.getTime() - profile.createdAt.getTime()) / (1000 * 60 * 60 * 24));

  return {
    userId: profile.userId,
    displayName: profile.displayName,
    avatar: profile.avatar,
    bio: profile.bio,
    location: profile.location,
    timezone: profile.timezone,
    experienceProfile: toExperienceProfileSchema(profile.experienceProfile),
    fitnessGoals: toFitnessGoalsSchema(profile.fitnessGoals),
    trainingConstraints: {
      ...profile.trainingConstraints,
      availableDays: [...profile.trainingConstraints.availableDays],
      availableEquipment: [...profile.trainingConstraints.availableEquipment],
      injuries: profile.trainingConstraints.injuries?.map(i => ({
        ...i,
        reportedDate: i.reportedDate,
        avoidExercises: [...i.avoidExercises] // Convert readonly to mutable for schema
      }))
    },
    preferences: toUserPreferencesSchema(profile.preferences),
    stats: toUserStatsSchema(profile.stats),

    streakActive: isStreakActive(profile),
    daysSinceLastWorkout: getDaysSinceLastWorkout(profile),
    averageWorkoutDuration: getAverageWorkoutDuration(profile),
    achievementsCount: profile.stats.achievements.length,
    shouldReceiveCheckIn: shouldReceiveCheckIn(profile),
    memberSinceDays,

    createdAt: profile.createdAt.toISOString(),
    lastActiveAt: profile.lastActiveAt.toISOString(),
  };
}
