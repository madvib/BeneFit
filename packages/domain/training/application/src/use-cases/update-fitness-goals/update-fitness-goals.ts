import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import {
  FitnessGoals,
  FitnessGoalsSchema,
  FitnessGoalsView,
  toFitnessGoalsView,
  UserProfileCommands,
} from '@bene/training-core';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';
import { FitnessGoalsUpdatedEvent } from '../../events/fitness-goals-updated.event.js';

// Single request schema
export const UpdateFitnessGoalsRequestSchema = z.object({
  userId: z.uuid(),
  goals: FitnessGoalsSchema,
});

export type UpdateFitnessGoalsRequest = z.infer<typeof UpdateFitnessGoalsRequestSchema>;

export type UpdateFitnessGoalsResponse = {
  userId: string;
  goals: FitnessGoalsView;
  suggestNewPlan: boolean;
};

export class UpdateFitnessGoalsUseCase extends BaseUseCase<
  UpdateFitnessGoalsRequest,
  UpdateFitnessGoalsResponse
> {
  constructor(
    private profileRepository: UserProfileRepository,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(
    request: UpdateFitnessGoalsRequest,
  ): Promise<Result<UpdateFitnessGoalsResponse>> {
    // Validate request
    const validatedRequest = UpdateFitnessGoalsRequestSchema.parse(request);

    // 1. Load profile
    const profileResult = await this.profileRepository.findById(validatedRequest.userId);
    if (profileResult.isFailure) {
      return Result.fail(new Error('Profile not found'));
    }
    const profile = profileResult.value;

    // 2. Check if goals changed significantly
    const primaryGoalChanged = profile.fitnessGoals.primary !== validatedRequest.goals.primary;

    // 3. Update goals using command
    const updatedProfileResult = UserProfileCommands.updateFitnessGoals(
      profile,
      validatedRequest.goals as FitnessGoals,
    );
    if (updatedProfileResult.isFailure) {
      return Result.fail(updatedProfileResult.error);
    }
    const updatedProfile = updatedProfileResult.value;

    // 4. Save
    await this.profileRepository.save(updatedProfile);

    // 5. Emit event
    await this.eventBus.publish(
      new FitnessGoalsUpdatedEvent({
        userId: validatedRequest.userId,
        oldGoals: profile.fitnessGoals,
        newGoals: updatedProfile.fitnessGoals,
        significantChange: primaryGoalChanged,
      }),
    );

    return Result.ok({
      userId: validatedRequest.userId,
      goals: toFitnessGoalsView(updatedProfile.fitnessGoals),
      suggestNewPlan: primaryGoalChanged,
    });
  }
}
