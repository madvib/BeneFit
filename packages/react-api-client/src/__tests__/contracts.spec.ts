import { describe, it, expect } from 'vitest';
import { fixtures } from '../index';

describe('React API Client Contracts', () => {
  describe('Coach Fixtures', () => {
    it('should generate coach history array with count', () => {
      const history = fixtures.createGetCoachHistoryArray(5);
      expect(history).toHaveLength(5);
      expect(history[0]).toHaveProperty('messages');
    });

    it('should allow overrides in coach history', () => {
      const statsOverride = { totalMessages: 999 };
      const history = fixtures.createGetCoachHistoryResponse({ stats: statsOverride as any });
      expect(history.stats.totalMessages).toBe(999);
    });
  });

  describe('Workouts Fixtures', () => {
    it('should generate upcoming workouts', () => {
      const response = fixtures.createGetUpcomingWorkoutsResponse();
      expect(response).toHaveProperty('workouts');
      expect(Array.isArray(response.workouts)).toBe(true);
    });

    it('should allow overriding boolean flags', () => {
      // Testing the fix for "as const" inference
      const response = fixtures.createGetTodaysWorkoutResponse({
        hasWorkout: true as any
      });
      expect(response.hasWorkout).toBe(true);
    });
  });

  describe('Fitness Plan Fixtures', () => {
    it('should generate plan from goals', () => {
      const response = fixtures.createGeneratePlanFromGoalsResponse();
      expect(response).toHaveProperty('planId');
      expect(response).toHaveProperty('preview');
    });
  });
});
