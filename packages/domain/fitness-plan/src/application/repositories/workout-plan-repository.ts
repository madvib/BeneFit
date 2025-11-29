import { Result } from '@bene/domain-shared';
import { WorkoutPlan } from '@core/index.js';

export interface WorkoutPlanRepository {
  findById(id: string): Promise<Result<WorkoutPlan>>;
  findByUserId(userId: string): Promise<Result<WorkoutPlan[]>>;
  findActiveByUserId(userId: string): Promise<Result<WorkoutPlan>>;
  save(plan: WorkoutPlan): Promise<Result<void>>;
  delete(id: string): Promise<Result<void>>;
}
