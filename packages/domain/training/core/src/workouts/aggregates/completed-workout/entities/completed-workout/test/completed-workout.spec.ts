import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { createMinimalPerformanceFixture } from '@/workouts/value-objects/index.js';
import { createFireReactionFixture, createStrongReactionFixture } from '../../reaction/test/reaction.fixtures.js';
import {
  addReaction,
  removeReaction,
  makePublic,
  makePrivate,
} from '../completed-workout.commands.js';
import * as Queries from '../completed-workout.queries.js';
import { CreateCompletedWorkoutSchema } from '../completed-workout.factory.js';
import { createCompletedWorkoutFixture, createCompletedWorkoutInputFixture } from './completed-workout.fixtures.js';

type CreateWorkoutInput = z.input<typeof CreateCompletedWorkoutSchema>;

describe('CompletedWorkout', () => {
  describe('Factory', () => {
    it('should create a valid completed workout', () => {
      // Arrange
      const performance = createMinimalPerformanceFixture();
      const input = {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        workoutType: 'strength' as const,
        performance,
        verification: { verifications: [{ method: 'manual', data: null }] },
        isPublic: true,
      };

      // Act
      const result = CreateCompletedWorkoutSchema.safeParse(input);

      // Assert
      if (!result.success) {
        throw new Error(`Validation Error: ${ JSON.stringify(result.error.format(), null, 2) }`);
      }
      expect(result.success).toBe(true);
      if (result.success) {
        const workout = result.data;
        expect(workout.id).toBeDefined();
        expect(workout.createdAt).toBeInstanceOf(Date);
        expect(workout.userId).toBe(input.userId);
        expect(workout.workoutType).toBe(input.workoutType);
      }
    });

    it('should fail if required properties are missing', () => {
      // Arrange
      const now = new Date();
      const input = {
        workoutType: 'strength',
        completedAt: now,
        // userId missing
      };

      // Act
      const result = CreateCompletedWorkoutSchema.safeParse(input);

      // Assert
      expect(result.success).toBe(false);
    });
  });

  describe('Fixtures', () => {
    it('should create valid fixture', () => {
      const workout = createCompletedWorkoutFixture();
      expect(workout.id).toBeDefined();
      expect(workout.userId).toBeDefined();
      expect(workout.reactions).toBeInstanceOf(Array);
    });

    it('should allow fixture overrides', () => {
      const workout = createCompletedWorkoutFixture({ isPublic: false });
      expect(workout.isPublic).toBe(false);
    });
  });

  describe('Commands', () => {
    it('should add a reaction', () => {
      const workout = createCompletedWorkoutFixture();
      const reaction = createFireReactionFixture();

      const result = addReaction(workout, reaction);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.reactions.length).toBe(1);
        expect(result.value.reactions[0]).toEqual(reaction);
      }
    });

    it('should update existing reaction from same user', () => {
      const workout = createCompletedWorkoutFixture();
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
      const workout = createCompletedWorkoutFixture();
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
      const workout = createCompletedWorkoutFixture({ isPublic: false });

      const publicWorkout = makePublic(workout);
      expect(publicWorkout.isPublic).toBe(true);
    });

    it('should make workout private', () => {
      const workout = createCompletedWorkoutFixture({ isPublic: true });

      const privateWorkout = makePrivate(workout);
      expect(privateWorkout.isPublic).toBe(false);
    });
  });

  describe('Queries', () => {
    it('should calculate total volume', () => {
      // Arrange
      const performance = createMinimalPerformanceFixture({
        activities: [{
          activityType: 'main',
          completed: true,
          durationMinutes: 30,
          exercises: [{
            name: 'Bench',
            setsCompleted: 1,
            setsPlanned: 1,
            reps: [10],
            weight: [100],
          }]
        }]
      });

      const workout = createCompletedWorkoutFixture({ performance });

      // Act & Assert
      expect(Queries.getTotalVolume(workout)).toBe(1000); // 10 * 100
    });

    it('should count reactions', () => {
      const workout = createCompletedWorkoutFixture();
      const r1 = createFireReactionFixture({ userId: 'u1' });
      const r2 = createStrongReactionFixture({ userId: 'u2' });

      let w = addReaction(workout, r1).value!;
      w = addReaction(w, r2).value!;

      expect(Queries.getReactionCount(w)).toBe(2);
    });
  });
});
