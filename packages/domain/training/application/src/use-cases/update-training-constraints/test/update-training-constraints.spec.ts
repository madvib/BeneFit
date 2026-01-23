import { describe, it, beforeEach, vi, expect } from 'vitest';
import { randomUUID } from 'crypto';
import { Result } from '@bene/shared';
import {
  createUserProfileFixture,
  createTrainingConstraintsFixture,
} from '@bene/training-core/fixtures';
import { UpdateTrainingConstraintsUseCase } from '../update-training-constraints.js';
import type { UserProfileRepository } from '@/repositories/user-profile-repository.js';

describe('UpdateTrainingConstraintsUseCase', () => {
  let useCase: UpdateTrainingConstraintsUseCase;
  let mockProfileRepository: UserProfileRepository;
  let mockEventBus: any;

  beforeEach(() => {
    mockProfileRepository = {
      findById: vi.fn(),
      save: vi.fn(),
    } as any;
    mockEventBus = {
      publish: vi.fn(),
      subscribe: vi.fn(),
    };
    useCase = new UpdateTrainingConstraintsUseCase(mockProfileRepository, mockEventBus);
  });

  it('should update training constraints successfully', async () => {
    // Arrange
    const userId = randomUUID();
    const profile = createUserProfileFixture({ userId });
    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(profile));
    vi.mocked(mockProfileRepository.save).mockResolvedValue(Result.ok());

    const constraints = createTrainingConstraintsFixture();

    // Act
    const result = await useCase.execute({
      userId,
      constraints,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(result.value.userId).toBe(userId);
    expect(result.value.constraints.location).toBeDefined();
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
      constraints: createTrainingConstraintsFixture(),
    });

    // Assert
    expect(result.isFailure).toBe(true);
    expect(result.errorMessage).toBe('Profile not found');
  });
});
