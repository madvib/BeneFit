import { describe, it, expect } from 'vitest';
import { createUserStats, UserStats, Achievement } from './user-stats.js';

describe('UserStats Value Object', () => {
  describe('Factory', () => {
    it('should create default user stats', () => {
      const now = new Date();
      const stats = createUserStats(now);

      expect(stats.totalWorkouts).toBe(0);
      expect(stats.totalMinutes).toBe(0);
      expect(stats.totalVolume).toBe(0);
      expect(stats.currentStreak).toBe(0);
      expect(stats.longestStreak).toBe(0);
      expect(stats.achievements).toEqual([]);
      expect(stats.firstWorkoutDate).toEqual(now);
      expect(stats.joinedAt).toEqual(now);
      expect(stats.lastWorkoutDate).toBeUndefined();
    });
  });

  describe('Stats update functions', () => {
    let baseStats: UserStats;
    const joinDate = new Date('2024-01-01');

    beforeEach(() => {
      baseStats = createUserStats(joinDate);
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
        id: 'ach-1',
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

    it('should append to achievements list', () => {
      const achievement1: Achievement = {
        id: 'ach-1',
        type: 'first_workout',
        name: 'First Workout',
        description: 'Completed first workout',
        earnedAt: new Date(),
      };

      const achievement2: Achievement = {
        id: 'ach-2',
        type: 'ten_workouts',
        name: 'Ten Workouts',
        description: 'Completed ten workouts',
        earnedAt: new Date(),
      };

      const updatedStats = {
        ...baseStats,
        achievements: [achievement1, achievement2],
      };

      expect(updatedStats.achievements).toEqual([achievement1, achievement2]);
      expect(updatedStats.achievements.length).toBe(2);
    });
  });
});