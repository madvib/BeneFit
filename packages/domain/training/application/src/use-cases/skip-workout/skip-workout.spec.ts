import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result, EventBus } from '@bene/shared';
import type { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';
import { SkipWorkoutUseCase } from './skip-workout.js';
import { createFitnessPlanFixture, createWorkoutTemplateFixture } from '@bene/training-core';

describe('SkipWorkoutUseCase', () => {
  let useCase: SkipWorkoutUseCase;
  let planRepo: FitnessPlanRepository;
  let eventBus: EventBus;

  beforeEach(() => {
    planRepo = {
      findById: vi.fn(),
      save: vi.fn().mockResolvedValue(Result.ok()),
    } as unknown as FitnessPlanRepository;
    eventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
    } as unknown as EventBus;

    useCase = new SkipWorkoutUseCase(planRepo, eventBus);
  });

  it('should skip a workout successfully', async () => {
    const mockWorkout = createWorkoutTemplateFixture({
      id: 'workout-1',
      // Ensure status is valid for a skip scenario if needed, generally 'scheduled'
    })

    const mockPlan = createFitnessPlanFixture({
      id: 'plan-1',
      userId: 'user-1',
      weeks: [
        {
          weekNumber: 1,
          workouts: [mockWorkout],
          workoutsCompleted: 0,
        },
      ],
      currentPosition: { week: 1, day: 1 },
      status: 'active',
    });

    vi.mocked(planRepo.findById).mockResolvedValue(Result.ok(mockPlan));

    const request = {
      userId: 'user-1',
      planId: 'plan-1',
      workoutId: 'workout-1',
      reason: 'Sick',
    };

    const result = await useCase.execute(request);

    expect(result.isSuccess).toBe(true);
    expect(planRepo.save).toHaveBeenCalled();

    expect(result.value.planId).toBe('plan-1');
    expect(result.value.skippedWorkoutId).toBe('workout-1');
    expect(result.value.message).toBeDefined();

    // Updated event expectation based on observed failures
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'WorkoutSkipped',
        userId: 'user-1',
        planId: 'plan-1',
        workoutId: 'workout-1',
        reason: 'Sick',
      }),
    );
  });

  it('should fail if plan not found', async () => {
    vi.mocked(planRepo.findById).mockResolvedValue(Result.fail('Not found'));

    const request = {
      userId: 'user-1',
      planId: 'plan-1',
      workoutId: 'workout-1',
      reason: 'Sick',
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Plan not found');
  });

  it('should fail if user not authorized', async () => {
    const mockPlan = createFitnessPlanFixture({
      id: 'plan-1',
      userId: 'user-2', // Different user
    });

    vi.mocked(planRepo.findById).mockResolvedValue(Result.ok(mockPlan));

    const request = {
      userId: 'user-1',
      planId: 'plan-1',
      workoutId: 'workout-1',
      reason: 'Sick',
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Not authorized');
  });
});
