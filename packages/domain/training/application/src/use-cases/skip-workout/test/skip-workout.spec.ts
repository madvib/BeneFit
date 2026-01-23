import { describe, it, expect, vi, beforeEach } from 'vitest';

import { Result, EventBus } from '@bene/shared';
import { createFitnessPlanFixture, createWorkoutTemplateFixture, createWeeklyScheduleFixture } from '@bene/training-core/fixtures';

import type { FitnessPlanRepository } from '@/repositories/fitness-plan-repository.js';

import { SkipWorkoutUseCase } from '../skip-workout.js';

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
      subscribe: vi.fn(),
    } as unknown as EventBus;

    useCase = new SkipWorkoutUseCase(planRepo, eventBus);
  });

  it('should skip a workout successfully', async () => {
    const userId = crypto.randomUUID();
    const planId = crypto.randomUUID();
    const workoutId = crypto.randomUUID();
    const reason = 'Personal reasons';

    const mockWorkout = createWorkoutTemplateFixture({
      id: workoutId,
      status: 'scheduled',
    });

    const mockPlan = createFitnessPlanFixture({
      id: planId,
      userId,
      weeks: [
        createWeeklyScheduleFixture({
          planId,
          weekNumber: 1,
          workouts: [mockWorkout],
        }),
      ],
      currentPosition: { week: 1, day: 1 },
      status: 'active',
    });

    vi.mocked(planRepo.findById).mockResolvedValue(Result.ok(mockPlan));

    const request = {
      userId,
      planId,
      workoutId,
      reason,
    };

    const result = await useCase.execute(request);

    expect(result.isSuccess).toBe(true);
    expect(planRepo.save).toHaveBeenCalled();

    expect(result.value.planId).toBe(planId);
    expect(result.value.skippedWorkoutId).toBe(workoutId);
    expect(result.value.message).toBeDefined();

    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'WorkoutSkipped',
        userId,
        planId,
        workoutId,
        reason,
      }),
    );
  });

  it('should fail if plan not found', async () => {
    const userId = crypto.randomUUID();
    const planId = crypto.randomUUID();
    const workoutId = crypto.randomUUID();

    vi.mocked(planRepo.findById).mockResolvedValue(Result.fail(new Error('Not found')));

    const request = {
      userId,
      planId,
      workoutId,
      reason: 'Personal reasons',
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Plan not found');
  });

  it('should fail if user not authorized', async () => {
    const userId = crypto.randomUUID();
    const otherUserId = crypto.randomUUID();
    const planId = crypto.randomUUID();
    const workoutId = crypto.randomUUID();

    const mockPlan = createFitnessPlanFixture({
      id: planId,
      userId: otherUserId,
    });

    vi.mocked(planRepo.findById).mockResolvedValue(Result.ok(mockPlan));

    const request = {
      userId,
      planId,
      workoutId,
      reason: 'Personal reasons',
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Not authorized');
  });
});
