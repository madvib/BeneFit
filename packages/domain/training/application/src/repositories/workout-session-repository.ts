import { Result } from '@bene/shared';
import { WorkoutSession } from '@bene/training-core';

export interface WorkoutSessionRepository {
  findById(id: string): Promise<Result<WorkoutSession>>;
  findActiveByUserId(userId: string): Promise<Result<WorkoutSession>>;
  save(session: WorkoutSession): Promise<Result<void>>;
  delete(id: string): Promise<Result<void>>;
}
