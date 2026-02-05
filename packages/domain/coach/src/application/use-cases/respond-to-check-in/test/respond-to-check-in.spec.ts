import { describe, it, beforeEach, vi, expect } from 'vitest';

import { Result, type EventBus } from '@bene/shared';

import {
  createCoachConversationFixture,
  createCheckInFixture,
  createCoachActionFixture,
} from '@/fixtures.js';
import { CoachConversationRepository } from '@/application/ports/coach-conversation-repository.js';
import { AICoachService } from '@/application/services/ai-coach-service.js';
import { RespondToCheckInUseCase } from '../respond-to-check-in.js';

// Mock repositories and services
const mockConversationRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  save: vi.fn(),
} as unknown as CoachConversationRepository;

const mockAICoachService = {
  getResponse: vi.fn(),
  generateCheckInQuestion: vi.fn(),
  analyzeCheckInResponse: vi.fn(),
  generateWeeklySummary: vi.fn(),
} as unknown as AICoachService;

const mockEventBus = {
  publish: vi.fn(),
} as unknown as EventBus;

describe('RespondToCheckInUseCase', () => {
  let useCase: RespondToCheckInUseCase;
  const TEST_USER_ID = crypto.randomUUID();
  const TEST_CHECK_IN_ID = crypto.randomUUID();
  const TEST_CONVERSATION_ID = crypto.randomUUID();

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new RespondToCheckInUseCase(
      mockConversationRepository,
      mockAICoachService,
      mockEventBus,
    );
  });

  it('should successfully respond to a check-in', async () => {
    // Arrange
    const userId = TEST_USER_ID;
    const checkInId = TEST_CHECK_IN_ID;
    const response = 'Sample user response to check-in';

    const mockCheckIn = createCheckInFixture({
      id: checkInId,
      status: 'pending',
    });

    const mockConversation = createCoachConversationFixture({
      id: TEST_CONVERSATION_ID,
      userId,
      checkIns: [mockCheckIn],
    });

    const mockAnalysis = {
      analysis: 'Analysis of the user\'s check-in response',
      actions: [
        createCoachActionFixture({
          type: 'encouraged',
          details: 'Details about the encouragement provided',
          appliedAt: new Date(),
        }),
      ],
    };

    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.ok(mockConversation),
    );
    vi.mocked(mockAICoachService.analyzeCheckInResponse).mockResolvedValue(
      Result.ok(mockAnalysis),
    );
    vi.mocked(mockConversationRepository.save).mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      userId,
      checkInId,
      response,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.conversationId).toBe(TEST_CONVERSATION_ID);
      expect(result.value.coachAnalysis).toBe(mockAnalysis.analysis);
      expect(result.value.actions).toHaveLength(1);
    }
    expect(mockAICoachService.analyzeCheckInResponse).toHaveBeenCalledWith({
      checkIn: mockCheckIn,
      userResponse: response,
      context: mockConversation.context,
    });
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'CheckInResponded',
        userId,
        checkInId,
        actionsApplied: 1,
      }),
    );
  });

  it('should fail if conversation is not found', async () => {
    // Arrange
    const userId = TEST_USER_ID;
    const checkInId = TEST_CHECK_IN_ID;
    const response = 'I feel great!';

    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.fail(new Error('Conversation not found')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      checkInId,
      response,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Conversation not found');
    }
  });

  it('should fail if check-in is not found', async () => {
    // Arrange
    const userId = TEST_USER_ID;
    const checkInId = TEST_CHECK_IN_ID;
    const response = 'I feel great!';

    const mockConversation = createCoachConversationFixture({
      userId,
      checkIns: [], // No check-ins
    });

    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.ok(mockConversation),
    );

    // Act
    const result = await useCase.execute({
      userId,
      checkInId,
      response,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Check-in not found');
    }
  });

  it('should fail if check-in is already responded to', async () => {
    // Arrange
    const userId = TEST_USER_ID;
    const checkInId = TEST_CHECK_IN_ID;
    const response = 'I feel great!';

    const mockCheckIn = createCheckInFixture({
      id: checkInId,
      status: 'responded',
    });

    const mockConversation = createCoachConversationFixture({
      userId,
      checkIns: [mockCheckIn],
    });

    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.ok(mockConversation),
    );

    // Act
    const result = await useCase.execute({
      userId,
      checkInId,
      response,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toBe('Check-in already responded to');
    }
  });

  it('should fail if AI analysis fails', async () => {
    // Arrange
    const userId = TEST_USER_ID;
    const checkInId = TEST_CHECK_IN_ID;
    const response = 'I feel great!';

    const mockCheckIn = createCheckInFixture({
      id: checkInId,
      status: 'pending',
    });

    const mockConversation = createCoachConversationFixture({
      userId,
      checkIns: [mockCheckIn],
    });

    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.ok(mockConversation),
    );
    vi.mocked(mockAICoachService.analyzeCheckInResponse).mockResolvedValue(
      Result.fail(new Error('AI analysis failed')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      checkInId,
      response,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toContain('AI analysis failed');
    }
  });
});
