import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import {
  createUserProfile,
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
    const profileResult = createUserProfile({
      ...request,
    });

    if (profileResult.isFailure) {
      return Result.fail(profileResult.error);
    }

    const profile = profileResult.value;

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
