import { Result } from '@bene/shared-domain';
import { FitnessPlan } from '@bene/training-core';

export interface FitnessPlanRepository {
  findById(id: string): Promise<Result<FitnessPlan>>;
  findByUserId(userId: string): Promise<Result<FitnessPlan[]>>;
  findActiveByUserId(userId: string): Promise<Result<FitnessPlan>>;
  save(plan: FitnessPlan): Promise<Result<void>>;
  delete(id: string): Promise<Result<void>>;
}
