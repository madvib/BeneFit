import { Result, UseCase } from '@bene/shared-domain';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';
import { EventBus } from '@bene/shared-domain';
import { FitnessGoals, UserProfileCommands } from '@bene/training-core';

export interface UpdateFitnessGoalsRequest {
  userId: string;
  goals: FitnessGoals;
}

export interface UpdateFitnessGoalsResponse {
  userId: string;
  goals: FitnessGoals;
  suggestNewPlan: boolean; // Should we suggest regenerating their plan?
}

export class UpdateFitnessGoalsUseCase
  implements UseCase<UpdateFitnessGoalsRequest, UpdateFitnessGoalsResponse>
{
  constructor(
    private profileRepository: UserProfileRepository,
    private eventBus: EventBus,
  ) {}

  async execute(
    request: UpdateFitnessGoalsRequest,
  ): Promise<Result<UpdateFitnessGoalsResponse>> {
    // 1. Load profile
    const profileResult = await this.profileRepository.findById(request.userId);
    if (profileResult.isFailure) {
      return Result.fail(new Error('Profile not found'));
    }
    const profile = profileResult.value;

    // 2. Check if goals changed significantly
    const primaryGoalChanged = profile.fitnessGoals.primary !== request.goals.primary;

    // 3. Update goals using command
    const updatedProfileResult = UserProfileCommands.updateFitnessGoals(
      profile,
      request.goals,
    );
    if (updatedProfileResult.isFailure) {
      return Result.fail(updatedProfileResult.error);
    }
    const updatedProfile = updatedProfileResult.value;

    // 4. Save
    await this.profileRepository.save(updatedProfile);

    // 5. Emit event
    await this.eventBus.publish({
      type: 'FitnessGoalsUpdated',
      userId: request.userId,
      oldGoals: profile.fitnessGoals,
      newGoals: request.goals,
      significantChange: primaryGoalChanged,
      timestamp: new Date(),
    });

    return Result.ok({
      userId: request.userId,
      goals: request.goals,
      suggestNewPlan: primaryGoalChanged,
    });
  }
}
