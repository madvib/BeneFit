import { z } from 'zod';
import { Result, type UseCase, type EventBus } from '@bene/shared-domain';
import {
  createUserProfile,
  ExperienceProfile,
  FitnessGoals,
  TrainingConstraints,
} from '@bene/training-core';
import {
  ExperienceProfileSchema,
  FitnessGoalsSchema,
  TrainingConstraintsSchema,
} from '@/schemas/index.js';
import { UserProfileRepository } from '@/repositories/user-profile-repository.js';
import { ProfileCreatedEvent } from '@/events/profile-created.event.js';
import { toDomainExperienceProfile, toDomainFitnessGoals, toDomainTrainingConstraints } from '@/mappers/type-mappers.js';

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use CreateUserProfileRequest type instead */
export interface CreateUserProfileRequest_Deprecated {
  userId: string;
  displayName: string;
  timezone: string;
  experienceProfile: ExperienceProfile;
  fitnessGoals: FitnessGoals;
  trainingConstraints: TrainingConstraints;
  avatar?: string;
  bio?: string;
  location?: string;
}

// Client-facing schema (what comes in the request body)
export const CreateUserProfileRequestClientSchema = z.object({
  displayName: z.string(),
  timezone: z.string(),
  experienceProfile: ExperienceProfileSchema,
  fitnessGoals: FitnessGoalsSchema,
  trainingConstraints: TrainingConstraintsSchema,
  avatar: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
});

export type CreateUserProfileRequestClient = z.infer<typeof CreateUserProfileRequestClientSchema>;

// Complete use case input schema (client data + server context)
export const CreateUserProfileRequestSchema = CreateUserProfileRequestClientSchema.extend({
  userId: z.string(),
});

// Zod inferred type with original name
export type CreateUserProfileRequest = z.infer<typeof CreateUserProfileRequestSchema>;

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use CreateUserProfileResponse type instead */
export interface CreateUserProfileResponse_Deprecated {
  userId: string;
  displayName: string;
  profileComplete: boolean;
}

// Zod schema for response validation
export const CreateUserProfileResponseSchema = z.object({
  userId: z.string(),
  displayName: z.string(),
  profileComplete: z.boolean(),
});

// Zod inferred type with original name
export type CreateUserProfileResponse = z.infer<typeof CreateUserProfileResponseSchema>;

export class CreateUserProfileUseCase implements UseCase<
  CreateUserProfileRequest,
  CreateUserProfileResponse
> {
  constructor(
    private profileRepository: UserProfileRepository,
    private eventBus: EventBus,
  ) {}

  async execute(
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
