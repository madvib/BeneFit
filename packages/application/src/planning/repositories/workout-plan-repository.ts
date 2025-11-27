import { Result } from '@bene/core/shared';
import { WorkoutPlan } from '@bene/core/plans';

export interface WorkoutPlanRepository {
  findById(id: string): Promise<Result<WorkoutPlan>>;
  findActiveByUserId(userId: string): Promise<Result<WorkoutPlan>>;
  save(plan: WorkoutPlan): Promise<Result<void>>;
}
