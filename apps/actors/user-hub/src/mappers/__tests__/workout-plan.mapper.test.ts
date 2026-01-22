import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { randomUUID } from 'crypto';
import { setupTestDb } from '../../data/__tests__/test-utils.js';
import { toDomain, toDatabase } from '../workout-plan.mapper.js';
import { createFitnessPlanFixture } from '@bene/training-core/fixtures';
import { eq } from 'drizzle-orm';
import { activeFitnessPlan } from '../../data/schema';

/**
 * Tests for WorkoutPlan Mapper
 * 
 * Uses a real in-memory SQLite database to avoid brittle mocks.
 * Fixtures provide the domain data, mappers convert it, and we verify
 * the round-trip through an actual database.
 */
describe('WorkoutPlanMapper', () => {
  let db: Awaited<ReturnType<typeof setupTestDb>>['db'];
  let client: Awaited<ReturnType<typeof setupTestDb>>['client'];

  // Set up DB once for all tests
  beforeAll(async () => {
    const setup = await setupTestDb();
    db = setup.db;
    client = setup.client;
  });

  afterAll(() => {
    client?.close();
  });

  describe('toDatabase', () => {
    it('should map domain FitnessPlan to database schema', () => {
      const plan = createFitnessPlanFixture({
        id: randomUUID(),
        userId: randomUUID(),
        title: 'Test Plan',
        endDate: new Date('2026-03-01T00:00:00.000Z'),
      });

      const dbPlan = toDatabase(plan);

      console.log('plan.startDate type:', typeof plan.startDate, plan.startDate instanceof Date);
      console.log('dbPlan.startDate type:', typeof dbPlan.startDate, dbPlan.startDate instanceof Date);

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

    it('should convert undefined to null for optional fields', () => {
      const plan = createFitnessPlanFixture({
        id: randomUUID(),
        userId: randomUUID(),
        endDate: undefined,
        templateId: undefined,
      });

      const dbPlan = toDatabase(plan);

      expect(dbPlan.endDate).toBeNull();
      expect(dbPlan.templateId).toBeNull();
    });

    it('should preserve templateId when present', () => {
      const plan = createFitnessPlanFixture({
        id: randomUUID(),
        userId: randomUUID(),
        templateId: randomUUID(),
      });

      const dbPlan = toDatabase(plan);

      expect(dbPlan.templateId).toBe(plan.templateId);
    });
  });

  describe('toDomain', () => {
    it('should map database row to domain entity', async () => {
      // Create domain fixture
      const plan = createFitnessPlanFixture({
        id: randomUUID(),
        userId: randomUUID(),
        title: 'DB Test Plan',
        templateId: randomUUID(),
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

    it('should convert null to undefined for optional fields', async () => {
      // Create plan without optional fields
      const plan = createFitnessPlanFixture({
        id: randomUUID(),
        userId: randomUUID(),
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

  describe('Round-trip integrity', () => {
    it('should maintain data through Domain → DB → Domain', async () => {
      const original = createFitnessPlanFixture({
        id: randomUUID(),
        userId: randomUUID(),
        title: 'Round Trip Plan',
        startDate: new Date('2026-01-01T00:00:00.000Z'),
        endDate: new Date('2026-04-15T00:00:00.000Z'),
        templateId: randomUUID(),
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

    it('should handle schema defaults correctly', async () => {
      // Create plan and let schema apply defaults
      const plan = createFitnessPlanFixture({
        id: randomUUID(),
        userId: randomUUID(),
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
