import { z } from 'zod';
import { Result, BaseUseCase, CompletedWorkoutSummarySchema } from '@bene/shared';
import type { CompletedWorkoutRepository } from '../../repositories/completed-workout-repository.js';



// Single request schema with ALL fields
export const GetWorkoutHistoryRequestSchema = z.object({
  // Server context
  userId: z.string(),

  // Client data
  limit: z.number().optional(),
  offset: z.number().optional(),
});

// Zod inferred type with original name
export type GetWorkoutHistoryRequest = z.infer<typeof GetWorkoutHistoryRequestSchema>;



export const GetWorkoutHistoryResponseSchema = z.object({
  workouts: z.array(CompletedWorkoutSummarySchema),
  total: z.number(),
});

// Zod inferred type with original name
export type GetWorkoutHistoryResponse = z.infer<typeof GetWorkoutHistoryResponseSchema>;


export class GetWorkoutHistoryUseCase extends BaseUseCase<
  GetWorkoutHistoryRequest,
  GetWorkoutHistoryResponse
> {
  constructor(private completedWorkoutRepository: CompletedWorkoutRepository) {
    super();
  }

  protected async performExecution(
    request: GetWorkoutHistoryRequest,
  ): Promise<Result<GetWorkoutHistoryResponse>> {
    const workoutsResult = await this.completedWorkoutRepository.findByUserId(
      request.userId,
      request.limit || 20,
      request.offset || 0,
    );

    if (workoutsResult.isFailure) {
      return Result.fail(workoutsResult.error);
    }

    const workouts = workoutsResult.value;

    return Result.ok({
      workouts: workouts.map((w) => ({
        id: w.id,
        type: w.workoutType,
        date: w.recordedAt,
        durationMinutes: w.performance.durationMinutes,
        perceivedExertion: w.performance.perceivedExertion,
        enjoyment: w.performance.enjoyment,
        verified: w.verification?.verified || false,
        reactionCount: w.reactions.length,
      })),
      total: workouts.length,
    });
  }
}
