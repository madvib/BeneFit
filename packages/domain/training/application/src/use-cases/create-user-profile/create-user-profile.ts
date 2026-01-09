import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import {
  createUserProfile

} from '@bene/training-core';
import {
  ExperienceProfileSchema,
  FitnessGoalsSchema,
  TrainingConstraintsSchema,
} from '@bene/shared';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';
import { ProfileCreatedEvent } from '../../events/profile-created.event.js';
import {
  toDomainExperienceProfile,
  toDomainFitnessGoals,
  toDomainTrainingConstraints,
} from '../../mappers/index.js';


// Single request schema with ALL fields (client data + server context)
export const CreateUserProfileRequestSchema = z.object({
  // Server context (injected by gateway)
  userId: z.string(),

  // Client data
  displayName: z.string(),
  timezone: z.string(),
  experienceProfile: ExperienceProfileSchema,
  fitnessGoals: FitnessGoalsSchema,
  trainingConstraints: TrainingConstraintsSchema,
  avatar: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
});

export type CreateUserProfileRequest = z.infer<typeof CreateUserProfileRequestSchema>;

export const CreateUserProfileResponseSchema = z.object({
  userId: z.string(),
  displayName: z.string(),
  profileComplete: z.boolean(),
});

export type CreateUserProfileResponse = z.infer<typeof CreateUserProfileResponseSchema>;

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
    const profileResult = createUserProfile({
      userId: request.userId,
      displayName: request.displayName,
      timezone: request.timezone,
      experienceProfile: toDomainExperienceProfile(request.experienceProfile),
      fitnessGoals: toDomainFitnessGoals(request.fitnessGoals),
      trainingConstraints: toDomainTrainingConstraints(request.trainingConstraints),
      avatar: request.avatar,
      bio: request.bio,
      location: request.location,
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

    return Result.ok({
      userId: profile.userId,
      displayName: profile.displayName,
      profileComplete: true,
    });
  }
}
