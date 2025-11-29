import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result } from '@bene/domain-shared';
import { SkipWorkoutUseCase } from './skip-workout.js';

describe('SkipWorkoutUseCase', () => {
  let useCase: SkipWorkoutUseCase;
  let planRepo: any;
  let eventBus: any;

  beforeEach(() => {
    planRepo = {
      findById: vi.fn(),
      save: vi.fn().mockResolvedValue(Result.ok()),
    };
    eventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
    };

    useCase = new SkipWorkoutUseCase(planRepo, eventBus);
  });

  it('should skip a workout successfully', async () => {
    const mockPlan = {
      id: 'plan-1',
      userId: 'user-1',
      skipWorkout: vi.fn().mockReturnValue(Result.ok({ id: 'plan-1' })),
    };
    planRepo.findById.mockResolvedValue(Result.ok(mockPlan));

    const request = {
      userId: 'user-1',
      planId: 'plan-1',
      workoutId: 'workout-1',
      reason: 'Sick',
    };

    const result = await useCase.execute(request);

    expect(result.isSuccess).toBe(true);
    expect(mockPlan.skipWorkout).toHaveBeenCalledWith('workout-1', 'Sick');
    expect(planRepo.save).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'WorkoutSkipped',
      }),
    );
  });

  it('should fail if plan not found', async () => {
    planRepo.findById.mockResolvedValue(Result.fail('Not found'));

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
    const mockPlan = {
      id: 'plan-1',
      userId: 'user-2',
    };
    planRepo.findById.mockResolvedValue(Result.ok(mockPlan));

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
