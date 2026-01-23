import { describe, it, beforeEach, vi, expect } from 'vitest';
import { randomUUID } from 'crypto';
import { Result } from '@bene/shared';
import {
  createUserProfileFixture,
  createUserPreferencesFixture,
} from '@bene/training-core/fixtures';
import { UpdatePreferencesUseCase } from '../update-preferences.js';
import type { UserProfileRepository } from '@/repositories/user-profile-repository.js';

describe('UpdatePreferencesUseCase', () => {
  let useCase: UpdatePreferencesUseCase;
  let mockProfileRepository: UserProfileRepository;

  beforeEach(() => {
    mockProfileRepository = {
      findById: vi.fn(),
      save: vi.fn(),
    } as any;
    useCase = new UpdatePreferencesUseCase(mockProfileRepository);
  });

  it('should update user preferences successfully', async () => {
    // Arrange
    const userId = randomUUID();
    const profile = createUserProfileFixture({ userId });
    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(profile));
    vi.mocked(mockProfileRepository.save).mockResolvedValue(Result.ok());

    const preferences = createUserPreferencesFixture();

    // Act
    const result = await useCase.execute({
      userId,
      preferences,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.value.userId).toBe(userId);
    expect(result.value.preferences.theme).toBeDefined();
    expect(mockProfileRepository.save).toHaveBeenCalled();
  });

  it('should return failure if profile is not found', async () => {
    // Arrange
    const userId = randomUUID();
    vi.mocked(mockProfileRepository.findById).mockResolvedValue(
      Result.fail(new Error('Profile not found')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      preferences: createUserPreferencesFixture(),
    });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.errorMessage).toBe('Profile not found');
  });
});
