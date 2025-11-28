import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/core/shared';
import { CoachingConversation, CoachingMessage } from '@bene/core/coach';
import { GetCoachingHistoryUseCase } from './get-coaching-history';
import { CoachingConversationRepository } from '../../repositories/coaching-conversation-repository';

// Mock repositories and services
const mockConversationRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  save: vi.fn(),
} as unknown as CoachingConversationRepository;

describe('GetCoachingHistoryUseCase', () => {
  let useCase: GetCoachingHistoryUseCase;

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new GetCoachingHistoryUseCase(
      mockConversationRepository
    );
  });

  it('should successfully retrieve coaching history', async () => {
    // Arrange
    const userId = 'user-123';

    const mockMessage: CoachingMessage = {
      id: 'msg-123',
      role: 'user',
      content: 'Hello coach!',
      timestamp: new Date(),
    } as CoachingMessage;

    const mockCheckIn = {
      id: 'checkin-456',
      type: 'proactive',
      question: 'How are you feeling today?',
      status: 'pending',
      createdAt: new Date(),
      triggeredBy: 'enjoyment_declining',
    };

    const mockConversation: CoachingConversation = {
      id: 'conv-789',
      userId,
      context: { 
        recentWorkouts: [],
        userGoals: { primary: 'strength', secondary: [], motivation: 'test', successCriteria: [] },
        userConstraints: { availableDays: [], availableEquipment: [], location: 'home' },
        experienceLevel: 'beginner',
        trends: { volumeTrend: 'stable', adherenceTrend: 'stable', energyTrend: 'medium', exertionTrend: 'stable', enjoymentTrend: 'stable' },
        daysIntoCurrentWeek: 0,
        workoutsThisWeek: 0,
        plannedWorkoutsThisWeek: 0,
        energyLevel: 'medium',
      },
      messages: [mockMessage],
      checkIns: [mockCheckIn],
      totalMessages: 1,
      totalUserMessages: 1,
      totalCoachMessages: 0,
      totalCheckIns: 1,
      pendingCheckIns: 1,
      startedAt: new Date(),
      lastMessageAt: new Date(),
      lastContextUpdateAt: new Date(),
    };

    mockConversationRepository.findByUserId.mockResolvedValue(Result.ok(mockConversation));

    // Act
    const result = await useCase.execute({
      userId,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.messages).toHaveLength(1);
      expect(result.value.pendingCheckIns).toHaveLength(1);
      expect(result.value.stats.totalMessages).toBe(1);
      expect(result.value.stats.totalCheckIns).toBe(1);
      expect(result.value.stats.actionsApplied).toBe(0);
    }
  });

  it('should successfully retrieve coaching history with limit', async () => {
    // Arrange
    const userId = 'user-123';
    const limit = 5;

    // Create multiple messages
    const messages: CoachingMessage[] = [];
    for (let i = 0; i < 10; i++) {
      messages.push({
        id: `msg-${i}`,
        role: i % 2 === 0 ? 'user' : 'coach',
        content: `Message ${i}`,
        timestamp: new Date(),
      } as CoachingMessage);
    }

    const mockCheckIn = {
      id: 'checkin-456',
      type: 'proactive',
      question: 'How are you feeling today?',
      status: 'pending',
      createdAt: new Date(),
      triggeredBy: 'enjoyment_declining',
    };

    const mockConversation: CoachingConversation = {
      id: 'conv-789',
      userId,
      context: { 
        recentWorkouts: [],
        userGoals: { primary: 'strength', secondary: [], motivation: 'test', successCriteria: [] },
        userConstraints: { availableDays: [], availableEquipment: [], location: 'home' },
        experienceLevel: 'beginner',
        trends: { volumeTrend: 'stable', adherenceTrend: 'stable', energyTrend: 'medium', exertionTrend: 'stable', enjoymentTrend: 'stable' },
        daysIntoCurrentWeek: 0,
        workoutsThisWeek: 0,
        plannedWorkoutsThisWeek: 0,
        energyLevel: 'medium',
      },
      messages,
      checkIns: [mockCheckIn],
      totalMessages: 10,
      totalUserMessages: 5,
      totalCoachMessages: 5,
      totalCheckIns: 1,
      pendingCheckIns: 1,
      startedAt: new Date(),
      lastMessageAt: new Date(),
      lastContextUpdateAt: new Date(),
    };

    mockConversationRepository.findByUserId.mockResolvedValue(Result.ok(mockConversation));

    // Act
    const result = await useCase.execute({
      userId,
      limit,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.messages).toHaveLength(limit); // Should be limited to 5
      expect(result.value.pendingCheckIns).toHaveLength(1);
    }
  });

  it('should fail if conversation is not found', async () => {
    // Arrange
    const userId = 'user-123';

    mockConversationRepository.findByUserId.mockResolvedValue(Result.fail(new Error('Not found')));

    // Act
    const result = await useCase.execute({
      userId,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toBe('No coaching history found');
    }
  });
});