import { z } from 'zod';
import { Result, type UseCase } from '@bene/shared';
import type { CompletedWorkoutRepository } from '../../repositories/completed-workout-repository.js';

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use GetWorkoutHistoryRequest type instead */
export interface GetWorkoutHistoryRequest_Deprecated {
  userId: string;
  limit?: number;
  offset?: number;
}

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

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use GetWorkoutHistoryResponse type instead */
export interface GetWorkoutHistoryResponse_Deprecated {
  workouts: Array<{
    id: string;
    type: string;
    date: Date;
    durationMinutes: number;
    perceivedExertion: number;
    enjoyment: number;
    verified: boolean;
    reactionCount: number;
  }>;
  total: number;
}

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

export class GetWorkoutHistoryUseCase implements UseCase<
  GetWorkoutHistoryRequest,
  GetWorkoutHistoryResponse
> {
  constructor(private completedWorkoutRepository: CompletedWorkoutRepository) {}

  async execute(
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
        verified: w.verification.verified,
        reactionCount: w.reactions.length,
      })),
      total: workouts.length,
    });
  }
}
