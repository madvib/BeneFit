import { z } from 'zod';
import { Result, type UseCase, type EventBus } from '@bene/shared-domain';
import { TrainingConstraints, UserProfileCommands } from '@bene/training-core';
import { UserProfileRepository } from '@/repositories/index.js';
import { TrainingConstraintsSchema } from '@/schemas/index.js';
import { TrainingConstraintsUpdatedEvent } from '@/events/index.js';
import { toDomainTrainingConstraints } from '@/mappers/type-mappers.js';

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use UpdateTrainingConstraintsRequest type instead */
export interface UpdateTrainingConstraintsRequest_Deprecated {
  userId: string;
  constraints: TrainingConstraints;
}
// Deprecated original interface - preserve for potential rollback
/** @deprecated Use UpdateTrainingConstraintsResponse type instead */
export interface UpdateTrainingConstraintsResponse_Deprecated {
  userId: string;
  constraints: TrainingConstraints;
  shouldAdjustPlan: boolean;
}

export const UpdateTrainingConstraintsRequestClientSchema = z.object({
  constraints: TrainingConstraintsSchema, // Using proper schema instead of z.unknown()
});
// Zod schema for request validation
export const UpdateTrainingConstraintsRequestSchema =
  UpdateTrainingConstraintsRequestClientSchema.extend({
    userId: z.string(),
  });

// Zod inferred type with original name
export type UpdateTrainingConstraintsRequest = z.infer<
  typeof UpdateTrainingConstraintsRequestSchema
>;

// Zod schema for response validation
export const UpdateTrainingConstraintsResponseSchema = z.object({
  userId: z.string(),
  constraints: TrainingConstraintsSchema, // Using proper schema instead of z.unknown()
  shouldAdjustPlan: z.boolean(),
});

// Zod inferred type with original name
export type UpdateTrainingConstraintsResponse = z.infer<
  typeof UpdateTrainingConstraintsResponseSchema
>;

export class UpdateTrainingConstraintsUseCase implements UseCase<
  UpdateTrainingConstraintsRequest,
  UpdateTrainingConstraintsResponse
> {
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
      toDomainTrainingConstraints(request.constraints),
    );
    if (updatedProfileResult.isFailure) {
      return Result.fail(new Error(updatedProfileResult.error as unknown as string));
    }

    // 4. Save
    await this.profileRepository.save(updatedProfileResult.value);

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
      constraints: request.constraints,
      shouldAdjustPlan: availableDaysChanged || injuriesChanged,
    });
  }
}
