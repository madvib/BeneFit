import { Result } from '@bene/domain-shared';
import { UserProfile } from '../../core/index.js';

export interface UserProfileRepository {
  findById(id: string): Promise<Result<UserProfile>>;
  save(profile: UserProfile): Promise<Result<void>>;
}
