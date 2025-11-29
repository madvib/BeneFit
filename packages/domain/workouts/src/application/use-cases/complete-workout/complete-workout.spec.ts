import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result } from '@bene/domain-shared';
import { CompleteWorkoutUseCase } from './complete-workout.js';
import * as plansDomain from '@bene/core/plans';
import * as profileDomain from '@core/index.js';
import * as workoutsDomain from '@core/index.js';

vi.mock('@bene/core/plans', () => ({
  WorkoutPlanCommands: {
    completeWorkout: vi.fn(),
  },
}));

vi.mock('@core/index.js', () => ({
  UserProfileCommands: {
    recordWorkoutCompleted: vi.fn(),
  },
}));

vi.mock('@core/index.js', () => ({
  createCompletedWorkout: vi.fn(),
}));

describe('CompleteWorkoutUseCase', () => {
  let useCase: CompleteWorkoutUseCase;
  let sessionRepo: any;
  let completedWorkoutRepo: any;
  let planRepo: any;
  let profileRepo: any;
  let eventBus: any;

  beforeEach(() => {
    sessionRepo = {
      findById: vi.fn(),
      delete: vi.fn().mockResolvedValue(Result.ok()),
    };
    completedWorkoutRepo = {
      save: vi.fn().mockResolvedValue(Result.ok()),
    };
    planRepo = {
      findById: vi.fn(),
      save: vi.fn().mockResolvedValue(Result.ok()),
    };
    profileRepo = {
      findById: vi.fn(),
      save: vi.fn().mockResolvedValue(Result.ok()),
    };
    eventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
    };

    useCase = new CompleteWorkoutUseCase(
      sessionRepo,
      completedWorkoutRepo,
      planRepo,
      profileRepo,
      eventBus,
    );
  });

  it('should complete a workout successfully', async () => {
    const mockSession = {
      id: 'session-1',
      ownerId: 'user-1',
      state: 'in_progress',
      workoutType: 'strength',
      activities: [],
      planId: 'plan-1',
      workoutTemplateId: 'template-1',
    };
    sessionRepo.findById.mockResolvedValue(Result.ok(mockSession));

    const mockPlan = {
      id: 'plan-1',
    };
    planRepo.findById.mockResolvedValue(Result.ok(mockPlan));
    vi.mocked(plansDomain.WorkoutPlanCommands.completeWorkout).mockReturnValue(
      Result.ok({ id: 'plan-1' } as any),
    );

    const mockProfile = {
      id: 'user-1',
      stats: {
        totalWorkouts: 5,
        totalVolume: 1000,
        totalMinutes: 100,
        currentStreak: 1,
      },
    };
    profileRepo.findById.mockResolvedValue(Result.ok(mockProfile));
    vi.mocked(profileDomain.UserProfileCommands.recordWorkoutCompleted).mockReturnValue(
      {
        ...mockProfile,
        stats: {
          totalWorkouts: 6,
          totalVolume: 1000,
          totalMinutes: 145,
          currentStreak: 2,
        },
      } as any,
    );

    vi.mocked(workoutsDomain.createCompletedWorkout).mockReturnValue(
      Result.ok({ id: 'completed-1' } as any),
    );

    const request = {
      userId: 'user-1',
      sessionId: 'session-1',
      performance: {
        durationMinutes: 45,
        perceivedExertion: 7,
        enjoyment: 8,
        activities: [],
        completedAt: new Date(),
      },
      verification: { verified: true, method: 'manual' },
    };

    const result = await useCase.execute(request);

    expect(result.isSuccess).toBe(true);
    expect(completedWorkoutRepo.save).toHaveBeenCalled();
    expect(planRepo.save).toHaveBeenCalled();
    expect(profileRepo.save).toHaveBeenCalled();
    expect(sessionRepo.delete).toHaveBeenCalledWith('session-1');
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'WorkoutCompleted',
      }),
    );
  });

  it('should fail if session not found', async () => {
    sessionRepo.findById.mockResolvedValue(Result.fail('Not found'));

    const request = {
      userId: 'user-1',
      sessionId: 'session-1',
      performance: {} as any,
      verification: {} as any,
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Session not found');
  });

  it('should fail if user is not owner', async () => {
    const mockSession = {
      id: 'session-1',
      ownerId: 'user-2',
      state: 'in_progress',
    };
    sessionRepo.findById.mockResolvedValue(Result.ok(mockSession));

    const request = {
      userId: 'user-1',
      sessionId: 'session-1',
      performance: {} as any,
      verification: {} as any,
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Not authorized');
  });
});
