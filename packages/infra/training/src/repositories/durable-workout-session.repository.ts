import { Result } from '@bene/shared-domain';
import type { WorkoutSession } from '@bene/training-core';
import type { WorkoutSessionRepository } from '@bene/training-application';
import {
  QueryError,
  SaveError,
  DeleteError,
  EntityNotFoundError,
} from '@bene/shared-infra';

/**
 * WorkoutSession repository - lives in Durable Object
 * Implementation is different from D1-based repos
 */
export class DurableWorkoutSessionRepository implements WorkoutSessionRepository {
  constructor(private workoutSessionNamespace: DurableObjectNamespace) {}

  async findById(sessionId: string): Promise<Result<WorkoutSession>> {
    try {
      const stub = this.getSessionStub(sessionId);
      const response = await stub.fetch('https://do/status');

      if (!response.ok) {
        const error = await response.text();
        return Result.fail(new QueryError('fetch', 'WorkoutSession', new Error(error)));
      }

      const data = (await response.json()) as { hasSession: boolean };

      if (!data.hasSession) {
        return Result.fail(new EntityNotFoundError('WorkoutSession', sessionId));
      }

      // Note: This returns partial data. For full session, need different endpoint
      return Result.fail(
        new QueryError(
          'access',
          'WorkoutSession',
          new Error('Use REST endpoints or WebSocket for full session access'),
        ),
      );
    } catch (error) {
      return Result.fail(
        new QueryError(
          'fetch',
          'WorkoutSession',
          error instanceof Error ? error : new Error(String(error)),
        ),
      );
    }
  }

  async findActiveByUserId(userId: string): Promise<Result<WorkoutSession>> {
    // This would require indexing sessions by userId
    // For now, sessions are only accessible by sessionId
    return Result.fail(
      new QueryError(
        'findActiveByUserId',
        'WorkoutSession',
        new Error('Not implemented - sessions are accessed by sessionId'),
      ),
    );
  }

  async save(session: WorkoutSession): Promise<Result<void>> {
    try {
      const stub = this.getSessionStub(session.id);

      // Determine which endpoint based on session state
      let endpoint = 'https://do/start';

      if (session.state === 'in_progress' && session.startedAt) {
        // Update existing session (not common - usually done via WebSocket)
        endpoint = 'https://do/update';
      }

      const response = await stub.fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(session),
      });

      if (!response.ok) {
        const error = await response.text();
        return Result.fail(
          new SaveError('WorkoutSession', session.id, new Error(error)),
        );
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new SaveError(
          'WorkoutSession',
          session.id,
          error instanceof Error ? error : new Error(String(error)),
        ),
      );
    }
  }

  async delete(sessionId: string): Promise<Result<void>> {
    try {
      const stub = this.getSessionStub(sessionId);
      const response = await stub.fetch('https://do/abandon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Deleted by user' }),
      });

      if (!response.ok) {
        const error = await response.text();
        return Result.fail(
          new DeleteError('WorkoutSession', sessionId, new Error(error)),
        );
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new DeleteError(
          'WorkoutSession',
          sessionId,
          error instanceof Error ? error : new Error(String(error)),
        ),
      );
    }
  }

  // Helper methods for session lifecycle

  async startSession(session: WorkoutSession): Promise<Result<void>> {
    try {
      const stub = this.getSessionStub(session.id);
      const response = await stub.fetch('https://do/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: session.ownerId,
          userName: 'User', // Would come from profile
          workoutType: session.workoutType,
          activities: session.activities,
          isMultiplayer: session.configuration.isMultiplayer,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return Result.fail(new QueryError('start', 'WorkoutSession', new Error(error)));
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new QueryError(
          'start',
          'WorkoutSession',
          error instanceof Error ? error : new Error(String(error)),
        ),
      );
    }
  }

  async pauseSession(sessionId: string): Promise<Result<void>> {
    try {
      const stub = this.getSessionStub(sessionId);
      const response = await stub.fetch('https://do/pause', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.text();
        return Result.fail(new QueryError('pause', 'WorkoutSession', new Error(error)));
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new QueryError(
          'pause',
          'WorkoutSession',
          error instanceof Error ? error : new Error(String(error)),
        ),
      );
    }
  }

  async resumeSession(sessionId: string): Promise<Result<void>> {
    try {
      const stub = this.getSessionStub(sessionId);
      const response = await stub.fetch('https://do/resume', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.text();
        return Result.fail(
          new QueryError('resume', 'WorkoutSession', new Error(error)),
        );
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new QueryError(
          'resume',
          'WorkoutSession',
          error instanceof Error ? error : new Error(String(error)),
        ),
      );
    }
  }

  async completeSession(sessionId: string): Promise<Result<void>> {
    try {
      const stub = this.getSessionStub(sessionId);
      const response = await stub.fetch('https://do/complete', {
        method: 'POST',
      });

      if (!response.ok) {
        const error = await response.text();
        return Result.fail(
          new QueryError('complete', 'WorkoutSession', new Error(error)),
        );
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new QueryError(
          'complete',
          'WorkoutSession',
          error instanceof Error ? error : new Error(String(error)),
        ),
      );
    }
  }

  // WebSocket connection helper
  getWebSocketUrl(sessionId: string): string {
    // This would be called by frontend to get WebSocket URL
    return `wss://api.bene.fit/api/workouts/${sessionId}/live`;
  }

  private getSessionStub(sessionId: string): DurableObjectStub {
    const id = this.workoutSessionNamespace.idFromName(sessionId);
    return this.workoutSessionNamespace.get(id);
  }
}

interface DurableObjectStub {
  fetch(input: RequestInfo, init?: RequestInit): Promise<Response>;
}

interface DurableObjectNamespace {
  idFromName(name: string): DurableObjectId;
  idFromString(id: string): DurableObjectId;
  get(id: DurableObjectId): DurableObjectStub;
}

interface DurableObjectId {
  toString(): string;
  equals(other: DurableObjectId): boolean;
}
