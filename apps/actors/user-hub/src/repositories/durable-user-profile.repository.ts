import { type DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';

import { eq } from 'drizzle-orm';
import {
  Result,
  EntityNotFoundError,
  QueryError,
  SaveError,
  DeleteError,
} from '@bene/shared';
import type { UserProfile } from '@bene/training-core';
import type { UserProfileRepository } from '@bene/training-application';

import {
  toDomain,
  toProfileDatabase,
  toStatsDatabase,
  achievementToDomain,
  achievementToDatabase,
} from '../mappers/user-profile.mapper.js';
import {
  user_profile_schema,
  profile as profileTable,
  userStats,
  achievements as achievementsTable,
} from '../data/schema/index.js';

export class DurableUserProfileRepository implements UserProfileRepository {
  constructor(private db: DrizzleSqliteDODatabase<typeof user_profile_schema>) { }

  async findById(userId: string): Promise<Result<UserProfile>> {
    try {
      const result = await this.db.query.profile.findFirst({
        where: eq(profileTable.userId, userId),
        with: {
          stats: true,
          achievements: true,
        },
      });

      if (!result) {
        return Result.fail(new EntityNotFoundError('UserProfile', userId));
      }

      const profile = toDomain(result);

      // Map achievements from database to domain
      if (result.achievements && result.achievements.length > 0) {
        profile.stats.achievements = result.achievements.map(achievementToDomain);
      }

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

      // Save profile and stats
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

      // Save achievements (if any)
      if (profile.stats.achievements && profile.stats.achievements.length > 0) {
        const achievementRows = profile.stats.achievements.map((achievement) =>
          achievementToDatabase(profile.userId, achievement)
        );

        // Insert achievements (ignore conflicts since achievements are immutable once earned)
        await Promise.all(
          achievementRows.map((row) =>
            this.db.insert(achievementsTable).values(row).onConflictDoNothing()
          )
        );
      }

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
