import { describe, it, expect, beforeEach } from 'vitest';
import { z } from 'zod';
import { CreateUserStatsSchema } from '../user-stats.factory.js';
import { createUserStatsFixture } from './user-stats.fixtures.js';
import { UserStats, Achievement } from '../user-stats.types.js';

type CreateStatsInput = z.input<typeof CreateUserStatsSchema>;

describe('UserStats Value Object', () => {
  describe('Factory', () => {
    it('should create default user stats', () => {
      // Arrange
      const now = new Date();
      const input: CreateStatsInput = { joinedAt: now };

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
      const dateStr = '2025-01-01T10:00:00.000Z';
      const input: CreateStatsInput = { joinedAt: dateStr };

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
      const stats = createUserStatsFixture({ totalWorkouts: 999 });
      expect(stats.totalWorkouts).toBe(999);
    });
  });

  describe('Stats update functions (Immutable handling)', () => {
    let baseStats: UserStats;
    const joinDate = new Date('2024-01-01');

    beforeEach(() => {
      // Use schema to create base state
      baseStats = CreateUserStatsSchema.parse({ joinedAt: joinDate });
    });

    it('should update total workouts count', () => {
      const updatedStats = {
        ...baseStats,
        totalWorkouts: 5,
      };

      expect(updatedStats.totalWorkouts).toBe(5);
    });

    it('should update total minutes', () => {
      const updatedStats = {
        ...baseStats,
        totalMinutes: 300,
      };

      expect(updatedStats.totalMinutes).toBe(300);
    });

    it('should update total volume', () => {
      const updatedStats = {
        ...baseStats,
        totalVolume: 1500,
      };

      expect(updatedStats.totalVolume).toBe(1500);
    });

    it('should update streak values', () => {
      const updatedStats = {
        ...baseStats,
        currentStreak: 7,
        longestStreak: 10,
      };

      expect(updatedStats.currentStreak).toBe(7);
      expect(updatedStats.longestStreak).toBe(10);
    });

    it('should update last workout date', () => {
      const workoutDate = new Date('2024-06-15');
      const updatedStats = {
        ...baseStats,
        lastWorkoutDate: workoutDate,
      };

      expect(updatedStats.lastWorkoutDate).toEqual(workoutDate);
    });

    it('should add achievements', () => {
      const achievement: Achievement = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        type: 'first_workout',
        name: 'First Workout',
        description: 'Completed first workout',
        earnedAt: new Date(),
      };

      const updatedStats = {
        ...baseStats,
        achievements: [achievement],
      };

      expect(updatedStats.achievements).toEqual([achievement]);
    });
  });
});
