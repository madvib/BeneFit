import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result, EventBus } from '@bene/shared-domain';
import { FitnessPlan } from '@bene/training-core';
import { AdjustPlanBasedOnFeedbackUseCase } from './adjust-plan-based-on-feedback.js';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';
import { AIPlanGenerator } from '../../services/ai-plan-generator.js';

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
    const userId = 'user-123';
    const planId = 'plan-456';
    const feedback = 'Too hard, need more rest days';

    const originalPlan: WorkoutPlan = {
      id: planId,
      userId,
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals: { goalType: 'strength', target: 'build muscle' },
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      weeks: [
        {
          weekNumber: 1,
          workouts: [],
          workoutsCompleted: 0,
        },
      ],
      status: 'active',
      currentPosition: { week: 1, day: 0 },
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const adjustedPlan: WorkoutPlan = {
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

    mockPlanRepository.findById.mockResolvedValue(Result.ok(originalPlan));
    mockAIPlanGenerator.adjustPlan.mockResolvedValue(Result.ok(adjustedPlan));

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
      expect(result.value.planId).toBe(planId);
      expect(result.value.adjustmentsMade).toBeDefined();
      expect(result.value.message).toBe(
        'Your plan has been adjusted based on your feedback',
      );
    }
    expect(mockPlanRepository.save).toHaveBeenCalledWith(adjustedPlan);
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'PlanAdjusted',
        userId,
        planId,
        feedback,
      }),
    );
  });

  it('should fail if plan is not found', async () => {
    // Arrange
    const userId = 'user-123';
    const planId = 'plan-456';
    const feedback = 'Too hard, need more rest days';
    const recentWorkouts = [
      {
        perceivedExertion: 8,
        enjoyment: 6,
        difficultyRating: 'too_hard' as const,
      },
    ];

    mockPlanRepository.findById.mockResolvedValue(
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
    const userId = 'user-123';
    const otherUserId = 'user-789';
    const planId = 'plan-456';
    const feedback = 'Too hard, need more rest days';

    const originalPlan: WorkoutPlan = {
      id: planId,
      userId: otherUserId, // Different user
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals: { goalType: 'strength', target: 'build muscle' },
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      weeks: [
        {
          weekNumber: 1,
          workouts: [],
          workoutsCompleted: 0,
        },
      ],
      status: 'active',
      currentPosition: { week: 1, day: 0 },
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const recentWorkouts = [
      {
        perceivedExertion: 8,
        enjoyment: 6,
        difficultyRating: 'too_hard' as const,
      },
    ];

    mockPlanRepository.findById.mockResolvedValue(Result.ok(originalPlan));

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
    const userId = 'user-123';
    const planId = 'plan-456';
    const feedback = 'Too hard, need more rest days';

    const originalPlan: WorkoutPlan = {
      id: planId,
      userId,
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals: { goalType: 'strength', target: 'build muscle' },
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      weeks: [
        {
          weekNumber: 1,
          workouts: [],
          workoutsCompleted: 0,
        },
      ],
      status: 'active',
      currentPosition: { week: 1, day: 0 },
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const recentWorkouts = [
      {
        perceivedExertion: 8,
        enjoyment: 6,
        difficultyRating: 'too_hard' as const,
      },
    ];

    mockPlanRepository.findById.mockResolvedValue(Result.ok(originalPlan));
    mockAIPlanGenerator.adjustPlan.mockResolvedValue(
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
