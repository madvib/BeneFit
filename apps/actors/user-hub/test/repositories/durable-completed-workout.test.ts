import { describe, it, expect, beforeEach } from 'vitest';
import { env, runInDurableObject } from 'cloudflare:test';
import { drizzle } from 'drizzle-orm/durable-sqlite';
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { createCompletedWorkoutFixture } from '@bene/training-core/fixtures';
import { DurableCompletedWorkoutRepository } from '../../src/repositories/durable-completed-workout.repository.js';
import { user_do_schema } from '../../src/data/schema/index.js';
import migrations from '../../migrations/migrations.js';

describe('DurableCompletedWorkoutRepository', () => {
  let stub: DurableObjectStub;

  beforeEach(async () => {
    const id = env.USER_HUB.idFromName(`test-${crypto.randomUUID()}`);
    stub = env.USER_HUB.get(id);

    await runInDurableObject(stub, async (instance: any, state: any) => {
      const db = drizzle(state.storage, { schema: user_do_schema });
      await migrate(db, migrations);
    });
  });

  describe('findById', () => {
    it('should return workout when found', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCompletedWorkoutRepository(db);

        const workout = createCompletedWorkoutFixture({
          userId: crypto.randomUUID(),
        });
        await repo.save(workout);

        const result = await repo.findById(workout.id);

        expect(result.isSuccess).toBe(true);
        expect(result.value.id).toBe(workout.id);
        expect(result.value.userId).toBe(workout.userId);
      });
    });

    it('should return failure when not found', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCompletedWorkoutRepository(db);

        const result = await repo.findById('non-existent-id');

        expect(result.isFailure).toBe(true);
        expect(result.errorMessage).toContain('CompletedWorkout');
      });
    });
  });

  describe('findByUserId', () => {
    it('should return workouts for user', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCompletedWorkoutRepository(db);

        const userId = crypto.randomUUID();
        const workout1 = createCompletedWorkoutFixture({ userId });
        const workout2 = createCompletedWorkoutFixture({ userId });
        await repo.save(workout1);
        await repo.save(workout2);

        const result = await repo.findByUserId(userId);

        expect(result.isSuccess).toBe(true);
        expect(result.value.length).toBe(2);
        expect(result.value.map((w) => w.id)).toContain(workout1.id);
        expect(result.value.map((w) => w.id)).toContain(workout2.id);
      });
    });

    it('should return empty array for user with no workouts', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCompletedWorkoutRepository(db);

        const result = await repo.findByUserId('non-existent-user');

        expect(result.isSuccess).toBe(true);
        expect(result.value.length).toBe(0);
      });
    });

    it('should respect limit and offset', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCompletedWorkoutRepository(db);

        const userId = crypto.randomUUID();
        const workouts = Array.from({ length: 5 }, (_, i) =>
          createCompletedWorkoutFixture({
            userId,
            recordedAt: new Date(Date.now() + i * 1000),
          }),
        );
        for (const workout of workouts) {
          await repo.save(workout);
        }

        const result = await repo.findByUserId(userId, 2, 1);

        expect(result.isSuccess).toBe(true);
        expect(result.value.length).toBe(2);
      });
    });
  });

  describe('findByPlanId', () => {
    it('should return workouts for plan', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCompletedWorkoutRepository(db);

        const planId = crypto.randomUUID();
        const workout1 = createCompletedWorkoutFixture({ planId });
        const workout2 = createCompletedWorkoutFixture({ planId });
        await repo.save(workout1);
        await repo.save(workout2);

        const result = await repo.findByPlanId(planId);

        expect(result.isSuccess).toBe(true);
        expect(result.value.length).toBe(2);
        expect(result.value.map((w) => w.id)).toContain(workout1.id);
        expect(result.value.map((w) => w.id)).toContain(workout2.id);
      });
    });

    it('should return empty array for plan with no workouts', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCompletedWorkoutRepository(db);

        const result = await repo.findByPlanId('non-existent-plan');

        expect(result.isSuccess).toBe(true);
        expect(result.value.length).toBe(0);
      });
    });
  });

  describe('findRecentByUserId', () => {
    it('should return workouts within date range', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCompletedWorkoutRepository(db);

        const userId = crypto.randomUUID();
        const recentWorkout = createCompletedWorkoutFixture({
          userId,
          recordedAt: new Date(),
        });
        const oldWorkout = createCompletedWorkoutFixture({
          userId,
          recordedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000),
        });
        await repo.save(recentWorkout);
        await repo.save(oldWorkout);

        const result = await repo.findRecentByUserId(userId, 30);

        expect(result.isSuccess).toBe(true);
        expect(result.value.length).toBe(1);
        expect(result.value[0].id).toBe(recentWorkout.id);
      });
    });

    it('should return empty array for no recent workouts', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCompletedWorkoutRepository(db);

        const result = await repo.findRecentByUserId('non-existent-user', 30);

        expect(result.isSuccess).toBe(true);
        expect(result.value.length).toBe(0);
      });
    });
  });

  describe('save', () => {
    it('should create new workout', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCompletedWorkoutRepository(db);

        const workout = createCompletedWorkoutFixture({
          userId: crypto.randomUUID(),
        });

        const result = await repo.save(workout);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(workout.id);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.userId).toBe(workout.userId);
      });
    });

    it('should update existing workout', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCompletedWorkoutRepository(db);

        const workout = createCompletedWorkoutFixture({
          userId: crypto.randomUUID(),
          title: 'Original Title',
        });
        await repo.save(workout);

        const updatedWorkout = createCompletedWorkoutFixture({
          id: workout.id,
          userId: workout.userId,
          title: 'Updated Title',
          workoutType: workout.workoutType,
          performance: workout.performance,
          verification: workout.verification,
          isPublic: workout.isPublic,
          reactions: workout.reactions,
          createdAt: workout.createdAt,
          recordedAt: workout.recordedAt,
        });
        const result = await repo.save(updatedWorkout);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(workout.id);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.title).toBe('Updated Title');
      });
    });

    it('should sync reactions', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCompletedWorkoutRepository(db);

        const workout = createCompletedWorkoutFixture({
          userId: crypto.randomUUID(),
          reactions: [],
        });
        await repo.save(workout);

        const updatedWorkout = createCompletedWorkoutFixture({
          id: workout.id,
          userId: workout.userId,
          title: workout.title,
          workoutType: workout.workoutType,
          performance: workout.performance,
          verification: workout.verification,
          isPublic: workout.isPublic,
          reactions: [
            {
              id: crypto.randomUUID(),
              userId: crypto.randomUUID(),
              userName: 'Another User',
              type: 'heart' as const,
              createdAt: new Date(),
            },
          ],
          createdAt: workout.createdAt,
          recordedAt: workout.recordedAt,
        });
        const result = await repo.save(updatedWorkout);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(workout.id);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.reactions.length).toBe(1);
        expect(findResult.value.reactions[0].type).toBe('heart');
      });
    });
  });

  describe('countByUserId', () => {
    it('should return correct count', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCompletedWorkoutRepository(db);

        const userId = crypto.randomUUID();
        const workout1 = createCompletedWorkoutFixture({ userId });
        const workout2 = createCompletedWorkoutFixture({ userId });
        await repo.save(workout1);
        await repo.save(workout2);

        const result = await repo.countByUserId(userId);

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBe(2);
      });
    });

    it('should return zero for user with no workouts', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableCompletedWorkoutRepository(db);

        const result = await repo.countByUserId('non-existent-user');

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBe(0);
      });
    });
  });
});
