import { z } from 'zod';
import { randomUUID } from 'crypto';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import { CompletedWorkoutCommands } from '@bene/training-core';
import type { CompletedWorkoutRepository } from '../../repositories/completed-workout-repository.js';
import { WorkoutReactionAddedEvent } from '../../events/workout-reaction-added.event.js';

// Single request schema with ALL fields
export const AddWorkoutReactionRequestSchema = z.object({
  // Server context
  userId: z.string(),
  userName: z.string(),

  // Client data
  workoutId: z.string(),
  reactionType: z.enum(['fire', 'strong', 'clap', 'heart', 'smile']),
});

export type AddWorkoutReactionRequest = z.infer<typeof AddWorkoutReactionRequestSchema>;

export interface AddWorkoutReactionResponse {
  workoutId: string;
  totalReactions: number;
}

export class AddWorkoutReactionUseCase extends BaseUseCase<
  AddWorkoutReactionRequest,
  AddWorkoutReactionResponse
> {
  constructor(
    private completedWorkoutRepository: CompletedWorkoutRepository,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(
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
      id: randomUUID(),
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
    await this.eventBus.publish(
      new WorkoutReactionAddedEvent({
        workoutId: request.workoutId,
        workoutOwnerId: workout.userId,
        reactorId: request.userId,
        reactorName: request.userName,
        reactionType: request.reactionType,
      }),
    );

    return Result.ok({
      workoutId: workout.id,
      totalReactions: updatedWorkoutResult.value.reactions.length,
    });
  }
}
