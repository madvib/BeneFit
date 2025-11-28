import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/core/shared';
import { WorkoutPlan, WorkoutPlanCommands } from '@bene/core/plans';
import { ActivatePlanUseCase } from './activate-plan';
import { WorkoutPlanRepository } from '../../../repositories/workout-plan-repository';
import { EventBus } from '../../../shared/event-bus.js';

// Mock repositories and services
const mockPlanRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  findActiveByUserId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
} as unknown as WorkoutPlanRepository;

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
    const draftPlan: WorkoutPlan = {
      id: planId,
      userId,
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals: { goalType: 'strength', target: 'build muscle' },
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      weeks: [{ weekNumber: 1, workouts: [], workoutsCompleted: 0 }],
      status: 'draft',
      currentPosition: { week: 1, day: 0 },
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const activatedPlan: WorkoutPlan = {
      ...draftPlan,
      status: 'active',
    };

    mockPlanRepository.findById.mockResolvedValue(Result.ok(draftPlan));
    vi.spyOn(WorkoutPlanCommands, 'activatePlan').mockReturnValue(
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
        type: 'PlanActivated',
        userId,
        planId,
      }),
    );
  });

  it('should fail if plan is not found', async () => {
    // Arrange
    const userId = 'user-123';
    const planId = 'plan-456';

    mockPlanRepository.findById.mockResolvedValue(
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
      expect(result.error.message).toBe('Plan not found');
    }
  });

  it('should fail if user is not authorized to activate the plan', async () => {
    // Arrange
    const userId = 'user-123';
    const otherUserId = 'user-789';
    const planId = 'plan-456';
    const draftPlan: WorkoutPlan = {
      id: planId,
      userId: otherUserId, // Different user
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals: { goalType: 'strength', target: 'build muscle' },
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      weeks: [{ weekNumber: 1, workouts: [], workoutsCompleted: 0 }],
      status: 'draft',
      currentPosition: { week: 1, day: 0 },
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPlanRepository.findById.mockResolvedValue(Result.ok(draftPlan));

    // Act
    const result = await useCase.execute({
      userId,
      planId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toBe('Not authorized to activate this plan');
    }
  });

  it('should fail if plan activation command fails', async () => {
    // Arrange
    const userId = 'user-123';
    const planId = 'plan-456';
    const draftPlan: WorkoutPlan = {
      id: planId,
      userId,
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals: { goalType: 'strength', target: 'build muscle' },
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      weeks: [{ weekNumber: 1, workouts: [], workoutsCompleted: 0 }],
      status: 'draft', // Correct status for activation
      currentPosition: { week: 1, day: 0 },
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockPlanRepository.findById.mockResolvedValue(Result.ok(draftPlan));
    vi.spyOn(WorkoutPlanCommands, 'activatePlan').mockReturnValue(
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
      expect(result.error.message).toBe('Error: Cannot activate');
    }
  });
});
