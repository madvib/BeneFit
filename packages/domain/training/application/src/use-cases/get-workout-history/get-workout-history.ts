import { z } from 'zod';
import { Result, BaseUseCase } from '@bene/shared';
import type { CompletedWorkoutRepository } from '../../repositories/completed-workout-repository.js';



// Client-facing schema (what comes in the request body)
export const GetWorkoutHistoryRequestClientSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export type GetWorkoutHistoryRequestClient = z.infer<
  typeof GetWorkoutHistoryRequestClientSchema
>;

// Complete use case input schema (client data + server context)
export const GetWorkoutHistoryRequestSchema =
  GetWorkoutHistoryRequestClientSchema.extend({
    userId: z.string(),
  });

// Zod inferred type with original name
export type GetWorkoutHistoryRequest = z.infer<typeof GetWorkoutHistoryRequestSchema>;



// Zod schema for response validation
const WorkoutSchema = z.object({
  id: z.string(),
  type: z.string(),
  date: z.date(),
  durationMinutes: z.number(),
  perceivedExertion: z.number(),
  enjoyment: z.number(),
  verified: z.boolean(),
  reactionCount: z.number(),
});

export const GetWorkoutHistoryResponseSchema = z.object({
  workouts: z.array(WorkoutSchema),
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
