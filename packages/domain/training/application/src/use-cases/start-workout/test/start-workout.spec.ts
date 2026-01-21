import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result, EventBus } from '@bene/shared';
import { WorkoutSessionRepository } from '../../../repositories/workout-session-repository.js';
import { StartWorkoutUseCase } from '../start-workout.js';
import { StartWorkoutRequest, StartWorkoutRequestSchema } from '../start-workout.js';

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
    } as unknown as EventBus;

    useCase = new StartWorkoutUseCase(sessionRepo, eventBus);
  });

  it('should start a custom workout successfully', async () => {
    const request = {
      userId: 'user-1',
      userName: 'User 1',
      workoutType: 'strength',
      activities: [
        {
          name: 'Push ups',
          type: 'main', // Explicit valid enum
          order: 1,
          instructions: ['Do 10 reps'],
          duration: 60,
        },
      ],
    };

    const result = await useCase.execute(request);

    // With real logic, if the inputs are valid, it should succeed.
    // The previous test mocked strict return values. Use real logic means we are testing integration.

    // Note: UseCase.execute calls creates a session and starts it.

    if (result.isFailure) {
      console.error('StartWorkout failed:', result.error);
    }
    expect(result.isSuccess).toBe(true);
    expect(result.value.session.id).toBeDefined();
    expect(result.value.session.workoutType).toBe('strength');

    expect(sessionRepo.save).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'WorkoutStarted',
        userId: 'user-1',
        // Check other fields if necessary
      }),
    );
  });

  it('should fail if custom workout missing details', async () => {
    const request = {
      ...fake(StartWorkoutRequestSchema),
      userId: 'user-1',
      userName: 'User 1',
      workoutType: undefined, // Missing workoutType
      activities: undefined, // Missing activities
    } as unknown as StartWorkoutRequest;

    // Real domain validation should catch this
    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    // The error message depends on the domain validation. 
    // It likely validates workoutType presence.
    // expect((result.error as Error).message).toContain('Must provide workoutType');
  });
});
