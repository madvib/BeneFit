import { describe, it, expect, beforeEach } from 'vitest';
import { env, runInDurableObject } from 'cloudflare:test';
import { drizzle } from 'drizzle-orm/durable-sqlite';
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { eq } from 'drizzle-orm';
import { toDomain, toDatabase } from '../../src/mappers/workout-plan.mapper.js';
import { createFitnessPlanFixture } from '@bene/training-core/fixtures';
import { activeFitnessPlan } from '../../src/data/schema';
import { user_do_schema } from '../../src/data/schema/index.js';
import migrations from '../../migrations/migrations.js';

/**
 * Tests for WorkoutPlan Mapper using Cloudflare Durable Objects
 */
describe('WorkoutPlanMapper (Durable Objects)', () => {
  let stub: DurableObjectStub;

  beforeEach(async () => {
    const id = env.USER_HUB.idFromName(`test-${crypto.randomUUID()}`);
    stub = env.USER_HUB.get(id);

    await runInDurableObject(stub, async (instance: any, state: any) => {
      const db = drizzle(state.storage, { schema: user_do_schema });
      await migrate(db, migrations);
      return { db };
    });
  });

  describe('toDatabase', () => {
    it('should map domain FitnessPlan to database schema', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const plan = createFitnessPlanFixture({
          id: crypto.randomUUID(),
          userId: crypto.randomUUID(),
          title: 'Test Plan',
          endDate: new Date('2026-03-01T00:00:00.000Z'),
        });

        const dbPlan = toDatabase(plan);

        // Core fields
        expect(dbPlan.id).toBeDefined();
        expect(dbPlan.userId).toBe(plan.userId);
        expect(dbPlan.title).toBe('Test Plan');
        expect(dbPlan.description).toBe(plan.description);
        expect(dbPlan.planType).toBe(plan.planType);
        expect(dbPlan.templateId).toBe(plan.templateId ?? null);
        expect(dbPlan.status).toBe(plan.status);

        // targetDate extracted to column
        expect(dbPlan.targetDate).toEqual(plan.goals.targetDate);

        // JSON fields - targetDate removed
        const { targetDate, ...goalsWithoutDate } = plan.goals;
        expect(dbPlan.goalsJson).toEqual(goalsWithoutDate);
        expect(dbPlan.progressionJson).toEqual(plan.progression);
        expect(dbPlan.constraintsJson).toEqual(plan.constraints);
        expect(dbPlan.currentPositionJson).toEqual(plan.currentPosition);
        expect(dbPlan.weeksJson).toEqual(plan.weeks);

        // Date fields
        expect(dbPlan.startDate).toBeInstanceOf(Date);
        expect(dbPlan.startDate).toEqual(plan.startDate);
        expect(dbPlan.endDate).toBeInstanceOf(Date);
        expect(dbPlan.createdAt).toEqual(plan.createdAt);
        expect(dbPlan.updatedAt).toEqual(plan.updatedAt);
      });
    });

    it('should convert undefined to null for optional fields', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const plan = createFitnessPlanFixture({
          id: crypto.randomUUID(),
          userId: crypto.randomUUID(),
          endDate: undefined,
          templateId: undefined,
        });

        const dbPlan = toDatabase(plan);

        expect(dbPlan.endDate).toBeNull();
        expect(dbPlan.templateId).toBeNull();
      });
    });

    it('should preserve templateId when present', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const plan = createFitnessPlanFixture({
          id: crypto.randomUUID(),
          userId: crypto.randomUUID(),
          templateId: crypto.randomUUID(),
        });

        const dbPlan = toDatabase(plan);

        expect(dbPlan.templateId).toBe(plan.templateId);
      });
    });
  });

  describe('toDomain', () => {
    it('should map database row to domain entity', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });

        // Create domain fixture
        const plan = createFitnessPlanFixture({
          id: crypto.randomUUID(),
          userId: crypto.randomUUID(),
          title: 'DB Test Plan',
          templateId: crypto.randomUUID(),
        });

        // Insert into actual database
        const dbPlan = toDatabase(plan);
        await db.insert(activeFitnessPlan).values(dbPlan);

        // Read back from database
        const dbRow = await db.query.activeFitnessPlan.findFirst({
          where: eq(activeFitnessPlan.id, plan.id),
        });

        expect(dbRow).toBeDefined();

        // Map to domain
        const domainPlan = toDomain(dbRow!);

        expect(domainPlan.id).toBe(plan.id);
        expect(domainPlan.title).toBe('DB Test Plan');
        expect(domainPlan.templateId).toBe(plan.templateId);
        expect(domainPlan.planType).toBe(plan.planType);
        expect(domainPlan.status).toBe(plan.status);

        // JSON fields deserialized correctly
        expect(domainPlan.goals).toEqual(plan.goals);
        expect(domainPlan.progression).toEqual(plan.progression);
        expect(domainPlan.constraints).toEqual(plan.constraints);
        expect(domainPlan.currentPosition).toEqual(plan.currentPosition);
        expect(Array.isArray(domainPlan.weeks)).toBe(true);
      });
    });

    it('should convert null to undefined for optional fields', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });

        // Create plan without optional fields
        const plan = createFitnessPlanFixture({
          id: crypto.randomUUID(),
          userId: crypto.randomUUID(),
          endDate: undefined,
          templateId: undefined,
        });

        // Insert and read back
        await db.insert(activeFitnessPlan).values(toDatabase(plan));
        const dbRow = await db.query.activeFitnessPlan.findFirst({
          where: eq(activeFitnessPlan.id, plan.id),
        });

        const domainPlan = toDomain(dbRow!);

        // Schema stores as null, domain expects undefined
        expect(domainPlan.endDate).toBeUndefined();
        expect(domainPlan.templateId).toBeUndefined();
      });
    });
  });

  describe('Round-trip integrity', () => {
    it('should maintain data through Domain → DB → Domain', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });

        const original = createFitnessPlanFixture({
          id: crypto.randomUUID(),
          userId: crypto.randomUUID(),
          title: 'Round Trip Plan',
          startDate: new Date('2026-01-01T00:00:00.000Z'),
          endDate: new Date('2026-04-15T00:00:00.000Z'),
          templateId: crypto.randomUUID(),
        });

        // Convert to DB and insert
        const dbPlan = toDatabase(original);
        await db.insert(activeFitnessPlan).values(dbPlan);

        // Read back from actual database
        const dbRow = await db.query.activeFitnessPlan.findFirst({
          where: eq(activeFitnessPlan.id, original.id),
        });

        expect(dbRow).toBeDefined();

        // Convert back to domain
        const reconstructed = toDomain(dbRow!);

        // Verify all core fields match
        expect(reconstructed.id).toBe(original.id);
        expect(reconstructed.userId).toBe(original.userId);
        expect(reconstructed.title).toBe(original.title);
        expect(reconstructed.description).toBe(original.description);
        expect(reconstructed.planType).toBe(original.planType);
        expect(reconstructed.templateId).toBe(original.templateId);
        expect(reconstructed.status).toBe(original.status);

        // JSON structures should be deep equal
        expect(reconstructed.goals).toEqual(original.goals);
        expect(reconstructed.progression).toEqual(original.progression);
        expect(reconstructed.constraints).toEqual(original.constraints);
        expect(reconstructed.currentPosition).toEqual(original.currentPosition);
        expect(reconstructed.weeks).toEqual(original.weeks);

        // Dates should match
        expect(reconstructed.startDate).toEqual(original.startDate);
        expect(reconstructed.endDate).toEqual(original.endDate);
      });
    });

    it('should handle schema defaults correctly', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });

        // Create plan and let schema apply defaults
        const plan = createFitnessPlanFixture({
          id: crypto.randomUUID(),
          userId: crypto.randomUUID(),
          templateId: undefined, // Ensure templateId is optional (undefined)
        });

        await db.insert(activeFitnessPlan).values(toDatabase(plan));
        const dbRow = await db.query.activeFitnessPlan.findFirst({
          where: eq(activeFitnessPlan.id, plan.id),
        });

        const reconstructed = toDomain(dbRow!);

        // Verify defaults were applied by schema
        expect(reconstructed.createdAt).toBeInstanceOf(Date);
        expect(reconstructed.updatedAt).toBeInstanceOf(Date);
        // weeks default to empty array
        expect(Array.isArray(reconstructed.weeks)).toBe(true);
      });
    });
  });
});
