import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result, EventBus } from '@bene/shared';
import { CoachConversation, CoachAction } from '../../../../core/index.js';
import { SendMessageToCoachUseCase } from '../send-message-to-coach.js';
import { CoachConversationRepository } from '../../../ports/coach-conversation-repository.js';
import { CoachContextBuilder, AICoachService } from '../../../services/index.js';

// Mock repositories and services
const mockConversationRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  save: vi.fn(),
} as unknown as CoachConversationRepository;

const mockContextBuilder = {
  buildContext: vi.fn(),
} as unknown as CoachContextBuilder;

const mockAICoachService = {
  getResponse: vi.fn(),
  generateCheckInQuestion: vi.fn(),
  analyzeCheckInResponse: vi.fn(),
  generateWeeklySummary: vi.fn(),
} as unknown as AICoachService;

const mockEventBus = {
  publish: vi.fn(),
} as unknown as EventBus;

describe('SendMessageToCoachUseCase', () => {
  let useCase: SendMessageToCoachUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new SendMessageToCoachUseCase(
      mockConversationRepository,
      mockContextBuilder,
      mockAICoachService,
      mockEventBus,
    );
  });

  it('should successfully send a message to coach when conversation exists', async () => {
    // Arrange
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    const message = 'I need help with my workout plan';

    const mockConversation: CoachConversation = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      userId,
      context: {
        recentWorkouts: [],
        userGoals: {
          primary: 'strength',
          secondary: [],
          motivation: 'test',
          successCriteria: [],
        },
        userConstraints: {
          availableDays: [],
          availableEquipment: [],
          location: 'home' as const,
        },
        experienceLevel: 'beginner' as const,
        trends: {
          volumeTrend: 'stable',
          adherenceTrend: 'stable',
          energyTrend: 'medium',
          exertionTrend: 'stable',
          enjoymentTrend: 'stable',
        } as const,
        daysIntoCurrentWeek: 0,
        workoutsThisWeek: 0,
        plannedWorkoutsThisWeek: 0,
        energyLevel: 'medium',
      },
      messages: [],
      checkIns: [],
      totalMessages: 0,
      totalUserMessages: 0,
      totalCoachMessages: 0,
      totalCheckIns: 0,
      pendingCheckIns: 0,
      startedAt: new Date(),
      lastMessageAt: new Date(),
      lastContextUpdateAt: new Date(),
    } as unknown as CoachConversation;

    const mockAIResponse = {
      message:
        'I understand you need help with your workout plan. Can you tell me more about your goals?',
      actions: [
        {
          type: 'adjusted_plan' as const,
          details: 'Schedule a strength workout for tomorrow',
          appliedAt: new Date(),
        },
      ] as CoachAction[],
      suggestedFollowUps: ['What are your specific goals?'],
    };

    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.ok(mockConversation),
    );
    vi.mocked(mockAICoachService.getResponse).mockResolvedValue(Result.ok(mockAIResponse));
    vi.mocked(mockConversationRepository.save).mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      userId,
      message,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (!result.isSuccess) {
      console.log('Test Failure Error:', result.error);
    }
    if (result.isSuccess) {
      expect(result.value.conversationId).toBe('550e8400-e29b-41d4-a716-446655440001');
      expect(result.value.coachResponse).toBe(mockAIResponse.message);
      expect(result.value.actions).toHaveLength(1);
      expect(result.value.suggestedFollowUps).toHaveLength(1);
    }
    expect(mockAICoachService.getResponse).toHaveBeenCalledWith(
      expect.objectContaining({
        userMessage: message,
      }),
    );
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'CoachMessageSent',
        userId,
        conversationId: '550e8400-e29b-41d4-a716-446655440001',
      }),
    );
  });

  it('should create a new conversation if none exists for user', async () => {
    // Arrange
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    const message = 'Hello coach!';

    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.fail(new Error('Not found')),
    );

    const mockContext = {
      recentWorkouts: [],
      userGoals: {
        primary: 'strength' as const,
        secondary: [],
        motivation: 'test',
        successCriteria: [],
      },
      userConstraints: { availableDays: [], availableEquipment: [], location: 'home' as const },
      experienceLevel: 'beginner' as const,
      trends: {
        volumeTrend: 'stable',
        adherenceTrend: 'stable',
        energyTrend: 'medium',
        exertionTrend: 'stable',
        enjoymentTrend: 'stable',
      },
      daysIntoCurrentWeek: 0,
      workoutsThisWeek: 0,
      plannedWorkoutsThisWeek: 0,
      energyLevel: 'medium',
    };

    vi.mocked(mockContextBuilder.buildContext).mockResolvedValue(Result.ok(mockContext));

    const mockAIResponse = {
      message:
        "Hi! I'm your AI coach. I'm here to help you reach your fitness goals. What brings you here today?",
      actions: [] as CoachAction[],
      suggestedFollowUps: [],
    };

    vi.mocked(mockAICoachService.getResponse).mockResolvedValue(Result.ok(mockAIResponse));
    vi.mocked(mockConversationRepository.save).mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      userId,
      message,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    expect(mockContextBuilder.buildContext).toHaveBeenCalledWith(userId);
    expect(mockConversationRepository.save).toHaveBeenCalled();
  });

  it('should fail if context building fails', async () => {
    // Arrange
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    const message = 'Hello coach!';

    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.fail(new Error('Not found')),
    );
    vi.mocked(mockContextBuilder.buildContext).mockResolvedValue(
      Result.fail(new Error('Failed to build coaching context')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      message,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Failed to build coaching context: Error: Failed to build coaching context');
    }
  });

  it('should fail if AI coach is unavailable', async () => {
    // Arrange
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    const message = 'Hello coach!';

    const mockConversation: CoachConversation = {
      id: '550e8400-e29b-41d4-a716-446655440001',
      userId,
      context: {
        recentWorkouts: [],
        userGoals: {
          primary: 'strength',
          secondary: [],
          motivation: 'test',
          successCriteria: [],
        },
        userConstraints: {
          availableDays: [],
          availableEquipment: [],
          location: 'home',
        },
        experienceLevel: 'beginner',
        trends: {
          volumeTrend: 'stable',
          adherenceTrend: 'stable',
          energyTrend: 'medium',
          exertionTrend: 'stable',
          enjoymentTrend: 'stable',
        },
        daysIntoCurrentWeek: 0,
        workoutsThisWeek: 0,
        plannedWorkoutsThisWeek: 0,
        energyLevel: 'medium',
      },
      messages: [],
      checkIns: [],
      totalMessages: 0,
      totalUserMessages: 0,
      totalCoachMessages: 0,
      totalCheckIns: 0,
      pendingCheckIns: 0,
      startedAt: new Date(),
      lastMessageAt: new Date(),
      lastContextUpdateAt: new Date(),
    };

    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.ok(mockConversation),
    );
    vi.mocked(mockAICoachService.getResponse).mockResolvedValue(
      Result.fail(new Error('AI unavailable')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      message,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toContain('AI unavailable');
    }
  });
});
