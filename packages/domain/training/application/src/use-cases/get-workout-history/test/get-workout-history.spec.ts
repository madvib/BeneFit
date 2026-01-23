import { describe, it, expect, vi, beforeEach } from 'vitest';
import { randomUUID } from 'crypto';

import { Result } from '@bene/shared';
import { createWorkoutListFixture } from '@bene/training-core/fixtures';

import { CompletedWorkoutRepository } from '@/repositories/completed-workout-repository.js';

import { GetWorkoutHistoryUseCase } from '../get-workout-history.js';

describe('GetWorkoutHistoryUseCase', () => {
  let useCase: GetWorkoutHistoryUseCase;
  let completedWorkoutRepo: CompletedWorkoutRepository;

  beforeEach(() => {
    completedWorkoutRepo = {
      findByUserId: vi.fn(),
    } as unknown as CompletedWorkoutRepository;

    useCase = new GetWorkoutHistoryUseCase(completedWorkoutRepo);
  });

  it('should get workout history successfully', async () => {
    const userId = randomUUID();
    const mockWorkouts = createWorkoutListFixture(1);

    vi.mocked(completedWorkoutRepo.findByUserId).mockResolvedValue(Result.ok(mockWorkouts));

    const request = {
      userId,
    };

    const result = await useCase.execute(request);

    expect(result.isSuccess).toBe(true);
    expect(result.value.workouts).toHaveLength(1);
    expect(result.value.total).toBe(1);
    expect(result.value.workouts[0].id).toBe(mockWorkouts[0].id);
    expect(completedWorkoutRepo.findByUserId).toHaveBeenCalledWith(userId, 20, 0);
  });

  it('should fail if repo fails', async () => {
    const userId = randomUUID();
    vi.mocked(completedWorkoutRepo.findByUserId).mockResolvedValue(
      Result.fail(new Error('Error')),
    );

    const request = {
      userId,
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Error');
  });
});
