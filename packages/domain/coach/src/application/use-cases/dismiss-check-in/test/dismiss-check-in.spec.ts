import { describe, it, beforeEach, vi, expect, Mock } from 'vitest';
import { EventBus, Result } from '@bene/shared';

import { createCoachConversationFixture, createCheckInFixture } from '@/fixtures.js';
import { CoachConversationRepository } from '@/application/ports/coach-conversation-repository.js';

import { DismissCheckInUseCase } from '../dismiss-check-in.js';

// Mock repositories and services
const mockConversationRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  save: vi.fn(),
} as unknown as CoachConversationRepository;

const mockEventBus = {
  publish: vi.fn(),
} as unknown as EventBus;

describe('DismissCheckInUseCase', () => {
  let useCase: DismissCheckInUseCase;
  const TEST_USER_ID = crypto.randomUUID();
  const TEST_CHECK_IN_ID = crypto.randomUUID();
  const TEST_CONVERSATION_ID = crypto.randomUUID();

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new DismissCheckInUseCase(mockConversationRepository, mockEventBus);
  });

  it('should successfully dismiss a check-in', async () => {
    // Arrange
    const userId = TEST_USER_ID;
    const checkInId = TEST_CHECK_IN_ID;

    const mockCheckIn = createCheckInFixture({
      id: checkInId,
      status: 'pending',
    });

    const mockConversation = createCoachConversationFixture({
      id: TEST_CONVERSATION_ID,
      userId,
      checkIns: [mockCheckIn],
    });

    vi.mocked(mockConversationRepository.findByUserId).mockResolvedValue(
      Result.ok(mockConversation),
    );
    vi.mocked(mockConversationRepository.save).mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      userId,
      checkInId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.conversationId).toBe(TEST_CONVERSATION_ID);
      expect(result.value.dismissed).toBe(true);
    }
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'CheckInDismissed',
        userId,
        checkInId,
      }),
    );
  });

  it('should fail if conversation is not found', async () => {
    // Arrange
    const userId = TEST_USER_ID;
    const checkInId = TEST_CHECK_IN_ID;

    (mockConversationRepository.findByUserId as Mock).mockResolvedValue(
      Result.fail(new Error('Not found')),
    );

    // Act
    const result = await useCase.execute({
      userId,
      checkInId,
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
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBeInstanceOf(Error);
      expect((result.error as Error).message).toContain('Check-in');
    }
  });
});
