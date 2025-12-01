import { Result, UseCase } from '@bene/domain-shared';
import { UserProfileCommands } from '@core/index.js';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';

export interface UpdatePreferencesRequest {
  userId: string;
  preferences: Partial<Record<string, unknown>>; // Using Record since the exact type depends on core implementation
}

export interface UpdatePreferencesResponse {
  userId: string;
  preferences: Record<string, unknown>; // Using Record since the exact type depends on core implementation
}

export class UpdatePreferencesUseCase
  implements UseCase<UpdatePreferencesRequest, UpdatePreferencesResponse>
{
  constructor(private profileRepository: UserProfileRepository) {}

  async execute(
    request: UpdatePreferencesRequest,
  ): Promise<Result<UpdatePreferencesResponse>> {
    // 1. Load profile
    const profileResult = await this.profileRepository.findById(request.userId);
    if (profileResult.isFailure) {
      return Result.fail(new Error('Profile not found'));
    }

    // 2. Update preferences using command
    const updatedProfile = UserProfileCommands.updatePreferences(
      profileResult.value,
      request.preferences,
    );

    // 3. Save
    await this.profileRepository.save(updatedProfile);

    return Result.ok({
      userId: request.userId,
      preferences: updatedProfile.preferences,
    });
  }
}
