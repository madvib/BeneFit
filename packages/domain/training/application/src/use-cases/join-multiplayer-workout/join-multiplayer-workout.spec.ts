import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Result, EventBus } from '@bene/shared';
import { WorkoutSessionRepository } from '../../repositories/workout-session-repository.js';
import { JoinMultiplayerWorkoutUseCase } from './join-multiplayer-workout.js';
import * as workoutsDomain from '@bene/training-core';

vi.mock('@bene/training-core', () => ({
  WorkoutSessionCommands: {
    joinSession: vi.fn(),
  },
}));

describe('JoinMultiplayerWorkoutUseCase', () => {
  let useCase: JoinMultiplayerWorkoutUseCase;
  let sessionRepo: WorkoutSessionRepository;
  let eventBus: EventBus;

  beforeEach(() => {
    sessionRepo = {
      findById: vi.fn(),
      save: vi.fn().mockResolvedValue(Result.ok()),
    };
    eventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
    };

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
    sessionRepo.findById.mockResolvedValue(Result.ok(mockSession));
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
    expect(sessionRepo.save).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'UserJoinedWorkout',
      }),
    );
  });

  it('should fail if session not found', async () => {
    sessionRepo.findById.mockResolvedValue(Result.fail('Not found'));

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
    sessionRepo.findById.mockResolvedValue(Result.ok(mockSession));

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
    sessionRepo.findById.mockResolvedValue(Result.ok(mockSession));

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
