import { z } from 'zod';
import { Result, BaseUseCase } from '@bene/shared';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';
import { UserProfileView, toUserProfileView } from '@bene/training-core';

// Zod schema for request validation
export const GetProfileRequestSchema = z.object({
  userId: z.uuid(),
});

export type GetProfileRequest = z.infer<typeof GetProfileRequestSchema>;

// The response is now defined by our domain view
export type GetProfileResponse = UserProfileView;

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

    // 2. Map to View
    return Result.ok(toUserProfileView(profileResult.value));
  }
}
