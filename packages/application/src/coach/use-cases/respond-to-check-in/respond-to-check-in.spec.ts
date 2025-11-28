import { describe, it, beforeEach, vi, expect } from 'vitest';
import { Result } from '@bene/core/shared';
import { CoachingConversation, CheckIn } from '@bene/core/coach';
import { RespondToCheckInUseCase } from './respond-to-check-in';
import { CoachingConversationRepository } from '../../repositories/coaching-conversation-repository';
import { AICoachService } from '../../services/ai-coach-service';
import { EventBus } from '../../../shared/event-bus';

// Mock repositories and services
const mockConversationRepository = {
  findById: vi.fn(),
  findByUserId: vi.fn(),
  save: vi.fn(),
} as unknown as CoachingConversationRepository;

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

  beforeEach(() => {
    vi.clearAllMocks();
    useCase = new RespondToCheckInUseCase(
      mockConversationRepository,
      mockAICoachService,
      mockEventBus
    );
  });

  it('should successfully respond to a check-in', async () => {
    // Arrange
    const userId = 'user-123';
    const checkInId = 'checkin-456';
    const response = 'I feel great!';

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
        userGoals: { primary: 'strength', secondary: [], motivation: 'test', successCriteria: [] },
        userConstraints: { availableDays: [], availableEquipment: [], location: 'home' },
        experienceLevel: 'beginner',
        trends: { volumeTrend: 'stable', adherenceTrend: 'stable', energyTrend: 'medium', exertionTrend: 'stable', enjoymentTrend: 'stable' },
        daysIntoCurrentWeek: 0,
        workoutsThisWeek: 0,
        plannedWorkoutsThisWeek: 0,
        energyLevel: 'medium',
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

    const mockAnalysis = {
      analysis: 'User reports feeling great, positive sentiment detected',
      actions: [{ type: 'maintain_current_plan', details: 'Continue with current routine' }],
    };

    mockConversationRepository.findByUserId.mockResolvedValue(Result.ok(mockConversation));
    mockAICoachService.analyzeCheckInResponse.mockResolvedValue(Result.ok(mockAnalysis));
    mockConversationRepository.save.mockResolvedValue(Result.ok());

    // Act
    const result = await useCase.execute({
      userId,
      checkInId,
      response,
    });

    // Assert
    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.conversationId).toBe('conv-789');
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
        type: 'CheckInResponded',
        userId,
        checkInId,
        actionsApplied: 1,
      })
    );
  });

  it('should fail if conversation is not found', async () => {
    // Arrange
    const userId = 'user-123';
    const checkInId = 'checkin-456';
    const response = 'I feel great!';

    mockConversationRepository.findByUserId.mockResolvedValue(Result.fail(new Error('Not found')));

    // Act
    const result = await useCase.execute({
      userId,
      checkInId,
      response,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBe('Conversation not found');
    }
  });

  it('should fail if check-in is not found', async () => {
    // Arrange
    const userId = 'user-123';
    const checkInId = 'checkin-456';
    const response = 'I feel great!';

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

    mockConversationRepository.findByUserId.mockResolvedValue(Result.ok(mockConversation));

    // Act
    const result = await useCase.execute({
      userId,
      checkInId,
      response,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBe('Check-in not found');
    }
  });

  it('should fail if check-in is already responded to', async () => {
    // Arrange
    const userId = 'user-123';
    const checkInId = 'checkin-456';
    const response = 'I feel great!';

    const mockCheckIn: CheckIn = {
      id: checkInId,
      type: 'proactive',
      question: 'How are you feeling today?',
      status: 'responded', // Already responded
      createdAt: new Date(),
      triggeredBy: 'enjoyment_declining',
    } as CheckIn;

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
      messages: [],
      checkIns: [mockCheckIn],
      totalMessages: 0,
      totalUserMessages: 0,
      totalCoachMessages: 0,
      totalCheckIns: 1,
      pendingCheckIns: 0,
      startedAt: new Date(),
      lastMessageAt: new Date(),
      lastContextUpdateAt: new Date(),
    };

    mockConversationRepository.findByUserId.mockResolvedValue(Result.ok(mockConversation));

    // Act
    const result = await useCase.execute({
      userId,
      checkInId,
      response,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toBe('Check-in already responded to');
    }
  });

  it('should fail if AI analysis fails', async () => {
    // Arrange
    const userId = 'user-123';
    const checkInId = 'checkin-456';
    const response = 'I feel great!';

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
        userGoals: { primary: 'strength', secondary: [], motivation: 'test', successCriteria: [] },
        userConstraints: { availableDays: [], availableEquipment: [], location: 'home' },
        experienceLevel: 'beginner',
        trends: { volumeTrend: 'stable', adherenceTrend: 'stable', energyTrend: 'medium', exertionTrend: 'stable', enjoymentTrend: 'stable' },
        daysIntoCurrentWeek: 0,
        workoutsThisWeek: 0,
        plannedWorkoutsThisWeek: 0,
        energyLevel: 'medium',
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

    mockConversationRepository.findByUserId.mockResolvedValue(Result.ok(mockConversation));
    mockAICoachService.analyzeCheckInResponse.mockResolvedValue(Result.fail(new Error('AI analysis failed')));

    // Act
    const result = await useCase.execute({
      userId,
      checkInId,
      response,
    });

    // Assert
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error).toContain('AI analysis failed');
    }
  });
});