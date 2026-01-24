import { describe, it, expect, vi, beforeEach } from 'vitest';


import { Result, EventBus } from '@bene/shared';

import { WorkoutSessionRepository } from '@/repositories/workout-session-repository.js';

import { StartWorkoutUseCase, type StartWorkoutRequest } from '../start-workout.js';

describe('StartWorkoutUseCase', () => {
  let useCase: StartWorkoutUseCase;
  let sessionRepo: WorkoutSessionRepository;
  let eventBus: EventBus;

  beforeEach(() => {
    sessionRepo = {
      save: vi.fn().mockResolvedValue(Result.ok()),
    } as unknown as WorkoutSessionRepository;
    eventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
      subscribe: vi.fn(),
    } as unknown as EventBus;

    useCase = new StartWorkoutUseCase(sessionRepo, eventBus);
  });

  it('should start a custom workout successfully', async () => {
    const userId = crypto.randomUUID();
    const request: StartWorkoutRequest = {
      userId,
      userName: 'Test User',
      workoutType: 'strength',
      activities: [
        {
          name: 'Test Exercise',
          type: 'main',
          order: 1,
          instructions: ['Test instruction'],
          duration: 60,
        },
      ],
    };

    const result = await useCase.execute(request);

    expect(result.isSuccess).toBe(true);
    expect(result.value.session.id).toBeDefined();
    expect(result.value.session.workoutType).toBe('strength');

    expect(sessionRepo.save).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'WorkoutStarted',
        userId,
      }),
    );
  });

  it('should fail if custom workout missing details', async () => {
    const request = {
      userId: crypto.randomUUID(),
      userName: 'Test User',
      workoutType: undefined, // Missing workoutType
      activities: undefined, // Missing activities
    } as unknown as StartWorkoutRequest;

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
  });
});
