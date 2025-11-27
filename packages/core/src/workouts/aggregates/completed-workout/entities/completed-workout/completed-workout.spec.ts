import { describe, it, expect } from 'vitest';
import { createCompletedWorkout } from './completed-workout.factory.js';
import {
  addReaction,
  removeReaction,
  makePublic,
  makePrivate,
} from './completed-workout.commands.js';
import {
  getTotalVolume,
  getCompletionPercentage,
  wasWorkoutHard,
  wasWorkoutEnjoyable,
  getReactionCount,
  getReactionsByType,
  hasUserReacted,
} from './completed-workout.queries.js';
import { WorkoutPerformance } from '../../../../value-objects/workout-performance/workout-performance.types.js';
import { WorkoutVerification } from '../../../../value-objects/workout-verification/workout-verification.types.js';

describe('CompletedWorkout', () => {
  const validPerformance: WorkoutPerformance = {
    startedAt: new Date(),
    completedAt: new Date(),
    durationMinutes: 60,
    activities: [
      {
        activityType: 'main',
        completed: true,
        durationMinutes: 60,
        exercises: [
          {
            name: 'Squats',
            setsCompleted: 3,
            setsPlanned: 3,
            reps: [10, 10, 10],
            weight: [100, 100, 100],
          },
        ],
      },
    ],
    perceivedExertion: 8,
    energyLevel: 'high',
    enjoyment: 4,
    difficultyRating: 'just_right',
  };

  const validVerification: WorkoutVerification = {
    verified: true,
    verifications: [
      {
        method: 'gps',
        data: { latitude: 0, longitude: 0, accuracy: 10, timestamp: new Date() },
      },
    ],
    sponsorEligible: true,
    verifiedAt: new Date(),
  };

  const validProps = {
    userId: 'user-123',
    workoutType: 'Strength',
    performance: validPerformance,
    verification: validVerification,
  };

  describe('factory', () => {
    it('should create a valid completed workout', () => {
      const result = createCompletedWorkout(validProps);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.userId).toBe('user-123');
        expect(result.value.workoutType).toBe('Strength');
        expect(result.value.id).toBeDefined();
        expect(result.value.createdAt).toBeDefined();
      }
    });

    it('should fail if required properties are missing', () => {
      const result = createCompletedWorkout({
        ...validProps,
        userId: '',
      });

      expect(result.isFailure).toBe(true);
    });
  });

  describe('commands', () => {
    it('should add a reaction', () => {
      const workoutResult = createCompletedWorkout(validProps);
      if (workoutResult.isFailure) throw new Error('Failed to create workout');
      const workout = workoutResult.value;

      const reaction = {
        userId: 'user-456',
        type: 'fire' as const,
        createdAt: new Date(),
      };
      const result = addReaction(workout, reaction);

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.reactions.length).toBe(1);
        expect(result.value.reactions[0]).toEqual(reaction);
      }
    });

    it('should update existing reaction from same user', () => {
      const workoutResult = createCompletedWorkout(validProps);
      if (workoutResult.isFailure) throw new Error('Failed to create workout');
      let workout = workoutResult.value;

      const reaction1 = {
        userId: 'user-456',
        type: 'fire' as const,
        createdAt: new Date(),
      };
      const reaction2 = {
        userId: 'user-456',
        type: 'heart' as const,
        createdAt: new Date(),
      };

      const result1 = addReaction(workout, reaction1);
      workout = result1.value;

      const result2 = addReaction(workout, reaction2);

      expect(result2.isSuccess).toBe(true);
      if (result2.isSuccess) {
        expect(result2.value.reactions.length).toBe(1);
        expect(result2.value.reactions[0].type).toBe('heart');
      }
    });

    it('should remove a reaction', () => {
      const workoutResult = createCompletedWorkout(validProps);
      if (workoutResult.isFailure) throw new Error('Failed to create workout');
      let workout = workoutResult.value;

      const reaction = {
        userId: 'user-456',
        type: 'fire' as const,
        createdAt: new Date(),
      };
      workout = addReaction(workout, reaction).value;

      const result = removeReaction(workout, 'user-456');

      expect(result.isSuccess).toBe(true);
      if (result.isSuccess) {
        expect(result.value.reactions.length).toBe(0);
      }
    });

    it('should make workout public', () => {
      const workoutResult = createCompletedWorkout(validProps);
      if (workoutResult.isFailure) throw new Error('Failed to create workout');
      const workout = workoutResult.value;

      const publicWorkout = makePublic(workout);
      expect(publicWorkout.isPublic).toBe(true);
    });

    it('should make workout private', () => {
      const workoutResult = createCompletedWorkout({ ...validProps, isPublic: true });
      if (workoutResult.isFailure) throw new Error('Failed to create workout');
      const workout = workoutResult.value;

      const privateWorkout = makePrivate(workout);
      expect(privateWorkout.isPublic).toBe(false);
    });
  });

  describe('queries', () => {
    it('should calculate total volume', () => {
      const workoutResult = createCompletedWorkout(validProps);
      if (workoutResult.isFailure) throw new Error('Failed to create workout');
      const workout = workoutResult.value;

      // 3 sets * 10 reps * 100kg = 3000
      expect(getTotalVolume(workout)).toBe(3000);
    });

    it('should calculate completion percentage', () => {
      const workoutResult = createCompletedWorkout(validProps);
      if (workoutResult.isFailure) throw new Error('Failed to create workout');
      const workout = workoutResult.value;

      expect(getCompletionPercentage(workout)).toBe(100);
    });

    it('should determine if workout was hard', () => {
      const workoutResult = createCompletedWorkout(validProps); // RPE 8
      if (workoutResult.isFailure) throw new Error('Failed to create workout');
      const workout = workoutResult.value;

      expect(wasWorkoutHard(workout)).toBe(true);
    });

    it('should determine if workout was enjoyable', () => {
      const workoutResult = createCompletedWorkout(validProps); // Enjoyment 4
      if (workoutResult.isFailure) throw new Error('Failed to create workout');
      const workout = workoutResult.value;

      expect(wasWorkoutEnjoyable(workout)).toBe(true);
    });

    it('should count reactions', () => {
      const workoutResult = createCompletedWorkout(validProps);
      if (workoutResult.isFailure) throw new Error('Failed to create workout');
      let workout = workoutResult.value;

      workout = addReaction(workout, {
        userId: 'u1',
        type: 'fire',
        createdAt: new Date(),
        id: '',
        userName: '',
      }).value;
      workout = addReaction(workout, {
        userId: 'u2',
        type: 'heart',
        createdAt: new Date(),
        id: '',
        userName: '',
      }).value;

      expect(getReactionCount(workout)).toBe(2);
    });

    it('should get reactions by type', () => {
      const workoutResult = createCompletedWorkout(validProps);
      if (workoutResult.isFailure) throw new Error('Failed to create workout');
      let workout = workoutResult.value;

      workout = addReaction(workout, {
        userId: 'u1',
        type: 'fire',
        createdAt: new Date(),
        id: '',
        userName: '',
      }).value;
      workout = addReaction(workout, {
        userId: 'u2',
        type: 'fire',
        createdAt: new Date(),
        id: '',
        userName: '',
      }).value;
      workout = addReaction(workout, {
        userId: 'u3',
        type: 'heart',
        createdAt: new Date(),
        id: '',
        userName: '',
      }).value;

      const counts = getReactionsByType(workout);
      expect(counts.fire).toBe(2);
      expect(counts.heart).toBe(1);
      expect(counts.clap).toBe(0);
    });

    it('should check if user reacted', () => {
      const workoutResult = createCompletedWorkout(validProps);
      if (workoutResult.isFailure) throw new Error('Failed to create workout');
      let workout = workoutResult.value;

      workout = addReaction(workout, {
        userId: 'u1',
        type: 'fire',
        createdAt: new Date(),
        id: '',
        userName: '',
      }).value;

      expect(hasUserReacted(workout, 'u1')).toBe(true);
      expect(hasUserReacted(workout, 'u2')).toBe(false);
    });
  });
});
