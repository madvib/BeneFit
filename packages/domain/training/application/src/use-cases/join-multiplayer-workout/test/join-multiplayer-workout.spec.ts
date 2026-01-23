import { describe, it, expect, vi, beforeEach } from 'vitest';

import { Result, EventBus } from '@bene/shared';
import { WorkoutSessionCommands, toWorkoutSessionView } from '@bene/training-core';
import {
  createWorkoutSessionFixture,
  createSessionParticipantFixture,
} from '@bene/training-core/fixtures';

import { WorkoutSessionRepository } from '@/repositories/workout-session-repository.js';

import { JoinMultiplayerWorkoutUseCase } from '../join-multiplayer-workout.js';

vi.mock('@bene/training-core', async () => {
  const actual = await vi.importActual('@bene/training-core');
  return {
    ...(actual as any),
    WorkoutSessionCommands: {
      joinSession: vi.fn(),
    },
    toWorkoutSessionView: vi.fn((session) => session),
  };
});

describe('JoinMultiplayerWorkoutUseCase', () => {
  let useCase: JoinMultiplayerWorkoutUseCase;
  let sessionRepo: WorkoutSessionRepository;
  let eventBus: EventBus;

  beforeEach(() => {
    sessionRepo = {
      findById: vi.fn(),
      save: vi.fn().mockResolvedValue(Result.ok()),
    } as unknown as WorkoutSessionRepository;
    eventBus = {
      publish: vi.fn().mockResolvedValue(undefined),
      subscribe: vi.fn(),
    } as unknown as EventBus;

    useCase = new JoinMultiplayerWorkoutUseCase(sessionRepo, eventBus);
  });

  it('should join a multiplayer session successfully', async () => {
    const userId = crypto.randomUUID();
    const sessionId = crypto.randomUUID();

    const mockSession = createWorkoutSessionFixture({
      id: sessionId,
      ownerId: userId,
      configuration: { isMultiplayer: true, maxParticipants: 5, isPublic: true },
      participants: [],
    });

    vi.mocked(sessionRepo.findById).mockResolvedValue(Result.ok(mockSession));

    const joiningUserId = crypto.randomUUID();
    const joiningUserName = 'John Doe';
    const participant = createSessionParticipantFixture({
      userId: joiningUserId,
      userName: joiningUserName,
    });

    vi.mocked(WorkoutSessionCommands.joinSession).mockReturnValue(
      Result.ok({
        ...mockSession,
        participants: [participant],
      }),
    );

    const request = {
      userId: joiningUserId,
      userName: joiningUserName,
      sessionId: sessionId,
    };

    const result = await useCase.execute(request);

    expect(result.isSuccess).toBe(true);
    expect(result.value.session.id).toBe(sessionId);
    expect(result.value.session.participants).toHaveLength(1);

    expect(sessionRepo.save).toHaveBeenCalled();
    expect(eventBus.publish).toHaveBeenCalledWith(
      expect.objectContaining({
        eventName: 'UserJoinedWorkout',
      }),
    );
  });

  it('should fail if session not found', async () => {
    const sessionId = crypto.randomUUID();
    vi.mocked(sessionRepo.findById).mockResolvedValue(Result.fail(new Error('Not found')));

    const request = {
      userId: crypto.randomUUID(),
      userName: 'Jane Smith',
      sessionId,
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Session not found');
  });

  it('should fail if session is not multiplayer', async () => {
    const sessionId = crypto.randomUUID();
    const mockSession = createWorkoutSessionFixture({
      id: sessionId,
      configuration: { isMultiplayer: false },
    });
    vi.mocked(sessionRepo.findById).mockResolvedValue(Result.ok(mockSession));

    const request = {
      userId: crypto.randomUUID(),
      userName: 'Alice Johnson',
      sessionId,
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Session is not multiplayer');
  });

  it('should fail if session is private and user is not owner', async () => {
    const sessionId = crypto.randomUUID();
    const ownerId = crypto.randomUUID();
    const mockSession = createWorkoutSessionFixture({
      id: sessionId,
      ownerId,
      configuration: { isMultiplayer: true, isPublic: false },
    });
    vi.mocked(sessionRepo.findById).mockResolvedValue(Result.ok(mockSession));

    const request = {
      userId: crypto.randomUUID(),
      userName: 'Bob Williams',
      sessionId,
    };

    const result = await useCase.execute(request);

    expect(result.isFailure).toBe(true);
    expect((result.error as Error).message).toBe('Session is private');
  });
});
