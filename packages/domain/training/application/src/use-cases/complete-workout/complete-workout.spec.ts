import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result, EventBus } from '@bene/shared';
import { CompletedWorkoutRepository } from '../../repositories/completed-workout-repository.js';
import { WorkoutSessionRepository } from '../../repositories/workout-session-repository.js';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';
import { CompleteWorkoutUseCase } from './complete-workout.js';
import { createWorkoutSessionFixture, createMinimalCompletedWorkoutFixture as createCompletedWorkoutFixture } from '@bene/training-core/fixtures';

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
    const validUserId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

    const session = createWorkoutSessionFixture({
      id: 'session-1',
      ownerId: validUserId,
      state: 'in_progress',
      workoutType: 'strength',
    });

    vi.mocked(sessionRepo.findById).mockResolvedValue(Result.ok(session));
    vi.mocked(profileRepo.findById).mockResolvedValue(Result.ok({
      id: validUserId,
      stats: { totalWorkouts: 5, totalVolume: 1000, totalMinutes: 100, currentStreak: 2 }
    } as any));

    const request = {
      userId: validUserId,
      sessionId: 'session-1',
      title: 'Morning Lift',
      performance: {
        startedAt: new Date(Date.now() - 45 * 60000).toISOString(),
        completedAt: new Date().toISOString(),
        durationMinutes: 45,
        activities: [
          {
            activityType: 'main',
            completed: true,
            durationMinutes: 40,
            exercises: [
              {
                name: 'Squat',
                setsCompleted: 1,
                setsPlanned: 1,
                reps: [10],
                weight: [100],
              }
            ]
          }
        ],
        perceivedExertion: 8,
        enjoyment: 4,
        energyLevel: 'high',
        difficultyRating: 'just_right',
      },
      verification: {
        verified: true,
        sponsorEligible: true,
        verifications: [
          { method: 'manual', data: null }
        ],
      },
      shareToFeed: true,
    } as any;

    const result = await useCase.execute(request);

    if (result.isFailure) {
      console.error('UseCase Failed:', result.error);
    }

    expect(result.isSuccess).toBe(true);
    expect(result.value.workout.id).toBeDefined();
    expect(result.value.workout.workoutType).toBe('strength');
    expect(completedWorkoutRepo.save).toHaveBeenCalled();
    expect(sessionRepo.delete).toHaveBeenCalledWith('session-1');
  });
});
