import { Guard, Result } from '@bene/domain-shared';
import { TrainingConstraints } from '@bene/domain-shared';
import { FitnessGoals, ExperienceProfile, UserPreferences, Achievement } from '../../value-objects/index.js';
import { UserProfile } from './user-profile.types.js';
export function updateDisplayName(
  profile: UserProfile,
  displayName: string,
): Result<UserProfile> {
  const guardResult = Guard.combine([
    Guard.againstEmptyString(displayName, 'displayName'),
    Guard.againstTooLong(displayName, 100, 'displayName'),
  ]);
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  return Result.ok({
    ...profile,
    displayName,
    updatedAt: new Date(),
  });
}

export function updateAvatar(
  profile: UserProfile,
  avatarUrl: string,
): Result<UserProfile> {
  const guardResult = Guard.againstEmptyString(avatarUrl, 'avatarUrl');
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  return Result.ok({
    ...profile,
    avatar: avatarUrl,
    updatedAt: new Date(),
  });
}

export function updateBio(profile: UserProfile, bio: string): Result<UserProfile> {
  const guardResult = Guard.againstTooLong(bio, 500, 'bio');
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  return Result.ok({
    ...profile,
    bio,
    updatedAt: new Date(),
  });
}

export function updateFitnessGoals(
  profile: UserProfile,
  goals: FitnessGoals,
): Result<UserProfile> {
  const guardResult = Guard.againstNullOrUndefined(goals, 'goals');
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  return Result.ok({
    ...profile,
    fitnessGoals: goals,
    updatedAt: new Date(),
  });
}

export function updateTrainingConstraints(
  profile: UserProfile,
  constraints: TrainingConstraints,
): Result<UserProfile> {
  const guardResult = Guard.againstNullOrUndefined(constraints, 'constraints');
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  return Result.ok({
    ...profile,
    trainingConstraints: constraints,
    updatedAt: new Date(),
  });
}

export function updateExperienceProfile(
  profile: UserProfile,
  experienceProfile: ExperienceProfile,
): Result<UserProfile> {
  const guardResult = Guard.againstNullOrUndefined(
    experienceProfile,
    'experienceProfile',
  );
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  return Result.ok({
    ...profile,
    experienceProfile,
    updatedAt: new Date(),
  });
}

export function updatePreferences(
  profile: UserProfile,
  preferences: Partial<UserPreferences>,
): UserProfile {
  return {
    ...profile,
    preferences: {
      ...profile.preferences,
      ...preferences,
    },
    updatedAt: new Date(),
  };
}

export function recordWorkoutCompleted(
  profile: UserProfile,
  workoutDate: Date,
  durationMinutes: number,
  volumeLifted: number,
): UserProfile {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const workoutDay = new Date(workoutDate);
  workoutDay.setHours(0, 0, 0, 0);

  // Update streak
  let newStreak = profile.stats.currentStreak;
  if (profile.stats.lastWorkoutDate) {
    const lastWorkoutDay = new Date(profile.stats.lastWorkoutDate);
    lastWorkoutDay.setHours(0, 0, 0, 0);

    const daysSinceLastWorkout = Math.floor(
      (workoutDay.getTime() - lastWorkoutDay.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (daysSinceLastWorkout === 1) {
      newStreak += 1;
    } else if (daysSinceLastWorkout > 1) {
      newStreak = 1; // Streak broken
    }
    // If same day, don't change streak
  } else {
    newStreak = 1; // First workout
  }

  return {
    ...profile,
    stats: {
      ...profile.stats,
      totalWorkouts: profile.stats.totalWorkouts + 1,
      totalMinutes: profile.stats.totalMinutes + durationMinutes,
      totalVolume: profile.stats.totalVolume + volumeLifted,
      currentStreak: newStreak,
      longestStreak: Math.max(newStreak, profile.stats.longestStreak),
      lastWorkoutDate: workoutDate,
    },
    lastActiveAt: new Date(),
    updatedAt: new Date(),
  };
}

export function awardAchievement(
  profile: UserProfile,
  achievement: Achievement,
): UserProfile {
  // Check if already earned
  const alreadyEarned = profile.stats.achievements.some(
    (a: { id: string }) => a.id === achievement.id,
  );
  if (alreadyEarned) {
    return profile;
  }

  return {
    ...profile,
    stats: {
      ...profile.stats,
      achievements: [...profile.stats.achievements, achievement],
    },
    updatedAt: new Date(),
  };
}

export function updateLastActive(profile: UserProfile): UserProfile {
  return {
    ...profile,
    lastActiveAt: new Date(),
  };
}
