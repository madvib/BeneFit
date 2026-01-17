import {
  UserProfile,
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
  stats: UserStats; // Always loaded with the query
};

// Domain to Database (Profile) - MUCH SIMPLER
export function toProfileDatabase(profile: UserProfile): NewProfile {
  // Extract lastAssessmentDate from experienceProfile
  const { lastAssessmentDate, ...experienceData } = profile.experienceProfile;

  // Extract targetDate from fitnessGoals
  const { targetDate: fitnessGoalsTargetDate, ...fitnessGoalsData } = profile.fitnessGoals;

  return {
    userId: profile.userId,

    // Personal info
    displayName: profile.displayName,
    avatarUrl: profile.avatar,
    bio: profile.bio,
    location: profile.location,
    timezone: profile.timezone,

    lastAssessmentDate,
    experienceProfileJson: experienceData,
    fitnessGoalsTargetDate: fitnessGoalsTargetDate || null,
    fitnessGoalsJson: fitnessGoalsData,
    trainingConstraintsJson: profile.trainingConstraints,
    preferencesJson: profile.preferences,

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
    lastWorkoutDate: profile.stats.lastWorkoutDate,

    updatedAt: new Date(),
  };
}

// Database to Domain
export function toDomain(row: ProfileWithRelations): UserProfile {
  return {
    userId: row.userId,

    displayName: row.displayName,
    avatar: row.avatarUrl ?? undefined,
    bio: row.bio ?? undefined,
    location: row.location ?? undefined,
    timezone: row.timezone,

    // Merge lastAssessmentDate back into experienceProfile
    experienceProfile: {
      ...row.experienceProfileJson,
      lastAssessmentDate: row.lastAssessmentDate,
    },
    fitnessGoals: {
      ...row.fitnessGoalsJson,
      targetDate: row.fitnessGoalsTargetDate || undefined,
    },
    trainingConstraints: row.trainingConstraintsJson,
    preferences: row.preferencesJson,

    stats: {
      totalWorkouts: row.stats.totalWorkoutsCompleted,
      totalMinutes: row.stats.totalMinutesTrained,
      totalVolume: row.stats.totalVolumeKg,
      currentStreak: row.stats.currentStreakDays,
      longestStreak: row.stats.longestStreakDays,
      lastWorkoutDate: row.stats.lastWorkoutDate ?? undefined,
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
    achievementType: achievement.type,
    name: achievement.name,
    description: achievement.description,
    iconUrl: achievement.iconUrl || null,
    earnedAt: achievement.earnedAt,
  };
}
