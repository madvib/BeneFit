import { z } from 'zod';
import { Result, BaseUseCase } from '@bene/shared';
import { toUserStatsView, type UserStatsView } from '@bene/training-core';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';

export const GetUserStatsRequestSchema = z.object({
  userId: z.uuid(),
});

export type GetUserStatsRequest = z.infer<typeof GetUserStatsRequestSchema>;

/**
 * Response type - uses domain view
 */
export type GetUserStatsResponse = UserStatsView;

export class GetUserStatsUseCase extends BaseUseCase<
  GetUserStatsRequest,
  GetUserStatsResponse
> {
  constructor(private profileRepository: UserProfileRepository) {
    super();
  }

  protected async performExecution(request: GetUserStatsRequest): Promise<Result<GetUserStatsResponse>> {
    // 1. Load profile
    const profileResult = await this.profileRepository.findById(request.userId);
    if (profileResult.isFailure) {
      return Result.fail(new Error('Profile not found'));
    }

    const profile = profileResult.value;

    // 2. Map to view (includes computed fields for streakActive, daysSinceLastWorkout)
    return Result.ok(toUserStatsView(profile.stats));
  }
}
