import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/shared';
import { createFitnessPlanFixture } from '@bene/training-core';
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
    const goals = { primary: 'strength' as const, secondary: [], targetMetrics: {} };
    const mockProfile: UserProfile = {
      id: userId,
      userId,
      experienceLevel: 'beginner',
      trainingConstraints: {
        availableDays: ['monday', 'wednesday', 'friday'],
        availableEquipment: [],
        injuries: [],
        location: 'home',
        maxDuration: 60,
        timeConstraints: []
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockPlan = createFitnessPlanFixture({
      id: 'plan-123',
      userId,
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals,
      status: 'draft',
    });

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(mockProfile));
    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(
      Result.fail(new Error('No active plan')),
    );
    vi.mocked(mockAIPlanGenerator.generatePlan).mockResolvedValue(Result.ok(mockPlan));
    vi.mocked(mockPlanRepository.save).mockResolvedValue(Result.ok());

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
        eventName: 'PlanGenerated',
        userId,
        planId: 'plan-123',
      }),
    );
  });

  it('should fail if user profile is not found', async () => {
    // Arrange
    const userId = 'user-123';
    const goals = { primary: 'strength' as const, secondary: [], targetMetrics: {} };

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(
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
    const goals = { primary: 'strength' as const, secondary: [], targetMetrics: {} };
    const mockActivePlan = createFitnessPlanFixture({
      id: 'active-plan-456',
      userId,
      status: 'active',
      goals,
    });

    const mockProfile: UserProfile = {
      id: 'profile-123',
      userId,
      experienceLevel: 'beginner',
      trainingConstraints: {
        availableDays: ['monday', 'wednesday', 'friday'],
        availableEquipment: [],
        injuries: [],
        location: 'home',
        maxDuration: 60,
        timeConstraints: []
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(mockProfile));
    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(Result.ok(mockActivePlan));

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
    const goals = { primary: 'strength' as const, secondary: [], targetMetrics: {} };
    const mockProfile: UserProfile = {
      id: 'profile-123',
      userId,
      experienceLevel: 'beginner',
      trainingConstraints: {
        availableDays: ['monday', 'wednesday', 'friday'],
        availableEquipment: [],
        injuries: [],
        location: 'home',
        maxDuration: 60,
        timeConstraints: []
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(mockProfile));
    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(
      Result.fail(new Error('No active plan')),
    );
    vi.mocked(mockAIPlanGenerator.generatePlan).mockResolvedValue(
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
    const goals = { primary: 'strength' as const, secondary: [], targetMetrics: {} };
    const mockProfile: UserProfile = {
      id: 'profile-123',
      userId,
      experienceLevel: 'beginner',
      trainingConstraints: {
        availableDays: ['monday', 'wednesday', 'friday'],
        availableEquipment: [],
        injuries: [],
        location: 'home',
        maxDuration: 60,
        timeConstraints: []
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const mockPlan = createFitnessPlanFixture({
      id: 'plan-123',
      userId,
      title: 'Strength Plan',
      description: 'A plan for building strength',
      planType: 'strength_program',
      goals,
      status: 'draft',
    });

    vi.mocked(mockProfileRepository.findById).mockResolvedValue(Result.ok(mockProfile));
    vi.mocked(mockPlanRepository.findActiveByUserId).mockResolvedValue(
      Result.fail(new Error('No active plan')),
    );
    vi.mocked(mockAIPlanGenerator.generatePlan).mockResolvedValue(Result.ok(mockPlan));
    vi.mocked(mockPlanRepository.save).mockResolvedValue(Result.fail(new Error('Save failed')));

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
