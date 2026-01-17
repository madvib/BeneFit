import { describe, it, expect } from 'vitest';
import { toCompletedWorkoutSchema } from '../completed-workout.presentation.js';
import {
  createMinimalCompletedWorkoutFixture,
  createPlanWorkoutFixture,
  createMultiplayerWorkoutFixture,
  createWorkoutWithReactionsFixture,
} from './completed-workout.fixtures.js';
import * as CompletedWorkoutQueries from '../completed-workout.queries.js';

describe('CompletedWorkout Presentation Mapper', () => {
  describe('toCompletedWorkoutSchema', () => {
    it('should map minimal workout correctly', () => {
      const entity = createMinimalCompletedWorkoutFixture();
      const presentation = toCompletedWorkoutSchema(entity);

      expect(presentation.id).toBe(entity.id);
      expect(presentation.userId).toBe(entity.userId);
      expect(presentation.workoutType).toBe(entity.workoutType);
      expect(presentation.title).toBe(entity.title);
    });

    it('should include plan reference when present', () => {
      const entity = createPlanWorkoutFixture();
      const presentation = toCompletedWorkoutSchema(entity);

      expect(presentation.planReference).toBeDefined();
      expect(presentation.planReference?.planId).toBe(entity.planId);
      expect(presentation.planReference?.weekNumber).toBe(entity.weekNumber);
    });

    it('should exclude plan reference when not present', () => {
      const entity = createMinimalCompletedWorkoutFixture();
      const presentation = toCompletedWorkoutSchema(entity);

      expect(presentation.planReference).toBeUndefined();
    });

    it('should compute performance metrics using queries', () => {
      const entity = createMinimalCompletedWorkoutFixture();
      const presentation = toCompletedWorkoutSchema(entity);

      expect(presentation.performance.totalSets).toBe(CompletedWorkoutQueries.getTotalSets(entity));
      expect(presentation.performance.totalExercises).toBe(CompletedWorkoutQueries.getTotalExercises(entity));
      expect(presentation.performance.completionRate).toBe(CompletedWorkoutQueries.getCompletionRate(entity));
    });

    it('should shield verification details', () => {
      const entity = createMinimalCompletedWorkoutFixture();
      const presentation = toCompletedWorkoutSchema(entity);

      // Only expose boolean, not full verification object
      expect(presentation.isVerified).toBe(false);
      expect(presentation).not.toHaveProperty('verification');
    });

    it('should include reaction count', () => {
      const entity = createWorkoutWithReactionsFixture();
      const presentation = toCompletedWorkoutSchema(entity);

      expect(presentation.reactionCount).toBe(2);
      expect(presentation.reactions).toHaveLength(2);
    });

    it('should include multiplayer session ID when present', () => {
      const entity = createMultiplayerWorkoutFixture();
      const presentation = toCompletedWorkoutSchema(entity);

      expect(presentation.multiplayerSessionId).toBe(entity.multiplayerSessionId);
    });
  });

  describe('Query Composability', () => {
    it('should allow queries to be used independently', () => {
      const entity = createMinimalCompletedWorkoutFixture();

      // Queries can be used outside of mapper
      const totalSets = CompletedWorkoutQueries.getTotalSets(entity);
      const isFromPlan = CompletedWorkoutQueries.isFromPlan(entity);

      expect(totalSets).toBe(3);
      expect(isFromPlan).toBe(false);
    });
  });
});
