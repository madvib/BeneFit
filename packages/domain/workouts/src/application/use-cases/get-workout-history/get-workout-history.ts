import { Result, UseCase } from '@bene/domain-shared';
import type { CompletedWorkoutRepository } from '../../repositories/completed-workout-repository.js';

export interface GetWorkoutHistoryRequest {
  userId: string;
  limit?: number;
  offset?: number;
}

export interface GetWorkoutHistoryResponse {
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

export class GetWorkoutHistoryUseCase
  implements UseCase<GetWorkoutHistoryRequest, GetWorkoutHistoryResponse>
{
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
