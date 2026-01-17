import { z } from 'zod';
import { Result, BaseUseCase } from '@bene/shared';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';

// Zod schema for request validation
export const GetProfileRequestSchema = z.object({
  userId: z.string(),
});

// Zod inferred type with original name
export type GetProfileRequest = z.infer<typeof GetProfileRequestSchema>;

// Zod schema for response validation
export const GetProfileResponseSchema = z.object({
  userId: z.string(),
  displayName: z.string().min(1).max(100),
  avatar: z.string().url().optional(),
  bio: z.string().min(1).max(500).optional(),
  location: z.string().min(1).max(100).optional(),
  experienceLevel: z.string().min(1).max(50),
  primaryGoal: z.string().min(1).max(50),
  totalWorkouts: z.number().int().min(0).max(100000),
  totalMinutes: z.number().int().min(0).max(1000000),
  totalAchievements: z.number().int().min(0).max(1000),
  currentStreak: z.number().int().min(0).max(3650),
  preferences: z.any(), // Add preferences - simplified for now as it's a deep object
});

// Zod inferred type with original name
export type GetProfileResponse = z.infer<typeof GetProfileResponseSchema>;

export class GetProfileUseCase extends BaseUseCase<
  GetProfileRequest,
  GetProfileResponse
> {
  constructor(private profileRepository: UserProfileRepository) {
    super();
  }

  protected async performExecution(request: GetProfileRequest): Promise<Result<GetProfileResponse>> {
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
      totalMinutes: profile.stats.totalMinutes,
      totalAchievements: profile.stats.achievements.length,
      currentStreak: profile.stats.currentStreak,
      preferences: profile.preferences,
    });
  }
}
