import { Result } from '@bene/core/shared';
import { UserProfile } from '@bene/core/profile';

export interface UserProfileRepository {
  findById(id: string): Promise<Result<UserProfile>>;
  save(profile: UserProfile): Promise<Result<void>>;
}
