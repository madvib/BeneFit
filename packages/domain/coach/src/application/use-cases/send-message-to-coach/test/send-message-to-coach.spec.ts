import { describe, it, beforeEach, vi, expect } from 'vitest';

import { Result, EventBus } from '@bene/shared';

import { createCoachConversationFixture, createCoachContextFixture, createCoachActionFixture } from '@/fixtures.js';

import { CoachConversationRepository } from '../../../ports/coach-conversation-repository.js';
import { CoachContextBuilder, AICoachService } from '../../../services/index.js';
import { SendMessageToCoachUseCase } from '../send-message-to-coach.js';

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
  const TEST_USER_ID = crypto.randomUUID();
  const TEST_CONVERSATION_ID = crypto.randomUUID();

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
    const userId = TEST_USER_ID;
    const message = 'Sample user message to coach';

    const mockConversation = createCoachConversationFixture({
      id: TEST_CONVERSATION_ID,
      userId,
    });

    const mockAIResponse = {
      message: 'Sample coach response message',
      actions: [
        createCoachActionFixture({
          type: 'adjusted_plan' as const,
          details: 'Details about the adjusted plan',
          appliedAt: new Date(),
        }),
      ],
      suggestedFollowUps: ['Would you like to discuss this further?'],
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
    if (result.isSuccess) {
      expect(result.value.conversationId).toBe(TEST_CONVERSATION_ID);
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
        conversationId: TEST_CONVERSATION_ID,
      }),
    );
  });

  it('should create a new conversation if none exists for user', async () => {
    // Arrange
    const userId = TEST_USER_ID;
    const message = 'Hello coach!';

    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.fail(new Error('Not found')),
    );

    const mockContext = createCoachContextFixture();

    vi.mocked(mockContextBuilder.buildContext).mockResolvedValue(Result.ok(mockContext));

    const mockAIResponse = {
      message: 'Hello! How can I help you today?',
      actions: [],
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
    const userId = TEST_USER_ID;
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
    const userId = TEST_USER_ID;
    const message = 'Hello coach!';

    const mockConversation = createCoachConversationFixture({
      userId,
    });

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
