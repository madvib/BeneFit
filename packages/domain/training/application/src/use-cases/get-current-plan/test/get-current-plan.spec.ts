import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/shared';
import { createFitnessPlanFixture } from '@bene/training-core/fixtures';
import { GetCurrentPlanUseCase } from '../get-current-plan.js';
import { FitnessPlanRepository } from '../../../repositories/fitness-plan-repository.js';

const mockPlanRepository = {
  findActiveByUserId: vi.fn(),
} as unknown as FitnessPlanRepository;

describe('GetCurrentPlanUseCase', () => {
  let useCase: GetCurrentPlanUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GetCurrentPlanUseCase(mockPlanRepository);
  });

  it('should return plan when active plan exists', async () => {
    // Arrange
    const userId = 'user-123';
    const mockPlan = createFitnessPlanFixture({
      userId,
      status: 'active',
    });

    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(
      Result.ok(mockPlan)
    );

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      // Check that simplified response structure matches { plan: FitnessPlanView }
      expect(result.value.plan).toBeDefined();
      expect(result.value.plan.id).toBe(mockPlan.id);
      expect(result.value.plan.status).toBe('active');
    }
  });

  it('should fail when no active plan exists', async () => {
    // Arrange
    const userId = 'user-456';

    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(
      Result.fail(new Error('No active plan found'))
    );

    // Act
    const result = await useCase.execute({ userId });

    // Assert
    expect(result.isFailure).toBe(true);
    // The error message from the use case when repository fails
    expect(result.error).toBeInstanceOf(Error);
  });
});
