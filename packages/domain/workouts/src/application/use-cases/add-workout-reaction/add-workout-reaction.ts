import { Result, UseCase } from '@bene/domain-shared';
import { CompletedWorkoutCommands } from '@core/index.js';
import type { CompletedWorkoutRepository } from '../../repositories/completed-workout-repository.js';
import type { EventBus } from '@bene/domain-shared';

export interface AddWorkoutReactionRequest {
  userId: string;
  userName: string;
  workoutId: string;
  reactionType: 'fire' | 'strong' | 'clap' | 'heart' | 'smile';
}

export interface AddWorkoutReactionResponse {
  workoutId: string;
  totalReactions: number;
}

export class AddWorkoutReactionUseCase
  implements UseCase<AddWorkoutReactionRequest, AddWorkoutReactionResponse>
{
  constructor(
    private completedWorkoutRepository: CompletedWorkoutRepository,
    private eventBus: EventBus,
  ) {}

  async execute(
    request: AddWorkoutReactionRequest,
  ): Promise<Result<AddWorkoutReactionResponse>> {
    // 1. Load workout
    const workoutResult = await this.completedWorkoutRepository.findById(
      request.workoutId,
    );
    if (workoutResult.isFailure) {
      return Result.fail(new Error('Workout not found'));
    }
    const workout = workoutResult.value;

    // 2. Check if public
    if (!workout.isPublic) {
      return Result.fail(new Error('Cannot react to private workout'));
    }

    // 3. Add reaction
    const reaction = {
      id: crypto.randomUUID(),
      userId: request.userId,
      userName: request.userName,
      type: request.reactionType,
      createdAt: new Date(),
    };

    const updatedWorkoutResult = CompletedWorkoutCommands.addReaction(
      workout,
      reaction,
    );
    if (updatedWorkoutResult.isFailure) {
      return Result.fail(updatedWorkoutResult.error);
    }

    // 4. Save
    await this.completedWorkoutRepository.save(updatedWorkoutResult.value);

    // 5. Emit event (for notifications)
    await this.eventBus.publish({
      type: 'WorkoutReactionAdded',
      workoutId: request.workoutId,
      workoutOwnerId: workout.userId,
      reactorId: request.userId,
      reactorName: request.userName,
      reactionType: request.reactionType,
      timestamp: new Date(),
    });

    return Result.ok({
      workoutId: workout.id,
      totalReactions: updatedWorkoutResult.value.reactions.length,
    });
  }
}
