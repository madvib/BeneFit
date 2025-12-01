import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result, EventBus } from '@bene/domain-shared';
import { WorkoutSessionRepository } from '../../repositories/workout-session-repository.js';
import { WorkoutPlanRepository } from '@bene/domain/fitness-plan';
import { UserProfileRepository } from '@bene/domain-user-profile';
import { StartWorkoutUseCase } from './start-workout.js';
import * as workoutsDomain from '@core/index.js';
import * as plansDomain from '@bene/core/plans';

vi.mock('@core/index.js', () => ({
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
  let sessionRepo: WorkoutSessionRepository;
  let planRepo: WorkoutPlanRepository;
  let profileRepo: UserProfileRepository;
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
    planRepo = {
      findActiveByUserId: vi.fn(),
      save: vi.fn().mockResolvedValue(Result.ok()),
    };
    profileRepo = {};
    eventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
    };

    useCase = new StartWorkoutUseCase(sessionRepo, planRepo, profileRepo, eventBus);
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
              activities: [
                {
                  structure: { type: 'distance' },
                  activityType: 'run',
                  instructions: 'Run 5k',
                },
              ],
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
      activities: [
        {
          structure: { type: 'distance' },
          activityType: 'run',
          instructions: 'Run 5k',
        },
      ],
    });

    vi.mocked(plansDomain.WorkoutTemplateCommands.startWorkout).mockReturnValue(
      Result.ok({} as { id: string })
    );

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
