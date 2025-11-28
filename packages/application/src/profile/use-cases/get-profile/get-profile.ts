import { Result, UseCase } from '@bene/core/shared';

import { UserProfileRepository } from '../../repositories/user-profile-repository.js';

export interface GetProfileRequest {
  userId: string;
}

export interface GetProfileResponse {
  userId: string;
  displayName: string;
  avatar?: string;
  bio?: string;
  location?: string;
  experienceLevel: string;
  primaryGoal: string;
  totalWorkouts: number;
  currentStreak: number;
}

export class GetProfileUseCase
  implements UseCase<GetProfileRequest, GetProfileResponse> {
  constructor(private profileRepository: UserProfileRepository) { }

  async execute(
    request: GetProfileRequest,
  ): Promise<Result<GetProfileResponse>> {
    // 1. Load profile
    const profileResult = await this.profileRepository.findById(request.userId);
    if (profileResult.isFailure) {
      return Result.fail(new Error('Profile not found'));
    }

    const profile = profileResult.value;

    return Result.ok({
      userId: profile.userId,
      displayName: profile.displayName,
      avatar: profile.avatar,
      bio: profile.bio,
      location: profile.location,
      experienceLevel: profile.experienceProfile.level,
      primaryGoal: profile.fitnessGoals.primary,
      totalWorkouts: profile.stats.totalWorkouts,
      currentStreak: profile.stats.currentStreak,
    });
  }
}