import { describe, it, expect, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';
import { CreateUserStatsSchema } from '../user-stats.factory.js';
import { createUserStatsFixture, createAchievementFixture } from '@/fixtures.js';
import { UserStats, Achievement } from '../user-stats.types.js';
import * as Commands from '../user-stats.commands.js';
import * as Queries from '../user-stats.queries.js';

describe('UserStats Value Object', () => {
  describe('Factory', () => {
    it('should create default user stats', () => {
      // Arrange
      const now = new Date();
      const input = { joinedAt: now };

      // Act
      const result = CreateUserStatsSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        const stats = result.data;
        expect(stats.totalWorkouts).toBe(0);
        expect(stats.totalMinutes).toBe(0);
        expect(stats.totalVolume).toBe(0);
        expect(stats.currentStreak).toBe(0);
        expect(stats.longestStreak).toBe(0);
        expect(stats.achievements).toEqual([]);
        expect(stats.firstWorkoutDate).toEqual(now);
        expect(stats.joinedAt).toEqual(now);
        expect(stats.lastWorkoutDate).toBeUndefined();
      }
    });

    it('should coerce date strings', () => {
      // Arrange
      const dateStr = faker.date.past().toISOString();
      const input = { joinedAt: dateStr };

      // Act
      const result = CreateUserStatsSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.joinedAt).toBeInstanceOf(Date);
        expect(result.data.joinedAt.toISOString()).toBe(dateStr);
      }
    });
  });

  describe('Fixtures', () => {
    it('should create valid fixture', () => {
      const stats = createUserStatsFixture();
      expect(stats.totalWorkouts).toBeGreaterThanOrEqual(0);
      expect(stats.achievements).toBeInstanceOf(Array);
    });

    it('should allow fixture overrides', () => {
      const totalWorkouts = faker.number.int({ min: 100, max: 1000 });
      const stats = createUserStatsFixture({ totalWorkouts });
      expect(stats.totalWorkouts).toBe(totalWorkouts);
    });
  });

  describe('Stats update functions (Immutable handling)', () => {
    let baseStats: UserStats;
    const joinDate = faker.date.past();

    beforeEach(() => {
      // Use schema to create base state
      baseStats = CreateUserStatsSchema.parse({ joinedAt: joinDate });
    });

    it('should update total workouts count', () => {
      const totalWorkouts = faker.number.int({ min: 1, max: 100 });
      const updatedStats = {
        ...baseStats,
        totalWorkouts,
      };

      expect(updatedStats.totalWorkouts).toBe(totalWorkouts);
    });

    it('should update total minutes', () => {
      const totalMinutes = faker.number.int({ min: 1, max: 10000 });
      const updatedStats = {
        ...baseStats,
        totalMinutes,
      };

      expect(updatedStats.totalMinutes).toBe(totalMinutes);
    });

    it('should update total volume', () => {
      const totalVolume = faker.number.int({ min: 1, max: 100000 });
      const updatedStats = {
        ...baseStats,
        totalVolume,
      };

      expect(updatedStats.totalVolume).toBe(totalVolume);
    });

    it('should update streak values', () => {
      const currentStreak = faker.number.int({ min: 1, max: 30 });
      const longestStreak = faker.number.int({ min: currentStreak, max: 100 });
      const updatedStats = {
        ...baseStats,
        currentStreak,
        longestStreak,
      };

      expect(updatedStats.currentStreak).toBe(currentStreak);
      expect(updatedStats.longestStreak).toBe(longestStreak);
    });

    it('should update last workout date', () => {
      const workoutDate = faker.date.recent();
      const updatedStats = {
        ...baseStats,
        lastWorkoutDate: workoutDate,
      };

      expect(updatedStats.lastWorkoutDate).toEqual(workoutDate);
    });

    it('should add achievements', () => {
      const achievement = createAchievementFixture();

      const updatedStats = Commands.addAchievement(baseStats, achievement);

      expect(updatedStats.achievements).toEqual([achievement]);
    });

    it('should not add duplicate achievements', () => {
      const achievement = createAchievementFixture();
      const stats = Commands.addAchievement(baseStats, achievement);
      const stats2 = Commands.addAchievement(stats, achievement);
      expect(stats2.achievements).toHaveLength(1);
    });

    it('should remove achievements', () => {
      const achievement = createAchievementFixture();
      const stats = Commands.addAchievement(baseStats, achievement);
      const updated = Commands.removeAchievement(stats, achievement.id);
      expect(updated.achievements).toHaveLength(0);
    });

    it('should update workouts via command', () => {
      const minutes = faker.number.int({ min: 10, max: 60 });
      const volume = faker.number.int({ min: 100, max: 1000 });
      const updated = Commands.addWorkout(baseStats, minutes, volume);
      expect(updated.totalWorkouts).toBe(1);
      expect(updated.totalMinutes).toBe(minutes);
      expect(updated.totalVolume).toBe(volume);
    });

    it('should add streak via command', () => {
      const streak = faker.number.int({ min: 1, max: 10 });
      const updated = Commands.addStreak(baseStats, streak);
      expect(updated.currentStreak).toBe(streak);
      expect(updated.longestStreak).toBe(streak);
    });

    it('should reset streak via command', () => {
      const streak = faker.number.int({ min: 1, max: 10 });
      const stats = Commands.addStreak(baseStats, streak);
      const updated = Commands.resetCurrentStreak(stats);
      expect(updated.currentStreak).toBe(0);
      expect(updated.longestStreak).toBe(streak);
    });

    it('should compare stats via equals', () => {
      const totalWorkouts = faker.number.int({ min: 1, max: 100 });
      const stats1 = createUserStatsFixture({ totalWorkouts });
      const stats2 = { ...stats1 };
      expect(Commands.equals(stats1, stats2)).toBe(true);
      expect(Commands.equals(stats1, { ...stats1, totalWorkouts: totalWorkouts + 1 })).toBe(
        false,
      );
    });
  });

  describe('Queries', () => {
    it('should calculate average duration', () => {
      const stats = createUserStatsFixture({ totalWorkouts: 2, totalMinutes: 60 });
      expect(Queries.getAverageWorkoutDuration(stats)).toBe(30);
    });

    it('should return 0 for average duration if no workouts', () => {
      const stats = createUserStatsFixture({ totalWorkouts: 0 });
      expect(Queries.getAverageWorkoutDuration(stats)).toBe(0);
    });

    it('should calculate average volume', () => {
      const stats = createUserStatsFixture({ totalWorkouts: 2, totalVolume: 1000 });
      expect(Queries.getAverageVolumePerWorkout(stats)).toBe(500);
    });

    it('should check if streak is active', () => {
      const stats = createUserStatsFixture({ lastWorkoutDate: new Date() });
      expect(Queries.isStreakActive(stats)).toBe(true);

      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 3);
      const inactiveStats = createUserStatsFixture({ lastWorkoutDate: oldDate });
      expect(Queries.isStreakActive(inactiveStats)).toBe(false);
    });

    it('should get days since last workout', () => {
      const stats = createUserStatsFixture({ lastWorkoutDate: new Date() });
      expect(Queries.getDaysSinceLastWorkout(stats)).toBe(0);
    });
  });
});
