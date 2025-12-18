import { z } from 'zod';
import { Result, type UseCase } from '@bene/shared-domain';
import { UserProfileRepository } from '@/repositories/user-profile-repository.js';

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use GetProfileRequest type instead */
export interface GetProfileRequest_Deprecated {
  userId: string;
}

// Zod schema for request validation
export const GetProfileRequestSchema = z.object({
  userId: z.string(),
});

// Zod inferred type with original name
export type GetProfileRequest = z.infer<typeof GetProfileRequestSchema>;

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use GetProfileResponse type instead */
export interface GetProfileResponse_Deprecated {
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

// Zod schema for response validation
export const GetProfileResponseSchema = z.object({
  userId: z.string(),
  displayName: z.string(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  experienceLevel: z.string(),
  primaryGoal: z.string(),
  totalWorkouts: z.number(),
  currentStreak: z.number(),
});

// Zod inferred type with original name
export type GetProfileResponse = z.infer<typeof GetProfileResponseSchema>;

export class GetProfileUseCase implements UseCase<
  GetProfileRequest,
  GetProfileResponse
> {
  constructor(private profileRepository: UserProfileRepository) {}

  async execute(request: GetProfileRequest): Promise<Result<GetProfileResponse>> {
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
