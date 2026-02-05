import { z } from 'zod';
import { Result, BaseUseCase } from '@bene/shared';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';
import { UserProfileView, toUserProfileView, CreateUserProfileSchema } from '@bene/training-core';

// Zod schema for request validation
export const GetProfileRequestSchema = z.object({
  userId: z.uuid(),
});

export type GetProfileRequest = z.infer<typeof GetProfileRequestSchema>;

// The response is now defined by our domain view
export type GetProfileResponse = UserProfileView;

export class GetProfileUseCase extends BaseUseCase<GetProfileRequest, GetProfileResponse> {
  constructor(private profileRepository: UserProfileRepository) {
    super();
  }

  protected async performExecution(
    request: GetProfileRequest,
  ): Promise<Result<GetProfileResponse>> {
    // 1. Load profile
    const profileResult = await this.profileRepository.findById(request.userId);

    if (profileResult.isSuccess) {
      return Result.ok(toUserProfileView(profileResult.value));
    }

    // 2. If not found, create default profile
    // We use the factory schema which now handles all defaults for sub-objects
    const defaultProfile = CreateUserProfileSchema.parse({
      userId: request.userId,
      displayName: 'New User',
      timezone: 'UTC',
    });

    // 3. Persist the default profile
    const saveResult = await this.profileRepository.save(defaultProfile);
    if (saveResult.isFailure) {
      return Result.fail(saveResult.error);
    }

    // 4. Return the new profile view
    return Result.ok(toUserProfileView(defaultProfile));
  }
}
