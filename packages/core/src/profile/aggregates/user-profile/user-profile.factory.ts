import { Guard, Result } from '@shared';
import { TrainingConstraints } from '../../../plans/index.js';
import { ExperienceProfile } from '../../value-objects/experience-profile/index.js';
import { FitnessGoals } from '../../value-objects/fitness-goals/index.js';
import { createDefaultPreferences } from '../../value-objects/user-preferences/index.js';
import { createUserStats } from '../../value-objects/user-stats/index.js';
import { UserProfile } from './user-profile.types.js';

export interface CreateUserProfileParams {
  userId: string;
  displayName: string;
  timezone: string;
  experienceProfile: ExperienceProfile;
  fitnessGoals: FitnessGoals;
  trainingConstraints: TrainingConstraints;
  avatar?: string;
  bio?: string;
  location?: string;
}

export function createUserProfile(
  params: CreateUserProfileParams,
): Result<UserProfile> {
  const guardResult = Guard.combine([
    Guard.againstNullOrUndefinedBulk([
      { argument: params.userId, argumentName: 'userId' },
      { argument: params.displayName, argumentName: 'displayName' },
      { argument: params.timezone, argumentName: 'timezone' },
      { argument: params.experienceProfile, argumentName: 'experienceProfile' },
      { argument: params.fitnessGoals, argumentName: 'fitnessGoals' },
      { argument: params.trainingConstraints, argumentName: 'trainingConstraints' },
    ]),

    Guard.againstEmptyString(params.userId, 'userId'),
    Guard.againstEmptyString(params.displayName, 'displayName'),
    Guard.againstTooLong(params.displayName, 100, 'displayName'),
    params.bio ? Guard.againstTooLong(params.bio, 500, 'bio') : Result.ok(),
  ]);
  if (guardResult.isFailure) return Result.fail(guardResult.error);

  const now = new Date();

  return Result.ok({
    userId: params.userId,
    displayName: params.displayName,
    avatar: params.avatar,
    bio: params.bio,
    location: params.location,
    timezone: params.timezone,
    experienceProfile: params.experienceProfile,
    fitnessGoals: params.fitnessGoals,
    trainingConstraints: params.trainingConstraints,
    preferences: createDefaultPreferences(),
    stats: createUserStats(now),
    createdAt: now,
    updatedAt: now,
    lastActiveAt: now,
  });
}
