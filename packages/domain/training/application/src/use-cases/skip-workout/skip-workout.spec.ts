import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result, EventBus } from '@bene/shared-domain';
import type { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';
import { SkipWorkoutUseCase } from './skip-workout.js';

describe('SkipWorkoutUseCase', () => {
  let useCase: SkipWorkoutUseCase;
  let planRepo: FitnessPlanRepository;
  let eventBus: EventBus;

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
    const mockWorkout = {
      id: 'workout-1',
      type: 'strength',
      dayOfWeek: 1,
      status: 'scheduled',
      activities: [],
    };

    const mockPlan = {
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
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals: { goalType: 'strength', target: 'build muscle' },
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      status: 'active',
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
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
    expect(planRepo.save).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'WorkoutSkipped',
        userId: 'user-1',
        workoutId: 'workout-1',
        reason: 'Sick',
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
