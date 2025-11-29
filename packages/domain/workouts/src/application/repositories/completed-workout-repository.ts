import { Result } from '@bene/domain-shared';
import { CompletedWorkout } from '@core/index.js';

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
