import { Result } from '@bene/core/shared';
import { UseCase } from '../../shared/use-case';
import { 
  UserProfile, 
  createUserProfile,
  UserProfileCommands 
} from '@bene/core/profile';
import { UserProfileRepository } from '../../profile/repositories/user-profile-repository';
import { EventBus } from '../../shared/event-bus';

export interface CreateUserProfileRequest {
  userId: string;
  displayName: string;
  timezone: string;
  experienceProfile: any; // Using any since the exact type depends on core implementation
  fitnessGoals: any; // Using any since the exact type depends on core implementation
  trainingConstraints: any; // Using any since the exact type depends on core implementation
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
      return Result.fail('Profile already exists for this user');
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
      return Result.fail(profileResult.error as string);
    }

    const profile = profileResult.value;

    // 3. Save to repository
    const saveResult = await this.profileRepository.save(profile);
    if (saveResult.isFailure) {
      return Result.fail(saveResult.error as string);
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