import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result, EventBus } from '@bene/shared-domain';
import { WorkoutSessionRepository } from '../../repositories/workout-session-repository.js';
import { StartWorkoutUseCase } from './start-workout.js';
import * as workoutsDomain from '@bene/training-core';

vi.mock('@bene/training-core', () => ({
  createWorkoutSession: vi.fn(),
  WorkoutSessionCommands: {
    startSession: vi.fn(),
  },
}));

describe('StartWorkoutUseCase', () => {
  let useCase: StartWorkoutUseCase;
  let sessionRepo: WorkoutSessionRepository;
  let eventBus: EventBus;

  beforeEach(() => {
    // Creating a partial type to match expected return value
    const mockSessionResult = {
      id: 'session-1',
      activities: [
        {
          structure: { type: 'standard' },
          activityType: 'squat',
          instructions: 'Do squats',
        },
      ],
      workoutType: 'strength',
      planId: 'plan-1',
    };

    vi.mocked(workoutsDomain.createWorkoutSession).mockReturnValue(
      Result.ok(mockSessionResult),
    );
    vi.mocked(workoutsDomain.WorkoutSessionCommands.startSession).mockReturnValue(
      Result.ok(mockSessionResult),
    );

    sessionRepo = {
      save: vi.fn().mockResolvedValue(Result.ok()),
    };
    eventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
    };

    useCase = new StartWorkoutUseCase(sessionRepo, eventBus);
  });

  it('should start a custom workout successfully', async () => {
    const request = {
      userId: 'user-1',
      userName: 'User 1',
      workoutType: 'strength',
      activities: [
        {
          structure: { type: 'standard' },
          activityType: 'squat',
          instructions: 'Do squats',
        },
      ],
    };

    const result = await useCase.execute(request);

    expect(result.isSuccess).toBe(true);
    expect(sessionRepo.save).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'WorkoutStarted',
        userId: 'user-1',
      }),
    );
  });

  it('should fail if custom workout missing details', async () => {
    const request = {
      userId: 'user-1',
      userName: 'User 1',
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toContain('Must provide workoutType');
  });
});
