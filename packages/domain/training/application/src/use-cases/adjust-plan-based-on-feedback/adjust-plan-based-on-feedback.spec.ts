import { describe, it, beforeEach, vi, expect } from 'vitest';


import { Result, EventBus } from '@bene/shared';
import { createFitnessPlanFixture, createWeeklyScheduleFixture } from '@bene/training-core/fixtures';

import { FitnessPlanRepository } from '@/repositories/fitness-plan-repository.js';
import { AIPlanGenerator } from '@/services/ai-plan-generator.js';

import { AdjustPlanBasedOnFeedbackUseCase } from './adjust-plan-based-on-feedback.js';

// Mock repositories and services
const mockPlanRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  findActiveByUserId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
} as unknown as FitnessPlanRepository;

const mockAIPlanGenerator = {
  adjustPlan: vi.fn(),
} as unknown as AIPlanGenerator;

const mockEventBus = {
  publish: vi.fn(),
  subscribe: vi.fn(),
} as unknown as EventBus;

describe('AdjustPlanBasedOnFeedbackUseCase', () => {
  let useCase: AdjustPlanBasedOnFeedbackUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new AdjustPlanBasedOnFeedbackUseCase(
      mockPlanRepository,
      mockAIPlanGenerator,
      mockEventBus,
    );
  });

  it('should successfully adjust a plan based on feedback', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const planId = crypto.randomUUID();
    const feedback = 'Too hard, need more rest days';
    const originalPlan = createFitnessPlanFixture({
      id: planId,
      userId,
      status: 'active',
      weeks: [createWeeklyScheduleFixture()],
    });

    const adjustedPlan = {
      ...originalPlan,
      title: 'Adjusted Strength Plan',
    };

    const recentWorkouts = [
      {
        perceivedExertion: 8,
        enjoyment: 6,
        difficultyRating: 'too_hard' as const,
      },
    ];

    vi.mocked(mockPlanRepository.findById).mockResolvedValue(Result.ok(originalPlan));
    vi.mocked(mockAIPlanGenerator.adjustPlan).mockResolvedValue(Result.ok(adjustedPlan));

    // Act
    const result = await useCase.execute({
      userId,
      planId,
      feedback,
      recentWorkouts,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.plan.id).toBe(planId);
      expect(result.value.plan.title).toBe('Adjusted Strength Plan');
      expect(result.value.message).toBe(
        'Your plan has been adjusted based on your feedback',
      );
    }
    expect(mockPlanRepository.save).toHaveBeenCalledWith(adjustedPlan);
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'PlanAdjusted',
        userId,
        planId,
        feedback,
      }),
    );
  });

  it('should fail if plan is not found', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const planId = crypto.randomUUID();
    const feedback = 'Too easy';
    const recentWorkouts = [
      {
        perceivedExertion: 8,
        enjoyment: 5,
        difficultyRating: 'too_hard' as const,
      },
    ];

    vi.mocked(mockPlanRepository.findById).mockResolvedValue(
      Result.fail(new Error('Plan not found')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      planId,
      feedback,
      recentWorkouts,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe('Plan not found');
    }
  });

  it('should fail if user is not authorized', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const otherUserId = crypto.randomUUID();
    const planId = crypto.randomUUID();
    const feedback = 'Too easy';

    const originalPlan = createFitnessPlanFixture({
      id: planId,
      userId: otherUserId,
      status: 'active',
      weeks: [createWeeklyScheduleFixture()],
    });

    const recentWorkouts = [
      {
        perceivedExertion: 8,
        enjoyment: 6,
        difficultyRating: 'too_hard' as const,
      },
    ];

    vi.mocked(mockPlanRepository.findById).mockResolvedValue(Result.ok(originalPlan));

    // Act
    const result = await useCase.execute({
      userId,
      planId,
      feedback,
      recentWorkouts,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe('Not authorized');
    }
  });

  it('should fail if AI plan adjustment fails', async () => {
    // Arrange
    const userId = crypto.randomUUID();
    const planId = crypto.randomUUID();
    const feedback = 'Too hard, need more rest days';

    const originalPlan = createFitnessPlanFixture({
      id: planId,
      userId,
      status: 'active',
      weeks: [createWeeklyScheduleFixture()],
    });

    const recentWorkouts = [
      {
        perceivedExertion: 8,
        enjoyment: 6,
        difficultyRating: 'too_hard' as const,
      },
    ];

    vi.mocked(mockPlanRepository.findById).mockResolvedValue(Result.ok(originalPlan));
    vi.mocked(mockAIPlanGenerator.adjustPlan).mockResolvedValue(
      Result.fail(new Error('AI adjustment failed')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      planId,
      feedback,
      recentWorkouts,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe(
        'Failed to adjust plan: Error: AI adjustment failed',
      );
    }
  });
});
