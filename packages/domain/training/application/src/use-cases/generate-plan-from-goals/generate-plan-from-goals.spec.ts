import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/shared';
import { FitnessPlan } from '@bene/training-core';
import { UserProfile } from '@bene/training-core';
import { GeneratePlanFromGoalsUseCase } from './generate-plan-from-goals.js';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';
import { AIPlanGenerator } from '../../services/ai-plan-generator.js';
import { EventBus } from '@bene/shared';
import { UserProfileRepository } from '../../repositories/user-profile-repository.js';

// Mock repositories and services
const mockPlanRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  findActiveByUserId: vi.fn(),
  save: vi.fn(),
  delete: vi.fn(),
} as unknown as FitnessPlanRepository;

const mockProfileRepository = {
  findById: vi.fn(),
} as unknown as UserProfileRepository;

const mockAIPlanGenerator = {
  generatePlan: vi.fn(),
} as unknown as AIPlanGenerator;

const mockEventBus = {
  publish: vi.fn(),
} as unknown as EventBus;

describe('GeneratePlanFromGoalsUseCase', () => {
  let useCase: GeneratePlanFromGoalsUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GeneratePlanFromGoalsUseCase(
      mockPlanRepository,
      mockProfileRepository,
      mockAIPlanGenerator,
      mockEventBus,
    );
  });

  it('should successfully generate a plan when user has no active plan', async () => {
    // Arrange
    const userId = 'user-123';
    const goals = { goalType: 'strength', target: 'build muscle' };
    const mockProfile: UserProfile = {
      id: userId,
      userId,
      experienceLevel: 'beginner',
      trainingConstraints: { equipment: [], injuries: [], timeConstraints: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockPlan: FitnessPlan = {
      id: 'plan-123',
      userId,
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals,
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      weeks: [],
      status: 'draft',
      currentPosition: { week: 1, day: 0 },
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProfileRepository.findById.mockResolvedValue(Result.ok(mockProfile));
    mockPlanRepository.findActiveByUserId.mockResolvedValue(
      Result.fail(new Error('No active plan')),
    );
    mockAIPlanGenerator.generatePlan.mockResolvedValue(Result.ok(mockPlan));
    mockPlanRepository.save.mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      userId,
      goals,
      customInstructions: 'Focus on upper body',
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.planId).toBe('plan-123');
      expect(result.value.name).toBe('Strength Plan');
    }
    expect(mockPlanRepository.save).toHaveBeenCalledWith(mockPlan);
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'PlanGenerated',
        userId,
        planId: 'plan-123',
      }),
    );
  });

  it('should fail if user profile is not found', async () => {
    // Arrange
    const userId = 'user-123';
    const goals = { goalType: 'strength', target: 'build muscle' };

    mockProfileRepository.findById.mockResolvedValue(
      Result.fail(new Error('User profile not found')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      goals,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe('User profile not found');
    }
  });

  it('should fail if user already has an active plan', async () => {
    // Arrange
    const userId = 'user-123';
    const goals = { goalType: 'strength', target: 'build muscle' };
    const mockActivePlan: FitnessPlan = {
      id: 'active-plan-456',
      userId,
      title: 'Active Plan',
      description: 'An active plan',
      planType: 'strength_program',
      goals,
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      weeks: [],
      status: 'active',
      currentPosition: { week: 1, day: 0 },
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockProfile: UserProfile = {
      id: 'profile-123',
      userId,
      experienceLevel: 'beginner',
      trainingConstraints: { equipment: [], injuries: [], timeConstraints: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProfileRepository.findById.mockResolvedValue(Result.ok(mockProfile));
    mockPlanRepository.findActiveByUserId.mockResolvedValue(Result.ok(mockActivePlan));

    // Act
    const result = await useCase.execute({
      userId,
      goals,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe(
        'User already has an active plan. Pause or abandon it first.',
      );
    }
  });

  it('should fail if AI plan generation fails', async () => {
    // Arrange
    const userId = 'user-123';
    const goals = { goalType: 'strength', target: 'build muscle' };
    const mockProfile: UserProfile = {
      id: 'profile-123',
      userId,
      experienceLevel: 'beginner',
      trainingConstraints: { equipment: [], injuries: [], timeConstraints: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProfileRepository.findById.mockResolvedValue(Result.ok(mockProfile));
    mockPlanRepository.findActiveByUserId.mockResolvedValue(
      Result.fail(new Error('No active plan')),
    );
    mockAIPlanGenerator.generatePlan.mockResolvedValue(
      Result.fail(new Error('AI generation failed')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      goals,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe(
        'Failed to generate plan: Error: AI generation failed',
      );
    }
  });

  it('should fail if saving the plan fails', async () => {
    // Arrange
    const userId = 'user-123';
    const goals = { goalType: 'strength', target: 'build muscle' };
    const mockProfile: UserProfile = {
      id: 'profile-123',
      userId,
      experienceLevel: 'beginner',
      trainingConstraints: { equipment: [], injuries: [], timeConstraints: [] },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockPlan: FitnessPlan = {
      id: 'plan-123',
      userId,
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals,
      progression: { strategy: 'linear' },
      constraints: { equipment: [], injuries: [], timeConstraints: [] },
      weeks: [],
      status: 'draft',
      currentPosition: { week: 1, day: 0 },
      startDate: new Date().toISOString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockProfileRepository.findById.mockResolvedValue(Result.ok(mockProfile));
    mockPlanRepository.findActiveByUserId.mockResolvedValue(
      Result.fail(new Error('No active plan')),
    );
    mockAIPlanGenerator.generatePlan.mockResolvedValue(Result.ok(mockPlan));
    mockPlanRepository.save.mockResolvedValue(Result.fail(new Error('Save failed')));

    // Act
    const result = await useCase.execute({
      userId,
      goals,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toBe('Failed to save plan: Error: Save failed');
    }
  });
});
