import { Result } from '@bene/core/shared';
import { UseCase } from '../../shared/use-case';
import { 
  UserProfile, 
  UserProfileCommands 
} from '@bene/core/profile';
import { UserProfileRepository } from '../../profile/repositories/user-profile-repository';
import { EventBus } from '../../shared/event-bus';

export interface UpdateTrainingConstraintsRequest {
  userId: string;
  constraints: any; // Using any since the exact type depends on core implementation
}

export interface UpdateTrainingConstraintsResponse {
  userId: string;
  constraints: any; // Using any since the exact type depends on core implementation
  shouldAdjustPlan: boolean;
}

export class UpdateTrainingConstraintsUseCase
  implements UseCase<UpdateTrainingConstraintsRequest, UpdateTrainingConstraintsResponse>
{
  constructor(
    private profileRepository: UserProfileRepository,
    private eventBus: EventBus,
  ) {}

  async execute(
    request: UpdateTrainingConstraintsRequest,
  ): Promise<Result<UpdateTrainingConstraintsResponse>> {
    // 1. Load profile
    const profileResult = await this.profileRepository.findById(request.userId);
    if (profileResult.isFailure) {
      return Result.fail('Profile not found');
    }
    const profile = profileResult.value;

    // 2. Check for significant changes
    const availableDaysChanged = JSON.stringify(profile.trainingConstraints.availableDays) !==
      JSON.stringify(request.constraints.availableDays);

    const injuriesChanged = JSON.stringify(profile.trainingConstraints.injuries) !==
      JSON.stringify(request.constraints.injuries);

    // 3. Update constraints using command
    const updatedProfileResult = UserProfileCommands.updateTrainingConstraints(
      profile,
      request.constraints,
    );
    if (updatedProfileResult.isFailure) {
      return Result.fail(updatedProfileResult.error as string);
    }

    // 4. Save
    await this.profileRepository.save(updatedProfileResult.value);

    // 5. Emit event
    await this.eventBus.publish({
      type: 'TrainingConstraintsUpdated',
      userId: request.userId,
      constraints: request.constraints,
      injuriesChanged,
      availableDaysChanged,
      timestamp: new Date(),
    });

    return Result.ok({
      userId: request.userId,
      constraints: request.constraints,
      shouldAdjustPlan: availableDaysChanged || injuriesChanged,
    });
  }
}