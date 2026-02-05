import { describe, it, expect, beforeEach } from 'vitest';
import { env, runInDurableObject } from 'cloudflare:test';
import { drizzle } from 'drizzle-orm/durable-sqlite';
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { createWorkoutSessionFixture } from '@bene/training-core/fixtures';
import { DurableWorkoutSessionRepository } from '../../src/repositories/durable-workout-session.repository.js';
import { workout_session_schema } from '../../src/data/schema/index.js';
import migrations from '../../migrations/migrations.js';

describe('DurableWorkoutSessionRepository', () => {
  let stub: DurableObjectStub;

  beforeEach(async () => {
    const id = env.WORKOUT_SESSION.idFromName(`test-${crypto.randomUUID()}`);
    stub = env.WORKOUT_SESSION.get(id);

    await runInDurableObject(stub, async (instance: any, state: any) => {
      const db = drizzle(state.storage, { schema: workout_session_schema });
      await migrate(db, migrations);
    });
  });

  describe('findById', () => {
    it('should return session when found', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: workout_session_schema });
        const repo = new DurableWorkoutSessionRepository(db);

        const session = createWorkoutSessionFixture({
          id: crypto.randomUUID(),
          workoutType: 'strength',
        });
        await repo.save(session);

        const result = await repo.findById(session.id);

        expect(result.isSuccess).toBe(true);
        expect(result.value.id).toBe(session.id);
        expect(result.value.workoutType).toBe('strength');
      });
    });

    it('should return failure when not found', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: workout_session_schema });
        const repo = new DurableWorkoutSessionRepository(db);

        const result = await repo.findById('non-existent-id');

        expect(result.isFailure).toBe(true);
        expect(result.errorMessage).toContain('WorkoutSession');
      });
    });
  });

  describe('findActiveByUserId', () => {
    it('should return active session for user', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: workout_session_schema });
        const repo = new DurableWorkoutSessionRepository(db);

        const userId = crypto.randomUUID();
        const session = createWorkoutSessionFixture({
          id: crypto.randomUUID(),
          ownerId: userId,
          state: 'in_progress',
        });
        await repo.save(session);

        const result = await repo.findActiveByUserId(userId);

        expect(result.isSuccess).toBe(true);
        expect(result.value.ownerId).toBe(userId);
        expect(result.value.state).toBe('in_progress');
      });
    });

    it('should return failure when no active session exists', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: workout_session_schema });
        const repo = new DurableWorkoutSessionRepository(db);

        const result = await repo.findActiveByUserId('non-existent-user');

        expect(result.isFailure).toBe(true);
      });
    });
  });

  describe('save', () => {
    it('should create new session', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: workout_session_schema });
        const repo = new DurableWorkoutSessionRepository(db);

        const session = createWorkoutSessionFixture({
          id: crypto.randomUUID(),
          workoutType: 'cardio',
        });

        const result = await repo.save(session);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(session.id);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.workoutType).toBe('cardio');
      });
    });

    it('should update existing session', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: workout_session_schema });
        const repo = new DurableWorkoutSessionRepository(db);

        const session = createWorkoutSessionFixture({
          id: crypto.randomUUID(),
          workoutType: 'original-type',
        });
        await repo.save(session);

        const updatedSession = createWorkoutSessionFixture({
          id: session.id,
          ownerId: session.ownerId,
          workoutType: 'updated-type',
          state: session.state,
          configuration: session.configuration,
          activities: session.activities,
          createdAt: session.createdAt,
          updatedAt: new Date(),
        });
        const result = await repo.save(updatedSession);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(session.id);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.workoutType).toBe('updated-type');
      });
    });
  });

  describe('delete', () => {
    it('should delete session', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: workout_session_schema });
        const repo = new DurableWorkoutSessionRepository(db);

        const session = createWorkoutSessionFixture({
          id: crypto.randomUUID(),
        });
        await repo.save(session);

        const result = await repo.delete(session.id);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(session.id);
        expect(findResult.isFailure).toBe(true);
      });
    });

    it('should handle deletion of non-existent session', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: workout_session_schema });
        const repo = new DurableWorkoutSessionRepository(db);

        const result = await repo.delete('non-existent-id');

        expect(result.isSuccess).toBe(true);
      });
    });
  });
});
