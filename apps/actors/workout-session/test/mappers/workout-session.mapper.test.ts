import { describe, it, expect, beforeEach } from 'vitest';
import { env, runInDurableObject } from 'cloudflare:test';
import { drizzle } from 'drizzle-orm/durable-sqlite';
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { eq } from 'drizzle-orm';
import {
  createWorkoutSessionFixture,
  createSessionFeedItemFixture,
} from '@bene/training-core/fixtures';
import * as mapper from '../../src/mappers/workout-session.mapper.js';
import {
  sessionMetadata as sessionTable,
  workout_session_schema,
} from '../../src/data/schema/index.js';
import migrations from '../../migrations/migrations.js';

describe('WorkoutSessionMapper', () => {
  let stub: DurableObjectStub;

  beforeEach(async () => {
    const id = env.WORKOUT_SESSION.idFromName(`mapper-test-${crypto.randomUUID()}`);
    stub = env.WORKOUT_SESSION.get(id);

    await runInDurableObject(stub, async (instance: any, state: any) => {
      const db = drizzle(state.storage, { schema: workout_session_schema });
      await migrate(db, migrations);
      return { db };
    });
  });

  describe('toDatabase', () => {
    it('should correctly map domain entity to database row', () => {
      const session = createWorkoutSessionFixture({ id: 'session_test_1' });
      const dbRow = mapper.toDatabase(session);

      expect(dbRow.id).toBe('session_test_1');
      expect(dbRow.createdByUserId).toBe(session.ownerId);
      expect(dbRow.status).toBe(session.state);
      expect(dbRow.configurationJson).toEqual(session.configuration);
      expect(dbRow.activitiesJson).toEqual(session.activities);
    });
  });

  describe('toDomain', () => {
    it('should correctly map database row to domain entity', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: workout_session_schema });
        const session = createWorkoutSessionFixture({ id: 'domain_test_1' });
        await db.insert(sessionTable).values(mapper.toDatabase(session));

        const dbRow = await db.query.sessionMetadata.findFirst({
          where: eq(sessionTable.id, 'domain_test_1'),
        });

        expect(dbRow).toBeDefined();

        const domain = mapper.toDomain(dbRow!);

        expect(domain.id).toBe(session.id);
        expect(domain.ownerId).toBe(session.ownerId);
        expect(domain.state).toBe(session.state);
        expect(domain.configuration).toEqual(session.configuration);
        expect(domain.activities).toEqual(session.activities);

        // Verify date objects
        expect(domain.createdAt).toBeInstanceOf(Date);
        expect(domain.updatedAt).toBeInstanceOf(Date);
        expect(domain.startedAt).toBeInstanceOf(Date);
      });
    });
  });

  describe('Round-trip integrity', () => {
    it('should maintain data through Domain -> DB -> Domain', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: workout_session_schema });
        const original = createWorkoutSessionFixture({
          id: 'roundtrip_test',
          liveProgress: {
            activityType: 'main',
            activityIndex: 0,
            totalActivities: 3,
            activityStartedAt: new Date('2024-01-01T10:00:00Z'),
            elapsedSeconds: 120,
          },
          activityFeed: [
            createSessionFeedItemFixture({
              timestamp: new Date('2024-01-01T10:05:00Z'),
              content: 'Hello',
            }),
          ],
        });

        // Insert and read back
        await db.insert(sessionTable).values(mapper.toDatabase(original));
        const dbRow = await db.query.sessionMetadata.findFirst({
          where: eq(sessionTable.id, 'roundtrip_test'),
        });

        const reconstructed = mapper.toDomain(dbRow!);

        // Core fields
        expect(reconstructed.id).toBe(original.id);
        expect(reconstructed.ownerId).toBe(original.ownerId);
        expect(reconstructed.state).toBe(original.state);

        // JSON fields with nested dates
        expect(reconstructed.liveProgress).toEqual(original.liveProgress);
        expect(reconstructed.liveProgress?.activityStartedAt).toBeInstanceOf(Date);

        expect(reconstructed.activityFeed).toEqual(original.activityFeed);
        expect(reconstructed.activityFeed[0].timestamp).toBeInstanceOf(Date);

        // Timestamps
        expect(reconstructed.startedAt?.getTime()).toBe(original.startedAt?.getTime());
        expect(reconstructed.createdAt.getTime()).toBe(original.createdAt.getTime());
      });
    });
  });
});
