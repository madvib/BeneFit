import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result, EventBus } from '@bene/shared';
import { CompletedWorkoutRepository } from '../../repositories/completed-workout-repository.js';
import { WorkoutSessionRepository } from '../../repositories/workout-session-repository.js';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';
import { CompleteWorkoutUseCase } from './complete-workout.js';
import { createWorkoutSessionFixture, createCompletedWorkoutFixture } from '@bene/training-core';

describe('CompleteWorkoutUseCase', () => {
  let useCase: CompleteWorkoutUseCase;
  let sessionRepo: WorkoutSessionRepository;
  let completedWorkoutRepo: CompletedWorkoutRepository;
  let profileRepo: UserProfileRepository;
  let planRepo: FitnessPlanRepository;
  let eventBus: EventBus;

  beforeEach(() => {
    sessionRepo = {
      findById: vi.fn(),
      delete: vi.fn().mockResolvedValue(Result.ok()),
    } as unknown as WorkoutSessionRepository;

    completedWorkoutRepo = {
      save: vi.fn().mockResolvedValue(Result.ok()),
    } as unknown as CompletedWorkoutRepository;

    profileRepo = {
      findById: vi.fn(),
      save: vi.fn().mockResolvedValue(Result.ok()),
    } as unknown as UserProfileRepository;

    planRepo = {
      findById: vi.fn(),
      save: vi.fn().mockResolvedValue(Result.ok()),
    } as unknown as FitnessPlanRepository;

    eventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
    } as unknown as EventBus;

    useCase = new CompleteWorkoutUseCase(
      sessionRepo,
      completedWorkoutRepo,
      profileRepo,
      planRepo,
      eventBus
    );
  });

  it('should complete a workout successfully', async () => {
    const session = createWorkoutSessionFixture({
      id: 'session-1',
      ownerId: 'user-1',
      state: 'in_progress',
      workoutType: 'strength',
    });

    vi.mocked(sessionRepo.findById).mockResolvedValue(Result.ok(session));
    vi.mocked(profileRepo.findById).mockResolvedValue(Result.ok({
      id: 'user-1',
      stats: { totalWorkouts: 5, totalVolume: 1000, totalMinutes: 100, currentStreak: 2 }
    } as any));

    const request = {
      userId: 'user-1',
      sessionId: 'session-1',
      title: 'Morning Lift',
      performance: {
        completedAt: new Date().toISOString(),
        durationMinutes: 45,
        activities: [],
        effort: 8
      },
      verification: {
        method: 'manual',
        verified: true,
      },
      shareToFeed: true,
    } as any; // Using any to avoid complex schema mocking details for now

    const result = await useCase.execute(request);

    expect(result.isSuccess).toBe(true);
    expect(result.value.workout.id).toBeDefined();
    expect(result.value.workout.workoutType).toBe('strength');
    expect(completedWorkoutRepo.save).toHaveBeenCalled();
    expect(sessionRepo.delete).toHaveBeenCalledWith('session-1');
  });
});
