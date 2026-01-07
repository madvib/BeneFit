import { z } from 'zod';
import { Result, BaseUseCase } from '@bene/shared';
import { UserProfileCommands } from '@bene/training-core';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';



// Client-facing schema (what comes in the request body)
export const UpdatePreferencesRequestClientSchema = z.object({
  preferences: z.record(z.string(), z.unknown()).optional(), // Using record for partial preferences update with string keys
});

export type UpdatePreferencesRequestClient = z.infer<
  typeof UpdatePreferencesRequestClientSchema
>;

// Complete use case input schema (client data + server context)
export const UpdatePreferencesRequestSchema =
  UpdatePreferencesRequestClientSchema.extend({
    userId: z.string(),
  });

// Zod inferred type with original name
export type UpdatePreferencesRequest = z.infer<typeof UpdatePreferencesRequestSchema>;



// Zod schema for response validation
export const UpdatePreferencesResponseSchema = z.object({
  userId: z.string(),
  preferences: z.record(z.string(), z.unknown()), // Using record for full preferences with string keys
});

// Zod inferred type with original name
export type UpdatePreferencesResponse = z.infer<typeof UpdatePreferencesResponseSchema>;

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

    // 2. Update preferences using command - handle undefined preferences
    const updatedProfile = UserProfileCommands.updatePreferences(
      profileResult.value,
      request.preferences ?? {}, // Provide empty object if undefined
    );

    // 3. Save
    await this.profileRepository.save(updatedProfile);

    return Result.ok({
      userId: request.userId,
      preferences: updatedProfile.preferences,
    });
  }
}
