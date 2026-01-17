import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createUserProfileFixture } from '@bene/training-core';
import { setupTestDb } from '../../data/__tests__/test-utils.js';
import {
  toProfileDatabase,
  toStatsDatabase,
  toDomain,
  achievementToDatabase,
  achievementToDomain,
} from '../user-profile.mapper.js';
import { eq } from 'drizzle-orm';
import { profile, userStats, achievements } from '../../data/schema';

/**
 * Tests for UserProfile Mapper
 */
describe('UserProfileMapper', () => {
  let db: Awaited<ReturnType<typeof setupTestDb>>['db'];
  let client: Awaited<ReturnType<typeof setupTestDb>>['client'];

  beforeAll(async () => {
    const setup = await setupTestDb();
    db = setup.db;
    client = setup.client;
  });

  afterAll(() => {
    client?.close();
  });

  describe('toProfileDatabase', () => {
    it('should map domain UserProfile to profile schema', () => {
      const userProfile = createUserProfileFixture({ userId: 'user_test_1' });
      const dbProfile = toProfileDatabase(userProfile);

      expect(dbProfile.userId).toBe('user_test_1');
      expect(dbProfile.displayName).toBe(userProfile.displayName);
      expect(dbProfile.avatarUrl).toBe(userProfile.avatar ?? null);
      expect(dbProfile.bio).toBe(userProfile.bio ?? null);
      expect(dbProfile.location).toBe(userProfile.location ?? null);
      expect(dbProfile.timezone).toBe(userProfile.timezone);

      // Dates extracted to columns
      expect(dbProfile.lastAssessmentDate).toEqual(userProfile.experienceProfile.lastAssessmentDate);
      expect(dbProfile.fitnessGoalsTargetDate).toEqual(userProfile.fitnessGoals.targetDate);

      // JSON fields - dates removed
      const { lastAssessmentDate, ...experienceWithoutDate } = userProfile.experienceProfile;
      const { targetDate: fitnessTargetDate, ...fitnessGoalsWithoutDate } = userProfile.fitnessGoals;

      expect(dbProfile.experienceProfileJson).toEqual(experienceWithoutDate);
      expect(dbProfile.fitnessGoalsJson).toEqual(fitnessGoalsWithoutDate);
      expect(dbProfile.trainingConstraintsJson).toEqual(userProfile.trainingConstraints);
      expect(dbProfile.preferencesJson).toEqual(userProfile.preferences);
    });
  });

  describe('toStatsDatabase', () => {
    it('should map domain UserStats to stats schema', () => {
      const userProfile = createUserProfileFixture({ userId: 'user_stats_test' });
      const dbStats = toStatsDatabase(userProfile);

      expect(dbStats.userId).toBe('user_stats_test');
      expect(dbStats.currentStreakDays).toBe(userProfile.stats.currentStreak);
      expect(dbStats.longestStreakDays).toBe(userProfile.stats.longestStreak);
      expect(dbStats.totalWorkoutsCompleted).toBe(userProfile.stats.totalWorkouts);
      expect(dbStats.totalMinutesTrained).toBe(userProfile.stats.totalMinutes);
      expect(dbStats.totalVolumeKg).toBe(userProfile.stats.totalVolume);
      expect(dbStats.lastWorkoutDate).toBe(userProfile.stats.lastWorkoutDate ?? null);
    });
  });

  describe('achievementToDatabase & achievementToDomain', () => {
    it('should map achievement bidirectionally', () => {
      const userProfile = createUserProfileFixture();
      const achievement = userProfile.stats.achievements[0];

      if (!achievement) {
        throw new Error('Fixture should have at least one achievement');
      }

      const userId = 'user_ach_test';
      const dbAch = achievementToDatabase(userId, achievement);

      expect(dbAch.userId).toBe(userId);
      expect(dbAch.name).toBe(achievement.name);
      expect(dbAch.achievementType).toBe(achievement.type);
      expect(dbAch.earnedAt).toEqual(achievement.earnedAt);

      // Add metadataJson for complete DB row
      const completeDbAch = { ...dbAch, metadataJson: null };

      // Convert back
      const domainAch = achievementToDomain(completeDbAch);
      expect(domainAch.name).toBe(achievement.name);
      expect(domainAch.type).toBe(achievement.type);
    });
  });

  describe('toDomain', () => {
    it('should map database row with relations to domain entity', async () => {
      const userProfile = createUserProfileFixture({ userId: 'db_profile_test' });

      // Insert profile and stats
      await db.insert(profile).values(toProfileDatabase(userProfile));
      await db.insert(userStats).values(toStatsDatabase(userProfile));

      // Insert achievements
      if (userProfile.stats.achievements.length > 0) {
        const achData = userProfile.stats.achievements.map((a) =>
          achievementToDatabase('db_profile_test', a)
        );
        await db.insert(achievements).values(achData);
      }

      // Read back with relations
      const dbRow = await db.query.profile.findFirst({
        where: eq(profile.userId, 'db_profile_test'),
        with: {
          stats: true,
          achievements: true,
        },
      });

      expect(dbRow).toBeDefined();
      expect(dbRow!.stats).toBeDefined();

      // Map achievements
      const achDomain = (dbRow!.achievements || []).map(achievementToDomain);

      // Map to domain - toDomain expects ProfileWithRelations which doesn't include achievements
      // We handle achievements separately then add them to the result
      const domainProfile = toDomain({
        ...dbRow!,
        stats: dbRow!.stats!,
      });

      // Manually set achievements since they're loaded separately
      const profileWithAchievements = {
        ...domainProfile,
        stats: {
          ...domainProfile.stats,
          achievements: achDomain,
        },
      };

      expect(profileWithAchievements.userId).toBe('db_profile_test');
      expect(profileWithAchievements.displayName).toBe(userProfile.displayName);
      expect(profileWithAchievements.stats.totalWorkouts).toBe(userProfile.stats.totalWorkouts);
      expect(profileWithAchievements.stats.achievements.length).toBeGreaterThan(0);
    });

    it('should convert null to undefined for optional fields', async () => {
      const userProfile = createUserProfileFixture({
        userId: 'optional_profile',
        avatar: undefined,
        bio: undefined,
        location: undefined,
      });

      await db.insert(profile).values(toProfileDatabase(userProfile));
      await db.insert(userStats).values(toStatsDatabase(userProfile));

      const dbRow = await db.query.profile.findFirst({
        where: eq(profile.userId, 'optional_profile'),
        with: { stats: true },
      });

      const domainProfile = toDomain({
        ...dbRow!,
        stats: dbRow!.stats!,
      });

      expect(domainProfile.avatar).toBeUndefined();
      expect(domainProfile.bio).toBeUndefined();
      expect(domainProfile.location).toBeUndefined();
    });
  });

  describe('Round-trip integrity', () => {
    it('should maintain data through Domain → DB → Domain', async () => {
      const original = createUserProfileFixture({
        userId: 'roundtrip_profile',
        displayName: 'Test User',
      });

      // Insert
      await db.insert(profile).values(toProfileDatabase(original));
      await db.insert(userStats).values(toStatsDatabase(original));

      if (original.stats.achievements.length > 0) {
        const achData = original.stats.achievements.map((a) =>
          achievementToDatabase('roundtrip_profile', a)
        );
        await db.insert(achievements).values(achData);
      }

      // Read back
      const dbRow = await db.query.profile.findFirst({
        where: eq(profile.userId, 'roundtrip_profile'),
        with: {
          stats: true,
          achievements: true,
        },
      });

      expect(dbRow).toBeDefined();

      // Convert achievements
      const achDomain = (dbRow!.achievements || []).map(achievementToDomain);

      // Reconstruct
      const reconstructed = toDomain({
        ...dbRow!,
        stats: dbRow!.stats!,
      });

      // Add achievements separately
      const completeProfile = {
        ...reconstructed,
        stats: {
          ...reconstructed.stats,
          achievements: achDomain,
        },
      };

      expect(completeProfile.userId).toBe(original.userId);
      expect(completeProfile.displayName).toBe(original.displayName);
      expect(completeProfile.stats.totalWorkouts).toBe(original.stats.totalWorkouts);
      expect(completeProfile.experienceProfile).toEqual(original.experienceProfile);
      expect(completeProfile.fitnessGoals).toEqual(original.fitnessGoals);
    });
  });
});
