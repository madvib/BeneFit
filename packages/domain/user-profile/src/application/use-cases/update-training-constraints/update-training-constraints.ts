import { Result, UseCase } from '@bene/domain-shared';
import { UserProfileCommands } from '@core/index.js';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';
import { EventBus } from '@bene/domain-shared';

export interface UpdateTrainingConstraintsRequest {
  userId: string;
  constraints: Record<string, unknown>; // Using Record since the exact type depends on core implementation
}

export interface UpdateTrainingConstraintsResponse {
  userId: string;
  constraints: Record<string, unknown>; // Using Record since the exact type depends on core implementation
  shouldAdjustPlan: boolean;
}

export class UpdateTrainingConstraintsUseCase
  implements
    UseCase<UpdateTrainingConstraintsRequest, UpdateTrainingConstraintsResponse>
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
      request.constraints,
    );
    if (updatedProfileResult.isFailure) {
      return Result.fail(new Error(updatedProfileResult.error as unknown as string));
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
