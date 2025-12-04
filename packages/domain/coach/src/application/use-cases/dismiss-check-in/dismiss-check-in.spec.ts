import { describe, it, beforeEach, vi, expect, Mock } from 'vitest';
import { EventBus, Result } from '@bene/shared-domain';
import { CoachingConversation, CheckIn } from '@core/index.js';
import { DismissCheckInUseCase } from './dismiss-check-in.js';
import { CoachingConversationRepository } from '../../repositories/coaching-conversation-repository.js';

// Mock repositories and services
const mockConversationRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  save: vi.fn(),
} as unknown as CoachingConversationRepository;

const mockEventBus = {
  publish: vi.fn(),
} as unknown as EventBus;

describe('DismissCheckInUseCase', () => {
  let useCase: DismissCheckInUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new DismissCheckInUseCase(mockConversationRepository, mockEventBus);
  });

  it('should successfully dismiss a check-in', async () => {
    // Arrange
    const userId = 'user-123';
    const checkInId = 'checkin-456';

    const mockCheckIn: CheckIn = {
      id: checkInId,
      type: 'proactive',
      question: 'How are you feeling today?',
      status: 'pending',
      createdAt: new Date(),
      triggeredBy: 'enjoyment_declining',
    } as CheckIn;

    const mockConversation: CoachingConversation = {
      id: 'conv-789',
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
        reportedInjuries: [],
      },
      messages: [],
      checkIns: [mockCheckIn],
      totalMessages: 0,
      totalUserMessages: 0,
      totalCoachMessages: 0,
      totalCheckIns: 1,
      pendingCheckIns: 1,
      startedAt: new Date(),
      lastMessageAt: new Date(),
      lastContextUpdateAt: new Date(),
    };

    mockConversationRepository.findByUserId.mockResolvedValue(
      Result.ok(mockConversation),
    );
    mockConversationRepository.save.mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      userId,
      checkInId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.conversationId).toBe('conv-789');
      expect(result.value.dismissed).toBe(true);
    }
    expect(mockEventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'CheckInDismissed',
        userId,
        checkInId,
      }),
    );
  });

  it('should fail if conversation is not found', async () => {
    // Arrange
    const userId = 'user-123';
    const checkInId = 'checkin-456';

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
    const userId = 'user-123';
    const checkInId = 'checkin-456';

    const mockConversation: CoachingConversation = {
      id: 'conv-789',
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
      checkIns: [], // No check-ins
      totalMessages: 0,
      totalUserMessages: 0,
      totalCoachMessages: 0,
      totalCheckIns: 0,
      pendingCheckIns: 0,
      startedAt: new Date(),
      lastMessageAt: new Date(),
      lastContextUpdateAt: new Date(),
    };

    mockConversationRepository.findByUserId.mockResolvedValue(
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
