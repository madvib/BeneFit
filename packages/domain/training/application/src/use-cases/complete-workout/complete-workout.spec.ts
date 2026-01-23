import { describe, it, expect, vi, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';

import { Result, EventBus } from '@bene/shared';
import {
  createWorkoutSessionFixture,
  createUserProfileFixture,
  createMinimalPerformanceFixture,
  createFitnessPlanFixture,
} from '@bene/training-core/fixtures';

import { CompletedWorkoutRepository } from '@/repositories/completed-workout-repository.js';
import { WorkoutSessionRepository } from '@/repositories/workout-session-repository.js';
import { UserProfileRepository } from '@/repositories/user-profile-repository.js';
import { FitnessPlanRepository } from '@/repositories/fitness-plan-repository.js';

import { CompleteWorkoutUseCase } from './complete-workout.js';

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
      subscribe: vi.fn(),
    } as unknown as EventBus;

    useCase = new CompleteWorkoutUseCase(
      sessionRepo,
      completedWorkoutRepo,
      profileRepo,
      planRepo,
      eventBus,
    );
  });

  it('should complete a workout successfully', async () => {
    const validUserId = randomUUID();
    const sessionId = randomUUID();

    const session = createWorkoutSessionFixture({
      id: sessionId,
      ownerId: validUserId,
      state: 'in_progress',
      workoutType: 'strength',
    });

    vi.mocked(sessionRepo.findById).mockResolvedValue(Result.ok(session));
    vi.mocked(profileRepo.findById).mockResolvedValue(
      Result.ok(
        createUserProfileFixture({
          userId: validUserId,
          displayName: 'User',
        }),
      ),
    );
    vi.mocked(planRepo.findById).mockResolvedValue(Result.ok(createFitnessPlanFixture()));

    const request = {
      userId: validUserId,
      sessionId: sessionId,
      title: 'Strength Workout',
      performance: (() => {
        const p = createMinimalPerformanceFixture({
          startedAt: new Date(),
          completedAt: new Date(),
          durationMinutes: 60,
        });
        return {
          ...JSON.parse(JSON.stringify(p)),
          activities: p.activities.map((a: any, i: number) => ({
            ...a,
            name: 'Bench Press',
            order: i + 1,
          })),
        };
      })(),
      verification: {
        verified: true,
        sponsorEligible: true,
        verifications: [{ method: 'manual', data: null }],
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
    expect(sessionRepo.delete).toHaveBeenCalledWith(sessionId);
  });
});
