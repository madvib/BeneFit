import { z } from 'zod';
import { Result, BaseUseCase } from '@bene/shared';
import {
  UserProfileCommands,
  UserPreferencesSchema,
  UserPreferencesView,
  toUserPreferencesView,
} from '@bene/training-core';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';

export const UpdatePreferencesRequestSchema = z.object({
  userId: z.uuid(),
  // Partial update support
  preferences: UserPreferencesSchema.partial(), // Workaround for deepPartial lint issue for now
});

export type UpdatePreferencesRequest = z.infer<typeof UpdatePreferencesRequestSchema>;

export type UpdatePreferencesResponse = {
  userId: string;
  preferences: UserPreferencesView;
};

export class UpdatePreferencesUseCase extends BaseUseCase<
  UpdatePreferencesRequest,
  UpdatePreferencesResponse
> {
  constructor(private profileRepository: UserProfileRepository) {
    super();
  }

  protected async performExecution(
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
      request.preferences ?? {},
    );

    // 3. Save
    const saveResult = await this.profileRepository.save(updatedProfile);
    if (saveResult.isFailure) {
      return Result.fail(saveResult.error);
    }

    return Result.ok({
      userId: request.userId,
      preferences: toUserPreferencesView(updatedProfile.preferences),
    });
  }
}
