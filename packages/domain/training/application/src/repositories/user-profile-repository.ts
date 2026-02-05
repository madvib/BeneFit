import { Result } from '@bene/shared';
import { UserProfile } from '@bene/training-core';

export interface UserProfileRepository {
  findById(id: string): Promise<Result<UserProfile>>;
  save(profile: UserProfile): Promise<Result<void>>;
}
