import { Result } from '@bene/core/shared';
import { WorkoutSession } from '@bene/core/workouts';

export interface WorkoutSessionRepository {
  findById(id: string): Promise<Result<WorkoutSession>>;
  findActiveByUserId(userId: string): Promise<Result<WorkoutSession>>;
  save(session: WorkoutSession): Promise<Result<void>>;
  delete(id: string): Promise<Result<void>>;
}
