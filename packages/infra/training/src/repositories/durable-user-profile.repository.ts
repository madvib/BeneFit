import { eq } from 'drizzle-orm';
import { Result } from '@bene/shared-domain';
import type { UserProfile } from '@bene/training-core';
import type { UserProfileRepository } from '@bene/training-application';
import type { DOClient } from '@bene/persistence';
import {
  profile as profileTable,
  userStats,
  userProfileSchema,
} from '@bene/persistence';
import {
  toDomain,
  toProfileDatabase,
  toStatsDatabase,
} from '../mappers/user-profile.mapper.js';
import {
  EntityNotFoundError,
  QueryError,
  SaveError,
  DeleteError,
} from '@bene/shared-infra';

export class DurableUserProfileRepository implements UserProfileRepository {
  constructor(private db: DOClient<typeof userProfileSchema>) {}

  async findById(userId: string): Promise<Result<UserProfile>> {
    try {
      const result = await this.db.query.profile.findFirst({
        where: eq(profileTable.userId, userId),
        with: {
          stats: true,
        },
      });

      if (!result) {
        return Result.fail(new EntityNotFoundError('UserProfile', userId));
      }

      const profile = toDomain(result);
      return Result.ok(profile);
    } catch (error) {
      return Result.fail(
        new QueryError(
          'find',
          'UserProfile',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async save(profile: UserProfile): Promise<Result<void>> {
    try {
      const profileRow = toProfileDatabase(profile);
      const statsRow = toStatsDatabase(profile);

      await Promise.all([
        this.db.insert(profileTable).values(profileRow).onConflictDoUpdate({
          target: profileTable.userId,
          set: profileRow,
        }),
        this.db.insert(userStats).values(statsRow).onConflictDoUpdate({
          target: userStats.userId,
          set: statsRow,
        }),
      ]);

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new SaveError(
          'UserProfile',
          profile.userId,
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async delete(userId: string): Promise<Result<void>> {
    try {
      await this.db.delete(profileTable).where(eq(profileTable.userId, userId));

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new DeleteError(
          'UserProfile',
          userId,
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }
}
