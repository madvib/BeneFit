import {
  UserProfile,
  ExperienceProfile,
  FitnessGoals,
  TrainingConstraints,
  UserPreferences,
  Achievement,
} from '@bene/training-core';
import type {
  Profile,
  NewProfile,
  UserStats,
  NewUserStats,
  Achievement as DbAchievement,
} from '../data/schema';
type ProfileWithRelations = Profile & {
  stats: UserStats | null;
};

// Domain to Database (Profile) - MUCH SIMPLER
export function toProfileDatabase(profile: UserProfile): NewProfile {
  return {
    userId: profile.userId,

    // Personal info
    displayName: profile.displayName,
    avatarUrl: profile.avatar || null,
    bio: profile.bio || null,
    location: profile.location || null,
    timezone: profile.timezone,

    // Everything as JSON - no extraction needed
    experienceProfileJson: profile.experienceProfile as any,
    fitnessGoalsJson: profile.fitnessGoals as any,
    trainingConstraintsJson: profile.trainingConstraints as any,
    preferencesJson: profile.preferences as any,

    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
    lastActiveAt: profile.lastActiveAt,
  };
}

// Domain to Database (Stats)
export function toStatsDatabase(profile: UserProfile): NewUserStats {
  return {
    userId: profile.userId,

    totalWorkoutsCompleted: profile.stats.totalWorkouts,
    totalMinutesTrained: profile.stats.totalMinutes,
    totalVolumeKg: profile.stats.totalVolume,

    currentStreakDays: profile.stats.currentStreak,
    longestStreakDays: profile.stats.longestStreak,
    lastWorkoutDate: profile.stats.lastWorkoutDate || null,

    updatedAt: new Date(),
  };
}

// Database to Domain
export function toDomain(row: ProfileWithRelations): UserProfile {
  const stats = row.stats || {
    userId: row.userId,
    totalWorkoutsCompleted: 0,
    totalMinutesTrained: 0,
    totalVolumeKg: 0,
    currentStreakDays: 0,
    longestStreakDays: 0,
    lastWorkoutDate: null,
    updatedAt: row.updatedAt,
  };

  return {
    userId: row.userId,

    displayName: row.displayName,
    avatar: row.avatarUrl || undefined,
    bio: row.bio || undefined,
    location: row.location || undefined,
    timezone: row.timezone,

    // Source of truth from JSON
    experienceProfile: row.experienceProfileJson as ExperienceProfile,
    fitnessGoals: row.fitnessGoalsJson as FitnessGoals,
    trainingConstraints: row.trainingConstraintsJson as TrainingConstraints,
    preferences: row.preferencesJson as UserPreferences,

    stats: {
      totalWorkouts: stats.totalWorkoutsCompleted,
      totalMinutes: stats.totalMinutesTrained,
      totalVolume: stats.totalVolumeKg,
      currentStreak: stats.currentStreakDays,
      longestStreak: stats.longestStreakDays,
      lastWorkoutDate: stats.lastWorkoutDate || undefined,
      achievements: [], // Loaded separately
      firstWorkoutDate: row.createdAt,
      joinedAt: row.createdAt,
    },

    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    lastActiveAt: row.lastActiveAt,
  };
}

// Achievement mappers
export function achievementToDomain(row: DbAchievement): Achievement {
  return {
    id: row.id,
    type: row.achievementType,
    name: row.name,
    description: row.description,
    earnedAt: row.earnedAt,
    iconUrl: row.iconUrl || undefined,
  };
}

export function achievementToDatabase(userId: string, achievement: Achievement) {
  return {
    id: achievement.id,
    userId,
    type: achievement.type,
    name: achievement.name,
    description: achievement.description,
    iconUrl: achievement.iconUrl || null,
    earnedAt: achievement.earnedAt,
  };
}
