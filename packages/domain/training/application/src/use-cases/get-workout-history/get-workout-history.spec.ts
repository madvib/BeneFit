import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result } from '@bene/shared';
import { CompletedWorkoutRepository } from '../../repositories/completed-workout-repository.js';
import { createWorkoutListFixture } from '@bene/training-core';
import { GetWorkoutHistoryUseCase } from './get-workout-history.js';

describe('GetWorkoutHistoryUseCase', () => {
  let useCase: GetWorkoutHistoryUseCase;
  let completedWorkoutRepo: CompletedWorkoutRepository;

  beforeEach(() => {
    completedWorkoutRepo = {
      findByUserId: vi.fn(),
    };

    useCase = new GetWorkoutHistoryUseCase(completedWorkoutRepo);
  });

  it('should get workout history successfully', async () => {
    const mockWorkouts = createWorkoutListFixture(1);

    vi.mocked(completedWorkoutRepo.findByUserId).mockResolvedValue(Result.ok(mockWorkouts));

    const request = {
      userId: 'user-1',
    };

    const result = await useCase.execute(request);

    expect(result.isSuccess).toBe(true);
    expect(result.value.workouts).toHaveLength(1);
    expect(result.value.total).toBe(1);
    expect(completedWorkoutRepo.findByUserId).toHaveBeenCalledWith('user-1', 20, 0);
  });

  it('should fail if repo fails', async () => {
    vi.mocked(completedWorkoutRepo.findByUserId).mockResolvedValue(
      Result.fail(new Error('Error')),
    );

    const request = {
      userId: 'user-1',
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Error');
  });
});
