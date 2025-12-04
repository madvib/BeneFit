import { Result } from '@bene/shared-domain';
import { CompletedWorkout } from '@bene/training-core';

export interface CompletedWorkoutRepository {
  findById(id: string): Promise<Result<CompletedWorkout>>;
  findByUserId(
    userId: string,
    limit?: number,
    offset?: number,
  ): Promise<Result<CompletedWorkout[]>>;
  findByPlanId(planId: string): Promise<Result<CompletedWorkout[]>>;
  save(workout: CompletedWorkout): Promise<Result<void>>;
}
