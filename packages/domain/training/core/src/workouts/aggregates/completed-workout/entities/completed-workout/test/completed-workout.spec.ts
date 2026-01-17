import { describe, it, expect } from 'vitest';
import { createCompletedWorkout } from '../completed-workout.factory.js';
import { createMinimalCompletedWorkoutFixture } from './completed-workout.fixtures.js';
import { createFireReactionFixture, createStrongReactionFixture } from '../../reaction/test/reaction.fixtures.js';
import {
  addReaction,
  removeReaction,
  makePublic,
  makePrivate,
} from '../completed-workout.commands.js';
import * as Queries from '../completed-workout.queries.js';

describe('CompletedWorkout', () => {
  describe('factory', () => {
    it('should create a valid completed workout', () => {
      // Fixture uses factory internally, so this implicitly tests factory
      const workout = createMinimalCompletedWorkoutFixture();

      expect(workout.id).toBeDefined();
      expect(workout.createdAt).toBeDefined();
      expect(workout.userId).toBeDefined();
      expect(workout.workoutType).toBeDefined();
    });

    it('should fail if required properties are missing', () => {
      // Manually calling factory to test failure case
      const validWorkout = createMinimalCompletedWorkoutFixture();

      const result = createCompletedWorkout({
        ...validWorkout,
        userId: '',
      });

      expect(result.isFailure).toBe(true);
    });
  });

  describe('commands', () => {
    it('should add a reaction', () => {
      const workout = createMinimalCompletedWorkoutFixture();
      const reaction = createFireReactionFixture();

      const result = addReaction(workout, reaction);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.reactions.length).toBe(1);
        expect(result.value.reactions[0]).toEqual(reaction);
      }
    });

    it('should update existing reaction from same user', () => {
      const workout = createMinimalCompletedWorkoutFixture();
      const userId = 'user-test-update';
      const reaction1 = createFireReactionFixture({ userId });
      const reaction2 = createStrongReactionFixture({ userId }); // Same user

      const result1 = addReaction(workout, reaction1);
      if (result1.isFailure) throw new Error('Failed to add reaction 1');
      const workoutWithReaction = result1.value!;

      const result2 = addReaction(workoutWithReaction, reaction2);

      expect(result2.isSuccess).toBe(true);
      if (result2.isSuccess) {
        expect(result2.value!.reactions.length).toBe(1);
        expect(result2.value!.reactions[0]!.type).toBe('strong');
      }
    });

    it('should remove a reaction', () => {
      const workout = createMinimalCompletedWorkoutFixture();
      const reaction = createFireReactionFixture();
      const addResult = addReaction(workout, reaction);
      if (addResult.isFailure) throw new Error('Failed to add reaction');
      const workoutWithReaction = addResult.value!;

      const result = removeReaction(workoutWithReaction, reaction.userId);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.reactions.length).toBe(0);
      }
    });

    it('should make workout public', () => {
      const workout = createMinimalCompletedWorkoutFixture({ isPublic: false });

      const publicWorkout = makePublic(workout);
      expect(publicWorkout.isPublic).toBe(true);
    });

    it('should make workout private', () => {
      const workout = createMinimalCompletedWorkoutFixture({ isPublic: true });

      const privateWorkout = makePrivate(workout);
      expect(privateWorkout.isPublic).toBe(false);
    });
  });

  describe('queries', () => {
    it('should calculate total volume', () => {
      // Need specific performance data for this test, so we might need to override validPerformance in fixture
      // or rely on fixture defaults if they are constant. 
      // Current fixture uses createMinimalPerformanceFixture which might be empty or randomized?
      // Let's create a specific structure for volume test.
      // But we should try to use fixtures mostly.
      const workout = createMinimalCompletedWorkoutFixture({
        // Override performance manually for clear test setup if fixture is random
        performance: {
          ...createMinimalCompletedWorkoutFixture().performance,
          activities: [{
            activityType: 'main',
            completed: true,
            durationMinutes: 30,
            exercises: [{
              name: 'Bench',
              setsCompleted: 1,
              setsPlanned: 1,
              reps: [10],
              weight: [100]
            }]
          }]
        }
      });

      expect(Queries.getTotalVolume(workout)).toBe(1000); // 10 * 100
    });

    // ... other query tests can be similarily adapted or keep using defaults if minimal fixture sufficient
    // For simplicity, adapting one more:

    it('should count reactions', () => {
      const workout = createMinimalCompletedWorkoutFixture();
      const r1 = createFireReactionFixture({ userId: 'u1' });
      const r2 = createStrongReactionFixture({ userId: 'u2' });

      let w = addReaction(workout, r1).value!;
      w = addReaction(w, r2).value!;

      expect(Queries.getReactionCount(w)).toBe(2);
    });
  });
});
