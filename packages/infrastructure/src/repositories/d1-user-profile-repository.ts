import { eq } from 'drizzle-orm';
import { Result } from '@bene/domain';
import type { UserProfile } from '@bene/domain/profile';
import type { UserProfileRepository } from '@bene/application/profile';
import type { DbClient } from '@bene/database';
import { userProfiles } from '@bene/database/schema';

export class D1UserProfileRepository implements UserProfileRepository {
  constructor(private db: DbClient) {}

  async findById(userId: string): Promise<Result<UserProfile>> {
    try {
      const rows = await this.db
        .select()
        .from(userProfiles)
        .where(eq(userProfiles.userId, userId))
        .limit(1);

      if (rows.length === 0) {
        return Result.fail(`Profile not found for user ${userId}`);
      }

      const profile = this.toDomain(rows[0]);
      return Result.ok(profile);
    } catch (error) {
      return Result.fail(`Failed to find profile: ${error}`);
    }
  }

  async save(profile: UserProfile): Promise<Result<void>> {
    try {
      const row = this.toDatabase(profile);

      // Upsert
      await this.db.insert(userProfiles).values(row).onConflictDoUpdate({
        target: userProfiles.userId,
        set: row,
      });

      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to save profile: ${error}`);
    }
  }

  async delete(userId: string): Promise<Result<void>> {
    try {
      await this.db.delete(userProfiles).where(eq(userProfiles.userId, userId));

      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to delete profile: ${error}`);
    }
  }

  // MAPPERS - Convert between domain and database models

  private toDomain(row: typeof userProfiles.$inferSelect): UserProfile {
    return {
      userId: row.userId,
      displayName: row.displayName,
      avatar: row.avatar || undefined,
      bio: row.bio || undefined,
      location: row.location || undefined,
      timezone: row.timezone,

      experienceProfile: row.experienceProfile as any, // JSON deserialized by Drizzle
      fitnessGoals: row.fitnessGoals as any,
      trainingConstraints: row.trainingConstraints as any,
      preferences: row.preferences as any,

      stats: {
        totalWorkouts: row.totalWorkouts,
        totalMinutes: row.totalMinutes,
        totalVolume: row.totalVolume,
        currentStreak: row.currentStreak,
        longestStreak: row.longestStreak,
        lastWorkoutDate: row.lastWorkoutDate || undefined,
        achievements: [], // Would load separately
        firstWorkoutDate: row.createdAt, // Approximation
        joinedAt: row.createdAt,
      },

      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      lastActiveAt: row.lastActiveAt,
    };
  }

  private toDatabase(profile: UserProfile): typeof userProfiles.$inferInsert {
    return {
      userId: profile.userId,
      displayName: profile.displayName,
      avatar: profile.avatar,
      bio: profile.bio,
      location: profile.location,
      timezone: profile.timezone,

      experienceProfile: profile.experienceProfile as any, // Drizzle serializes JSON
      fitnessGoals: profile.fitnessGoals as any,
      trainingConstraints: profile.trainingConstraints as any,
      preferences: profile.preferences as any,

      totalWorkouts: profile.stats.totalWorkouts,
      totalMinutes: profile.stats.totalMinutes,
      totalVolume: profile.stats.totalVolume,
      currentStreak: profile.stats.currentStreak,
      longestStreak: profile.stats.longestStreak,
      lastWorkoutDate: profile.stats.lastWorkoutDate,

      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      lastActiveAt: profile.lastActiveAt,
    };
  }
}