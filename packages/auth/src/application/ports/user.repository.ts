import { User } from '@core/index.js';
import { Result } from '@bene/shared-domain';

/**
 * Repository interface for User data operations
 */
export interface IUserRepository {
  findById(id: string): Promise<Result<User>>;
  findByEmail(email: string): Promise<Result<User | null>>;
  save(user: User): Promise<Result<void>>;
  update(user: User): Promise<Result<void>>;
  delete(id: string): Promise<Result<void>>;
}
