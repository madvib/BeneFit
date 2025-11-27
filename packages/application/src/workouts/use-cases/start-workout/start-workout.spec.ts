import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result } from '@bene/core/shared';
import { StartWorkoutUseCase } from './start-workout.js';
import * as workoutsDomain from '@bene/core/workouts';
import * as plansDomain from '@bene/core/plans';

vi.mock('@bene/core/workouts', () => ({
  createWorkoutSession: vi.fn(),
  WorkoutSessionCommands: {
    startSession: vi.fn(),
  },
}));

vi.mock('@bene/core/plans', () => ({
  WorkoutPlanQueries: {
    getCurrentWorkout: vi.fn(),
  },
  WorkoutTemplateCommands: {
    startWorkout: vi.fn(),
  },
}));

describe('StartWorkoutUseCase', () => {
  let useCase: StartWorkoutUseCase;
  let sessionRepo: any;
  let planRepo: any;
  let profileRepo: any;
  let eventBus: any;

  beforeEach(() => {
    vi.mocked(workoutsDomain.createWorkoutSession).mockReturnValue(Result.ok({
      id: 'session-1',
      activities: [{ structure: { type: 'standard' }, activityType: 'squat', instructions: 'Do squats' }],
      workoutType: 'strength',
      planId: 'plan-1',
    } as any));
    vi.mocked(workoutsDomain.WorkoutSessionCommands.startSession).mockReturnValue(Result.ok({
      id: 'session-1',
      activities: [{ structure: { type: 'standard' }, activityType: 'squat', instructions: 'Do squats' }],
      workoutType: 'strength',
      planId: 'plan-1',
    } as any));

    sessionRepo = {
      save: vi.fn().mockResolvedValue(Result.ok()),
    };
    planRepo = {
      findActiveByUserId: vi.fn(),
      save: vi.fn().mockResolvedValue(Result.ok()),
    };
    profileRepo = {};
    eventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
    };

    useCase = new StartWorkoutUseCase(
      sessionRepo,
      planRepo,
      profileRepo,
      eventBus,
    );
  });

  it('should start a custom workout successfully', async () => {
    const request = {
      userId: 'user-1',
      userName: 'User 1',
      workoutType: 'strength',
      activities: [{ structure: { type: 'standard' }, activityType: 'squat', instructions: 'Do squats' }],
    };

    const result = await useCase.execute(request);

    expect(result.isSuccess).toBe(true);
    expect(sessionRepo.save).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalledWith(expect.objectContaining({
      type: 'WorkoutStarted',
      userId: 'user-1',
    }));
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

  it('should start a workout from a plan', async () => {
    const mockPlan = {
      id: 'plan-1',
      userId: 'user-1',
      weeks: [
        {
          weekNumber: 1,
          workouts: [
            {
              id: 'template-1',
              dayOfWeek: 1,
              type: 'cardio',
              status: 'scheduled',
              activities: [{ structure: { type: 'distance' }, activityType: 'run', instructions: 'Run 5k' }],
            },
          ],
        },
      ],
      currentPosition: { week: 1, day: 1 },
    };

    vi.mocked(plansDomain.WorkoutPlanQueries.getCurrentWorkout).mockReturnValue({
      id: 'template-1',
      dayOfWeek: 1,
      type: 'cardio',
      status: 'scheduled',
      activities: [{ structure: { type: 'distance' }, activityType: 'run', instructions: 'Run 5k' }],
    } as any);

    vi.mocked(plansDomain.WorkoutTemplateCommands.startWorkout).mockReturnValue(Result.ok({} as any));

    planRepo.findActiveByUserId.mockResolvedValue(Result.ok(mockPlan));

    const request = {
      userId: 'user-1',
      userName: 'User 1',
      fromPlan: true,
    };

    const result = await useCase.execute(request);

    expect(result.isSuccess).toBe(true);
    expect(planRepo.findActiveByUserId).toHaveBeenCalledWith('user-1');
    expect(sessionRepo.save).toHaveBeenCalled();
  });

  it('should fail if no active plan found', async () => {
    planRepo.findActiveByUserId.mockResolvedValue(Result.fail('No plan'));

    const request = {
      userId: 'user-1',
      userName: 'User 1',
      fromPlan: true,
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('No active plan found');
  });
});
