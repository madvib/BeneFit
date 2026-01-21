import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result, EventBus } from '@bene/shared';
import { createUserProfileFixture } from '@bene/training-core/fixtures';
import { UpdateFitnessGoalsUseCase } from './update-fitness-goals.js';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';

// Mock repositories and services
const mockProfileRepository = {
  findById: vi.fn(),
  save: vi.fn(),
} as any;

const mockEventBus = {
  publish: vi.fn(),
} as unknown as EventBus;

describe('UpdateFitnessGoalsUseCase', () => {
  let useCase: UpdateFitnessGoalsUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new UpdateFitnessGoalsUseCase(mockProfileRepository, mockEventBus);
  });

  const validUserId = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

  it('should successfully update fitness goals', async () => {
    // Arrange
    const newGoals = {
      primary: 'hypertrophy' as const,
      secondary: ['endurance'],
      motivation: 'Look better',
      successCriteria: ['Bigger muscles']
    };

    const mockProfile = createUserProfileFixture({
      userId: validUserId,
      fitnessGoals: {
        primary: 'strength',
        secondary: [],
        motivation: 'Stay fit',
        successCriteria: []
      },
    });

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(mockProfile));
    vi.mocked(mockProfileRepository.save).mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      userId: validUserId,
      goals: newGoals as any,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.userId).toBe(validUserId);
      expect(result.value.goals.primary).toBe(newGoals.primary);
    }

    expect(mockProfileRepository.save).toHaveBeenCalled();
    expect(mockEventBus.publish).toHaveBeenCalled();
  });

  it('should fail if profile is not found', async () => {
    // Arrange
    const newGoals = {
      primary: 'hypertrophy' as const,
      secondary: [],
      motivation: 'Get big',
      successCriteria: ['Bigger arms']
    };

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(
      Result.fail(new Error('Profile not found')),
    );

    // Act
    const result = await useCase.execute({
      userId: validUserId,
      goals: newGoals,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Profile not found');
    }
  });
});
