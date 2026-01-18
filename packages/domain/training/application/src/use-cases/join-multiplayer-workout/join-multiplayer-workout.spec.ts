import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result, EventBus } from '@bene/shared';
import { WorkoutSessionRepository } from '../../repositories/workout-session-repository.js';
import { JoinMultiplayerWorkoutUseCase } from './join-multiplayer-workout.js';
import * as workoutsDomain from '@bene/training-core';

vi.mock('@bene/training-core', () => ({
  WorkoutSessionCommands: {
    joinSession: vi.fn(),
  },
  toWorkoutSessionSchema: vi.fn((session) => session),
}));

describe('JoinMultiplayerWorkoutUseCase', () => {
  let useCase: JoinMultiplayerWorkoutUseCase;
  let sessionRepo: WorkoutSessionRepository;
  let eventBus: EventBus;

  beforeEach(() => {
    sessionRepo = {
      findById: vi.fn(),
      save: vi.fn().mockResolvedValue(Result.ok()),
    } as any;
    eventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
    } as any;

    useCase = new JoinMultiplayerWorkoutUseCase(sessionRepo, eventBus);
  });

  it('should join a multiplayer session successfully', async () => {
    const mockSession = {
      id: 'session-1',
      ownerId: 'user-1',
      configuration: { isMultiplayer: true, maxParticipants: 5, isPublic: true },
      participants: [],
      activities: [{ activityType: 'run', instructions: 'Run' }],
      currentActivityIndex: 0,
    };
    vi.mocked(sessionRepo.findById).mockResolvedValue(Result.ok(mockSession as any));
    vi.mocked(workoutsDomain.WorkoutSessionCommands.joinSession).mockReturnValue(
      Result.ok({
        ...mockSession,
        participants: [{ userId: 'user-2', userName: 'User 2' }],
      }),
    );

    const request = {
      userId: 'user-2',
      userName: 'User 2',
      sessionId: 'session-1',
    };

    const result = await useCase.execute(request);

    expect(result.isSuccess).toBe(true);
    expect(result.value.session.id).toBe('session-1');
    expect(result.value.session.participants).toHaveLength(2);

    expect(sessionRepo.save).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'UserJoinedWorkout',
      }),
    );
  });

  it('should fail if session not found', async () => {
    vi.mocked(sessionRepo.findById).mockResolvedValue(Result.fail(new Error('Not found')));

    const request = {
      userId: 'user-2',
      userName: 'User 2',
      sessionId: 'session-1',
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Session not found');
  });

  it('should fail if session is not multiplayer', async () => {
    const mockSession = {
      id: 'session-1',
      configuration: { isMultiplayer: false },
    };
    vi.mocked(sessionRepo.findById).mockResolvedValue(Result.ok(mockSession as any));

    const request = {
      userId: 'user-2',
      userName: 'User 2',
      sessionId: 'session-1',
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Session is not multiplayer');
  });

  it('should fail if session is private and user is not owner', async () => {
    const mockSession = {
      id: 'session-1',
      ownerId: 'user-1',
      configuration: { isMultiplayer: true, isPublic: false },
    };
    vi.mocked(sessionRepo.findById).mockResolvedValue(Result.ok(mockSession as any));

    const request = {
      userId: 'user-2',
      userName: 'User 2',
      sessionId: 'session-1',
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Session is private');
  });
});
