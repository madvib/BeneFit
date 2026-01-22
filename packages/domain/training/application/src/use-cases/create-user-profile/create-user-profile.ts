import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import {
  CreateUserProfileSchema,
  ExperienceProfileSchema,
  FitnessGoalsSchema,
  UserProfileView,
  toUserProfileView,
  TrainingConstraintsSchema,
} from '@bene/training-core';

import { UserProfileRepository } from '../../repositories/user-profile-repository.js';
import { ProfileCreatedEvent } from '../../events/profile-created.event.js';

// Request schema for create-profile (mostly client provided)
export const CreateUserProfileRequestSchema = z.object({
  // Server context (injected by gateway)
  userId: z.uuid(),

  // Client data
  displayName: z.string().min(1).max(100),
  timezone: z.string().min(1).max(50),
  // We use the Props schemas minus the fields we generate (like dates)
  // For simplicity, we can omit specific generating fields or just use the full schema if client provides them
  experienceProfile: ExperienceProfileSchema.omit({ lastAssessmentDate: true }),
  fitnessGoals: FitnessGoalsSchema,
  trainingConstraints: TrainingConstraintsSchema,
  avatar: z.url().optional(),
  bio: z.string().max(500).optional(),
  location: z.string().max(100).optional(),
});

export type CreateUserProfileRequest = z.infer<typeof CreateUserProfileRequestSchema>;

// Response is the created profile view
export type CreateUserProfileResponse = UserProfileView;

export class CreateUserProfileUseCase extends BaseUseCase<
  CreateUserProfileRequest,
  CreateUserProfileResponse
> {
  constructor(
    private profileRepository: UserProfileRepository,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(
    request: CreateUserProfileRequest,
  ): Promise<Result<CreateUserProfileResponse>> {
    // 1. Check if profile already exists
    const existingResult = await this.profileRepository.findById(request.userId);
    if (existingResult.isSuccess) {
      return Result.fail(new Error('Profile already exists for this user'));
    }

    // 2. Create profile using factory
    // Note: The factory now handles generating dates/stats/preferences if not provided

    // We use safeParse to get the transformation and validation
    const parseResult = CreateUserProfileSchema.safeParse({
      ...request,
    });

    if (!parseResult.success) {
      // Map Zod error to Result failure
      // We need to import mapZodError or just return the error
      // The shared library usually has mapZodError, but let's check imports.
      // Actually Result.fail accepts an Error or string. validation error might be complex.
      // Let's assume standard error handling or just throw if we trust the input (which was already validated by RequestSchema?)
      // But CreateUserProfileSchema adds defaults.
      return Result.fail(new Error(`Factory validation failed: ${ parseResult.error.message }`));
    }

    const profile = parseResult.data;

    // 3. Save to repository
    const saveResult = await this.profileRepository.save(profile);
    if (saveResult.isFailure) {
      return Result.fail(saveResult.error);
    }

    // 4. Emit event
    await this.eventBus.publish(
      new ProfileCreatedEvent({
        userId: request.userId,
      }),
    );

    // 5. Return view
    return Result.ok(toUserProfileView(profile));
  }
}
