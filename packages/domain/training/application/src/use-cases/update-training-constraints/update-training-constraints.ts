import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import {
  UserProfileCommands,
  TrainingConstraints,
  TrainingConstraintsSchema,
  TrainingConstraintsView,
  toTrainingConstraintsView,
} from '@bene/training-core';
import { UserProfileRepository } from '../../repositories/index.js';
import { TrainingConstraintsUpdatedEvent } from '../../events/index.js';

// Single request schema
export const UpdateTrainingConstraintsRequestSchema = z.object({
  userId: z.uuid(),
  constraints: TrainingConstraintsSchema,
});

export type UpdateTrainingConstraintsRequest = z.infer<typeof UpdateTrainingConstraintsRequestSchema>;

export type UpdateTrainingConstraintsResponse = {
  userId: string;
  constraints: TrainingConstraintsView;
  shouldAdjustPlan: boolean;
};

export class UpdateTrainingConstraintsUseCase extends BaseUseCase<
  UpdateTrainingConstraintsRequest,
  UpdateTrainingConstraintsResponse
> {
  constructor(
    private profileRepository: UserProfileRepository,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(
    request: UpdateTrainingConstraintsRequest,
  ): Promise<Result<UpdateTrainingConstraintsResponse>> {
    // 1. Load profile
    const profileResult = await this.profileRepository.findById(request.userId);
    if (profileResult.isFailure) {
      return Result.fail(new Error('Profile not found'));
    }
    const profile = profileResult.value;

    // 2. Check for significant changes
    const availableDaysChanged =
      JSON.stringify(profile.trainingConstraints.availableDays) !==
      JSON.stringify(request.constraints.availableDays);

    const injuriesChanged =
      JSON.stringify(profile.trainingConstraints.injuries) !==
      JSON.stringify(request.constraints.injuries);

    // 3. Update constraints using command
    const updatedProfileResult = UserProfileCommands.updateTrainingConstraints(
      profile,
      request.constraints as TrainingConstraints,
    );
    if (updatedProfileResult.isFailure) {
      return Result.fail(updatedProfileResult.error);
    }
    const updatedProfile = updatedProfileResult.value;

    // 4. Save
    await this.profileRepository.save(updatedProfile);

    // 5. Emit event
    await this.eventBus.publish(
      new TrainingConstraintsUpdatedEvent({
        userId: request.userId,
        constraints: request.constraints,
        injuriesChanged,
        availableDaysChanged,
      }),
    );

    return Result.ok({
      userId: request.userId,
      constraints: toTrainingConstraintsView(updatedProfile.trainingConstraints),
      shouldAdjustPlan: availableDaysChanged || injuriesChanged,
    });
  }
}
