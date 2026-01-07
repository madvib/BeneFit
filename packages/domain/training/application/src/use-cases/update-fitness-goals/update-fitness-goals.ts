import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import { FitnessGoals, UserProfileCommands } from '@bene/training-core';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';
import { FitnessGoalsSchema } from '../../schemas/index.js';
import { FitnessGoalsUpdatedEvent } from '../../events/fitness-goals-updated.event.js';
import { toDomainFitnessGoals } from '../../mappers/type-mappers.js';

export const UpdateFitnessGoalsRequestClientSchema = z.object({
  goals: FitnessGoalsSchema,
});

export type UpdateFitnessGoalsRequestClient = z.infer<
  typeof UpdateFitnessGoalsRequestClientSchema
>;

export const UpdateFitnessGoalsRequestSchema =
  UpdateFitnessGoalsRequestClientSchema.extend({
    userId: z.string(),
  });

export type UpdateFitnessGoalsRequest = z.infer<typeof UpdateFitnessGoalsRequestSchema>;


export const UpdateFitnessGoalsResponseSchema = z.object({
  userId: z.string(),
  goals: FitnessGoalsSchema, // Using proper schema instead of z.unknown()
  suggestNewPlan: z.boolean(), // Should we suggest regenerating their plan?
});

export type UpdateFitnessGoalsResponse = z.infer<
  typeof UpdateFitnessGoalsResponseSchema
>;

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
      toDomainFitnessGoals(request.goals),
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
        userId: request.userId,
        oldGoals: profile.fitnessGoals,
        newGoals: updatedProfile.fitnessGoals,
        significantChange: primaryGoalChanged,
      }),
    );

    return Result.ok({
      userId: request.userId,
      goals: request.goals,
      suggestNewPlan: primaryGoalChanged,
    });
  }
}
