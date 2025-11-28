import { Result } from '@bene/core/shared';
import { UseCase } from '../../shared/use-case';
import { 
  UserProfile, 
  UserProfileCommands 
} from '@bene/core/profile';
import { UserProfileRepository } from '../../profile/repositories/user-profile-repository';

export interface UpdatePreferencesRequest {
  userId: string;
  preferences: Partial<any>; // Using any since the exact type depends on core implementation
}

export interface UpdatePreferencesResponse {
  userId: string;
  preferences: any; // Using any since the exact type depends on core implementation
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
      return Result.fail('Profile not found');
    }

    // 2. Update preferences using command
    const updatedProfileResult = UserProfileCommands.updatePreferences(
      profileResult.value,
      request.preferences,
    );

    if (updatedProfileResult.isFailure) {
      return Result.fail(updatedProfileResult.error as string);
    }

    // 3. Save
    await this.profileRepository.save(updatedProfileResult.value);

    return Result.ok({
      userId: request.userId,
      preferences: updatedProfileResult.value.preferences,
    });
  }
}