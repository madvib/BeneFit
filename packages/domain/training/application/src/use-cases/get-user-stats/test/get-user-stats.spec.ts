import { describe, it, beforeEach, vi, expect } from 'vitest';

import { Result } from '@bene/shared';
import { createUserProfileFixture } from '@bene/training-core/fixtures';
import { GetUserStatsUseCase } from '../get-user-stats.js';
import type { UserProfileRepository } from '@/repositories/user-profile-repository.js';

describe('GetUserStatsUseCase', () => {
  let useCase: GetUserStatsUseCase;
  let mockProfileRepository: UserProfileRepository;

  beforeEach(() => {
    mockProfileRepository = {
      findById: vi.fn(),
    } as any;
    useCase = new GetUserStatsUseCase(mockProfileRepository);
  });

  it('should get user stats successfully', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const profile = createUserProfileFixture({ userId });
    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(profile));

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.value.totalWorkouts).toBe(profile.stats.totalWorkouts);
    expect(mockProfileRepository.findById).toHaveBeenCalledWith(userId);
  });

  it('should return failure if profile is not found', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    vi.mocked(mockProfileRepository.findById).mockResolvedValue(
      Result.fail(new Error('Profile not found')),
    );

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.errorMessage).toBe('Profile not found');
  });
});
