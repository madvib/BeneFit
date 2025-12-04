import { Result } from '@bene/domain';
import type { WorkoutSession } from '@bene/domain/workouts';
import type { WorkoutSessionRepository } from '@bene/application/workouts';

/**
 * WorkoutSession repository - lives in Durable Object
 * Implementation is different from D1-based repos
 */
export class DOWorkoutSessionRepository implements WorkoutSessionRepository {
  constructor(
    private workoutSessionNamespace: DurableObjectNamespace,
  ) {}

  async findById(sessionId: string): Promise<Result<WorkoutSession>> {
    try {
      const stub = this.getSessionStub(sessionId);
      const response = await stub.fetch('https://do/status');

      if (!response.ok) {
        const error = await response.text();
        return Result.fail(`Failed to fetch session: ${error}`);
      }

      const data = await response.json();

      if (!data.hasSession) {
        return Result.fail('Session not found');
      }

      // Note: This returns partial data. For full session, need different endpoint
      return Result.fail('Use REST endpoints or WebSocket for full session access');
    } catch (error) {
      return Result.fail(`Failed to fetch session: ${error}`);
    }
  }

  async findActiveByUserId(userId: string): Promise<Result<WorkoutSession | null>> {
    // This would require indexing sessions by userId
    // For now, sessions are only accessible by sessionId
    return Result.fail('Not implemented - sessions are accessed by sessionId');
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
        return Result.fail(`Failed to save session: ${error}`);
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to save session: ${error}`);
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
        return Result.fail(`Failed to delete session: ${error}`);
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to delete session: ${error}`);
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
        return Result.fail(`Failed to start session: ${error}`);
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to start session: ${error}`);
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
        return Result.fail(`Failed to pause session: ${error}`);
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to pause session: ${error}`);
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
        return Result.fail(`Failed to resume session: ${error}`);
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to resume session: ${error}`);
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
        return Result.fail(`Failed to complete session: ${error}`);
      }

      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to complete session: ${error}`);
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