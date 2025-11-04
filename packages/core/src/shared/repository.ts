import { Entity, Result } from '@bene/core/shared';

/**
 * Base repository interface
 */
export interface Repository<T extends Entity<unknown>> {
  findById(id: string): Promise<Result<T>>;
  save(entity: T): Promise<Result<void>>;
  delete(id: string): Promise<Result<void>>;
}
