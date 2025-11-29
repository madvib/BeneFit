import { Result } from '@bene/domain-shared';
import { WorkoutSession } from '@core/index.js';

export interface WorkoutSessionRepository {
  findById(id: string): Promise<Result<WorkoutSession>>;
  findActiveByUserId(userId: string): Promise<Result<WorkoutSession>>;
  save(session: WorkoutSession): Promise<Result<void>>;
  delete(id: string): Promise<Result<void>>;
}
