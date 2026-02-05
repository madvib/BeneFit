import { describe, it, beforeEach, vi, expect } from 'vitest';

import { Result, EventBus } from '@bene/shared';
import { createFitnessPlanFixture } from '@bene/training-core/fixtures';

import { FitnessPlanRepository } from '@/repositories/fitness-plan-repository.js';

import { PausePlanUseCase } from '../pause-plan.js';

// Mock repositories and services
const mockPlanRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  findActiveByUserId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
} as unknown as FitnessPlanRepository;

const mockEventBus = {
  publish: vi.fn(),
  subscribe: vi.fn(),
} as unknown as EventBus;

describe('PausePlanUseCase', () => {
  let useCase: PausePlanUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new PausePlanUseCase(mockPlanRepository, mockEventBus);
  });

  it('should successfully pause an active plan', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const planId = crypto.randomUUID();
    const reason = 'Test pause reason';

    const activePlan = createFitnessPlanFixture({
      id: planId,
      userId,
      status: 'active',
    });

    // Mock findById to return the active plan
    vi.mocked(mockPlanRepository.findById).mockResolvedValue(Result.ok(activePlan));

    // Act
    const result = await useCase.execute({
      userId,
      planId,
      reason,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.planId).toBe(planId);
      expect(result.value.status).toBe('paused');
    }

    // We expect the repository to be called with a plan that has status 'paused'
    expect(mockPlanRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: planId,
        status: 'paused',
      })
    );

    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'PlanPaused',
        userId,
        planId,
        reason,
      }),
    );
  });

  it('should successfully pause an active plan without a reason', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const planId = crypto.randomUUID();

    const activePlan = createFitnessPlanFixture({
      id: planId,
      userId,
      status: 'active',
    });

    vi.mocked(mockPlanRepository.findById).mockResolvedValue(Result.ok(activePlan));

    // Act
    const result = await useCase.execute({
      userId,
      planId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.planId).toBe(planId);
      expect(result.value.status).toBe('paused');
    }
    expect(mockPlanRepository.save).toHaveBeenCalledWith(
      expect.objectContaining({
        id: planId,
        status: 'paused',
      })
    );
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'PlanPaused',
        userId,
        planId,
        reason: undefined,
      }),
    );
  });

  it('should fail if plan is not found', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const planId = crypto.randomUUID();

    vi.mocked(mockPlanRepository.findById).mockResolvedValue(
      Result.fail(new Error('Plan not found')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      planId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Plan not found');
    }
  });

  it('should fail if user is not authorized to pause the plan', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const otherUserId = crypto.randomUUID();
    const planId = crypto.randomUUID();

    const activePlan = createFitnessPlanFixture({
      id: planId,
      userId: otherUserId, // Different user
      status: 'active',
    });

    vi.mocked(mockPlanRepository.findById).mockResolvedValue(Result.ok(activePlan));

    // Act
    const result = await useCase.execute({
      userId,
      planId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Not authorized');
    }
  });
});
