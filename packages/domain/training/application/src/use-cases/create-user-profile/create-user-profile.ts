import { Result, UseCase, EventBus } from '@bene/shared-domain';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';
import { createUserProfile, ExperienceProfile, FitnessGoals, TrainingConstraints } from '@bene/training-core';

export interface CreateUserProfileRequest {
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

export interface CreateUserProfileResponse {
  userId: string;
  displayName: string;
  profileComplete: boolean;
}

export class CreateUserProfileUseCase
  implements UseCase<CreateUserProfileRequest, CreateUserProfileResponse>
{
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
      experienceProfile: request.experienceProfile,
      fitnessGoals: request.fitnessGoals,
      trainingConstraints: request.trainingConstraints,
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
    await this.eventBus.publish({
      type: 'ProfileCreated',
      userId: request.userId,
      timestamp: new Date(),
    });

    return Result.ok({
      userId: profile.userId,
      displayName: profile.displayName,
      profileComplete: true,
    });
  }
}
