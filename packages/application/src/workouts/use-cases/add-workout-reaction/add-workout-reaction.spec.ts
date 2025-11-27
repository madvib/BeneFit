import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result } from '@bene/core/shared';
import { AddWorkoutReactionUseCase } from './add-workout-reaction';

describe('AddWorkoutReactionUseCase', () => {
  let useCase: AddWorkoutReactionUseCase;
  let completedWorkoutRepo: any;
  let eventBus: any;

  beforeEach(() => {
    completedWorkoutRepo = {
      findById: vi.fn(),
      save: vi.fn().mockResolvedValue(Result.ok()),
    };
    eventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
    };

    useCase = new AddWorkoutReactionUseCase(completedWorkoutRepo, eventBus);
  });

  it('should add a reaction successfully', async () => {
    const mockWorkout = {
      id: 'workout-1',
      userId: 'user-1',
      isPublic: true,
      reactions: [],
    };
    completedWorkoutRepo.findById.mockResolvedValue(Result.ok(mockWorkout));

    const request = {
      userId: 'user-2',
      userName: 'User 2',
      workoutId: 'workout-1',
      reactionType: 'fire' as const,
    };

    const result = await useCase.execute(request);

    expect(result.isSuccess).toBe(true);
    expect(completedWorkoutRepo.save).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalledWith(expect.objectContaining({
      type: 'WorkoutReactionAdded',
    }));
  });

  it('should fail if workout not found', async () => {
    completedWorkoutRepo.findById.mockResolvedValue(Result.fail('Not found'));

    const request = {
      userId: 'user-2',
      userName: 'User 2',
      workoutId: 'workout-1',
      reactionType: 'fire' as const,
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Workout not found');
  });

  it('should fail if workout is private', async () => {
    const mockWorkout = {
      id: 'workout-1',
      isPublic: false,
    };
    completedWorkoutRepo.findById.mockResolvedValue(Result.ok(mockWorkout));

    const request = {
      userId: 'user-2',
      userName: 'User 2',
      workoutId: 'workout-1',
      reactionType: 'fire' as const,
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Cannot react to private workout');
  });
});
