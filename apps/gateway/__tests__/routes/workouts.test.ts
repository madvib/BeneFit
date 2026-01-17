import { describe, it, expect } from 'vitest';
import {
  getUpcomingWorkoutsRequest,
  getWorkoutHistoryRequest,
  skipWorkoutRequest,
  startWorkoutRequest,
  completeWorkoutRequest,
  joinMultiplayerWorkoutRequest,
  addWorkoutReactionRequest,
} from '../../__fixtures__/routes/workouts.fixtures';
import {
  GetUpcomingWorkoutsClientSchema,
  GetWorkoutHistoryClientSchema,
  SkipWorkoutClientSchema,
  StartWorkoutClientSchema,
  CompleteWorkoutClientSchema,
  JoinMultiplayerWorkoutClientSchema,
  AddWorkoutReactionClientSchema,
} from '../../src/routes/workouts.js';

describe('Workout Route Fixtures', () => {
  describe('Schema Validation', () => {
    it('getUpcomingWorkoutsRequest should match client schema', () => {
      expect(() => GetUpcomingWorkoutsClientSchema.parse(getUpcomingWorkoutsRequest)).not.toThrow();
    });

    it('getWorkoutHistoryRequest should match client schema', () => {
      expect(() => GetWorkoutHistoryClientSchema.parse(getWorkoutHistoryRequest)).not.toThrow();
    });

    it('skipWorkoutRequest should match client schema', () => {
      expect(() => SkipWorkoutClientSchema.parse(skipWorkoutRequest)).not.toThrow();
    });

    it('startWorkoutRequest should match client schema', () => {
      expect(() => StartWorkoutClientSchema.parse(startWorkoutRequest)).not.toThrow();
    });

    it('completeWorkoutRequest should match client schema', () => {
      expect(() => CompleteWorkoutClientSchema.parse(completeWorkoutRequest)).not.toThrow();
    });

    it('joinMultiplayerWorkoutRequest should match client schema', () => {
      expect(() => JoinMultiplayerWorkoutClientSchema.parse(joinMultiplayerWorkoutRequest)).not.toThrow();
    });

    it('addWorkoutReactionRequest should match client schema', () => {
      expect(() => AddWorkoutReactionClientSchema.parse(addWorkoutReactionRequest)).not.toThrow();
    });
  });

  describe('Data Quality', () => {
    it('skipWorkoutRequest should have non-empty reason', () => {
      expect(skipWorkoutRequest.reason).toBeTruthy();
      expect(skipWorkoutRequest.reason.length).toBeGreaterThan(0);
    });

    it('addWorkoutReactionRequest should have valid reactionType', () => {
      expect(addWorkoutReactionRequest.reactionType).toBeTruthy();
      expect(['fire', 'strong', 'clap', 'heart', 'smile']).toContain(addWorkoutReactionRequest.reactionType);
    });
  });
});
