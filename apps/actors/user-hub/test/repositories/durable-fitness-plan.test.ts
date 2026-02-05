import { describe, it, expect, beforeEach } from 'vitest';
import { env, runInDurableObject } from 'cloudflare:test';
import { drizzle } from 'drizzle-orm/durable-sqlite';
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { DurableFitnessPlanRepository } from '../../src/repositories/durable-fitness-plan.repository.js';
import { createFitnessPlanFixture } from '@bene/training-core/fixtures';
import { user_do_schema } from '../../src/data/schema/index.js';
import migrations from '../../migrations/migrations.js';

describe('DurableFitnessPlanRepository', () => {
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
    it('should return plan when found', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableFitnessPlanRepository(db);

        const plan = createFitnessPlanFixture({
          userId: crypto.randomUUID(),
        });
        await repo.save(plan);

        const result = await repo.findById(plan.id);

        expect(result.isSuccess).toBe(true);
        expect(result.value.id).toBe(plan.id);
        expect(result.value.userId).toBe(plan.userId);
      });
    });

    it('should return failure when not found', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableFitnessPlanRepository(db);

        const result = await repo.findById('non-existent-id');

        expect(result.isFailure).toBe(true);
        expect(result.errorMessage).toContain('FitnessPlan');
      });
    });
  });

  describe('findByUserId', () => {
    it('should return plans ordered by createdAt desc', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableFitnessPlanRepository(db);

        const userId = crypto.randomUUID();
        const plan1 = createFitnessPlanFixture({
          userId,
          createdAt: new Date('2023-01-01'),
        });
        const plan2 = createFitnessPlanFixture({
          userId,
          createdAt: new Date('2023-01-02'),
        });
        await repo.save(plan1);
        await repo.save(plan2);

        const result = await repo.findByUserId(userId);

        expect(result.isSuccess).toBe(true);
        expect(result.value.length).toBe(2);
        expect(result.value[0].id).toBe(plan2.id);
        expect(result.value[1].id).toBe(plan1.id);
      });
    });

    it('should return empty array for user with no plans', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableFitnessPlanRepository(db);

        const result = await repo.findByUserId('non-existent-user');

        expect(result.isSuccess).toBe(true);
        expect(result.value.length).toBe(0);
      });
    });
  });

  describe('findActiveByUserId', () => {
    it('should return active plan', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableFitnessPlanRepository(db);

        const userId = crypto.randomUUID();
        const activePlan = createFitnessPlanFixture({
          userId,
          status: 'active',
        });
        const completedPlan = createFitnessPlanFixture({
          userId,
          status: 'completed',
        });
        await repo.save(activePlan);
        await repo.save(completedPlan);

        const result = await repo.findActiveByUserId(userId);

        expect(result.isSuccess).toBe(true);
        expect(result.value.id).toBe(activePlan.id);
        expect(result.value.status).toBe('active');
      });
    });

    it('should return failure when no active plan found', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableFitnessPlanRepository(db);

        const userId = crypto.randomUUID();
        const completedPlan = createFitnessPlanFixture({
          userId,
          status: 'completed',
        });
        await repo.save(completedPlan);

        const result = await repo.findActiveByUserId(userId);

        expect(result.isFailure).toBe(true);
        expect(result.errorMessage).toContain('Active FitnessPlan');
      });
    });

    it('should return failure for user with no plans', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableFitnessPlanRepository(db);

        const result = await repo.findActiveByUserId('non-existent-user');

        expect(result.isFailure).toBe(true);
        expect(result.errorMessage).toContain('Active FitnessPlan');
      });
    });
  });

  describe('save', () => {
    it('should create new plan', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableFitnessPlanRepository(db);

        const plan = createFitnessPlanFixture({
          userId: crypto.randomUUID(),
        });

        const result = await repo.save(plan);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(plan.id);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.userId).toBe(plan.userId);
      });
    });

    it('should update existing plan', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableFitnessPlanRepository(db);

        const plan = createFitnessPlanFixture({
          userId: crypto.randomUUID(),
          status: 'active',
        });
        await repo.save(plan);

        const updatedPlan = {
          ...plan,
          status: 'completed' as const,
        };
        const result = await repo.save(updatedPlan);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(plan.id);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.status).toBe('completed');
      });
    });
  });

  describe('delete', () => {
    it('should delete plan', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableFitnessPlanRepository(db);

        const plan = createFitnessPlanFixture({
          userId: crypto.randomUUID(),
        });
        await repo.save(plan);

        const result = await repo.delete(plan.id);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(plan.id);
        expect(findResult.isFailure).toBe(true);
      });
    });

    it('should handle deletion of non-existent plan', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableFitnessPlanRepository(db);

        const result = await repo.delete('non-existent-id');

        expect(result.isSuccess).toBe(true);
      });
    });
  });
});
