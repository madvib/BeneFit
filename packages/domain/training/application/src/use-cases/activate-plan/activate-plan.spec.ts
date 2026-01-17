import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/shared';
import { FitnessPlanCommands, createFitnessPlanFixture } from '@bene/training-core';
import { ActivatePlanUseCase } from './activate-plan.js';
import { EventBus } from '@bene/shared';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';

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
} as unknown as EventBus;

describe('ActivatePlanUseCase', () => {
  let useCase: ActivatePlanUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new ActivatePlanUseCase(mockPlanRepository, mockEventBus);
  });

  it('should successfully activate a draft plan', async () => {
    // Arrange
    const userId = 'user-123';
    const planId = 'plan-456';
    const draftPlan = createFitnessPlanFixture({
      id: planId,
      userId,
      status: 'draft',
      weeks: [{ weekNumber: 1, workouts: [], workoutsCompleted: 0 } as any], // simplifying week for test
    });

    const activatedPlan = {
      ...draftPlan,
      status: 'active' as const,
    };

    vi.mocked(mockPlanRepository.findById).mockResolvedValue(Result.ok(draftPlan));
    vi.spyOn(FitnessPlanCommands, 'activatePlan').mockReturnValue(
      Result.ok(activatedPlan),
    );

    // Act
    const result = await useCase.execute({
      userId,
      planId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.planId).toBe(planId);
      expect(result.value.status).toBe('active');
    }
    expect(mockPlanRepository.save).toHaveBeenCalledWith(activatedPlan);
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'PlanActivated',
        userId,
        planId,
      }),
    );
  });

  it('should fail if plan is not found', async () => {
    // Arrange
    const userId = 'user-123';
    const planId = 'plan-456';

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

  it('should fail if user is not authorized to activate the plan', async () => {
    // Arrange
    const userId = 'user-123';
    const otherUserId = 'user-789';
    const planId = 'plan-456';
    const draftPlan = createFitnessPlanFixture({
      id: planId,
      userId: otherUserId,
      status: 'draft',
    });

    vi.mocked(mockPlanRepository.findById).mockResolvedValue(Result.ok(draftPlan));

    // Act
    const result = await useCase.execute({
      userId,
      planId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe(
        'Not authorized to activate this plan',
      );
    }
  });

  it('should fail if plan activation command fails', async () => {
    // Arrange
    const userId = 'user-123';
    const planId = 'plan-456';
    const draftPlan = createFitnessPlanFixture({
      id: planId,
      userId,
      status: 'draft',
    });

    vi.mocked(mockPlanRepository.findById).mockResolvedValue(Result.ok(draftPlan));
    vi.spyOn(FitnessPlanCommands, 'activatePlan').mockReturnValue(
      Result.fail(new Error('Cannot activate')),
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
      expect((result.error as Error).message).toBe('Cannot activate');
    }
  });
});
