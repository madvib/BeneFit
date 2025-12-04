import { Entity, Result } from '../../core/index.js';

/**
 * Base repository interface
 */
export interface Repository<T extends Entity<unknown>> {
  findById(id: string): Promise<Result<T>>;
  save(entity: T): Promise<Result<void>>;
  delete(id: string): Promise<Result<void>>;
}
