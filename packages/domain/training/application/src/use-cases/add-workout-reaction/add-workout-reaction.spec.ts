import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result, EventBus } from '@bene/shared';
import { CompletedWorkoutRepository } from '../../repositories/completed-workout-repository.js';
import { AddWorkoutReactionUseCase } from './add-workout-reaction.js';

describe('AddWorkoutReactionUseCase', () => {
  let useCase: AddWorkoutReactionUseCase;
  let completedWorkoutRepo: CompletedWorkoutRepository;
  let eventBus: EventBus;

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
    vi.mocked(completedWorkoutRepo.findById).mockResolvedValue(Result.ok(mockWorkout));

    const request = {
      userId: 'user-2',
      userName: 'User 2',
      workoutId: 'workout-1',
      reactionType: 'fire' as const,
    };

    const result = await useCase.execute(request);

    expect(result.isSuccess).toBe(true);
    expect(completedWorkoutRepo.save).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'WorkoutReactionAdded',
      }),
    );
  });

  it('should fail if workout not found', async () => {
    vi.mocked(completedWorkoutRepo.findById).mockResolvedValue(Result.fail(new Error('Not found')));

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
    vi.mocked(completedWorkoutRepo.findById).mockResolvedValue(Result.ok(mockWorkout));

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
