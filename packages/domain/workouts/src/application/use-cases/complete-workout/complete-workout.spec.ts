import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result, EventBus } from '@bene/domain-shared';
import { WorkoutSessionRepository } from '../../repositories/workout-session-repository.js';
import { CompletedWorkoutRepository } from '../../repositories/completed-workout-repository.js';
import { WorkoutPlanRepository } from '@bene/domain/fitness-plan';
import { UserProfileRepository } from '@bene/domain-user-profile';
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
  createCompletedWorkout: vi.fn(),
}));

describe('CompleteWorkoutUseCase', () => {
  let useCase: CompleteWorkoutUseCase;
  let sessionRepo: WorkoutSessionRepository;
  let completedWorkoutRepo: CompletedWorkoutRepository;
  let planRepo: WorkoutPlanRepository;
  let profileRepo: UserProfileRepository;
  let eventBus: EventBus;

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
      Result.ok({ id: 'plan-1' }),
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
      },
    );

    vi.mocked(workoutsDomain.createCompletedWorkout).mockReturnValue(
      Result.ok({ id: 'completed-1' }),
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
      performance: {} as { durationMinutes: number },
      verification: {} as { verified: boolean; method: string },
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
      performance: {} as { durationMinutes: number },
      verification: {} as { verified: boolean; method: string },
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Not authorized');
  });
});