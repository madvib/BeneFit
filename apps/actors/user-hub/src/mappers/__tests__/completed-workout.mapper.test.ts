import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createMinimalCompletedWorkoutFixture } from '@bene/training-core';
import { setupTestDb } from '../../data/__tests__/test-utils.js';
import { toDomain, toDatabase } from '../completed-workout.mapper.js';
import { eq } from 'drizzle-orm';
import { completedWorkouts } from '../../data/schema';

/**
 * Tests for CompletedWorkout Mapper
 */
describe('CompletedWorkoutMapper', () => {
  let db: Awaited<ReturnType<typeof setupTestDb>>['db'];
  let client: Awaited<ReturnType<typeof setupTestDb>>['client'];

  beforeAll(async () => {
    const setup = await setupTestDb();
    db = setup.db;
    client = setup.client;
  });

  afterAll(() => {
    client?.close();
  });

  describe('toDatabase', () => {
    it('should map domain CompletedWorkout to database schema', () => {
      const workout = createMinimalCompletedWorkoutFixture({ id: 'workout_test_1' });
      const dbWorkout = toDatabase(workout);

      expect(dbWorkout.id).toBe('workout_test_1');
      expect(dbWorkout.userId).toBe(workout.userId);
      expect(dbWorkout.workoutType).toBe(workout.workoutType);
      expect(dbWorkout.title).toBe(workout.title);
      expect(dbWorkout.completedAt).toEqual(workout.performance.completedAt);
      expect(dbWorkout.recordedAt).toEqual(workout.recordedAt);

      // Dates extracted to columns
      expect(dbWorkout.startedAt).toEqual(workout.performance.startedAt);
      expect(dbWorkout.completedAt).toEqual(workout.performance.completedAt);

      // JSON fields now have dates removed
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { startedAt, completedAt, ...performanceWithoutDates } = workout.performance;
      expect(dbWorkout.performanceJson).toEqual(performanceWithoutDates);
      expect(dbWorkout.verificationJson).toEqual(workout.verification);
    });

    it('should convert undefined to null for optional fields', () => {
      const workout = createMinimalCompletedWorkoutFixture({
        planId: undefined,
        workoutTemplateId: undefined,
        description: undefined,
        multiplayerSessionId: undefined,
      });

      const dbWorkout = toDatabase(workout);

      expect(dbWorkout.planId).toBeNull();
      expect(dbWorkout.workoutTemplateId).toBeNull();
      expect(dbWorkout.description).toBeNull();
      expect(dbWorkout.multiplayerSessionId).toBeNull();
    });

    it('should handle duration conversion (minutes to seconds)', () => {
      const workout = createMinimalCompletedWorkoutFixture({
        performance: {
          durationMinutes: 45.5,
          completedAt: new Date(),
          difficultyRating: 'just_right',
          perceivedExertion: 7,
        } as any,
      });

      const dbWorkout = toDatabase(workout);
      expect(dbWorkout.durationSeconds).toBe(Math.round(45.5 * 60)); // 2730 seconds
    });
  });

  describe('toDomain', () => {
    it('should map database row to domain entity', async () => {
      const workout = createMinimalCompletedWorkoutFixture({ id: 'db_workout_test' });

      await db.insert(completedWorkouts).values(toDatabase(workout));

      const dbRow = await db.query.completedWorkouts.findFirst({
        where: eq(completedWorkouts.id, 'db_workout_test'),
      });

      expect(dbRow).toBeDefined();

      const domainWorkout = toDomain(dbRow!);

      expect(domainWorkout.id).toBe('db_workout_test');
      expect(domainWorkout.userId).toBe(workout.userId);
      expect(domainWorkout.workoutType).toBe(workout.workoutType);
      expect(domainWorkout.title).toBe(workout.title);

      // JSON fields deserialized
      expect(domainWorkout.performance).toEqual(workout.performance);
      expect(domainWorkout.verification).toEqual(workout.verification);

      // Reactions loaded separately
      expect(Array.isArray(domainWorkout.reactions)).toBe(true);
    });

    it('should convert null to undefined for optional fields', async () => {
      const workout = createMinimalCompletedWorkoutFixture({
        id: 'optional_test',
        planId: undefined,
        description: undefined,
      });

      await db.insert(completedWorkouts).values(toDatabase(workout));
      const dbRow = await db.query.completedWorkouts.findFirst({
        where: eq(completedWorkouts.id, 'optional_test'),
      });

      const domainWorkout = toDomain(dbRow!);

      expect(domainWorkout.planId).toBeUndefined();
      expect(domainWorkout.description).toBeUndefined();
    });
  });

  describe('Round-trip integrity', () => {
    it('should maintain data through Domain → DB → Domain', async () => {
      const original = createMinimalCompletedWorkoutFixture({
        id: 'roundtrip_workout',
        workoutType: 'strength',
        title: 'Test Workout',
      });

      await db.insert(completedWorkouts).values(toDatabase(original));

      const dbRow = await db.query.completedWorkouts.findFirst({
        where: eq(completedWorkouts.id, 'roundtrip_workout'),
      });

      expect(dbRow).toBeDefined();

      const reconstructed = toDomain(dbRow!);

      expect(reconstructed.id).toBe(original.id);
      expect(reconstructed.userId).toBe(original.userId);
      expect(reconstructed.workoutType).toBe(original.workoutType);
      expect(reconstructed.title).toBe(original.title);
      expect(reconstructed.performance).toEqual(original.performance);
      expect(reconstructed.verification).toEqual(original.verification);
      expect(reconstructed.isPublic).toBe(original.isPublic);
    });

    it('should handle schema defaults correctly', async () => {
      const workout = createMinimalCompletedWorkoutFixture({
        id: 'defaults_test',
        isPublic: false // Match the DB default for this test
      });

      await db.insert(completedWorkouts).values(toDatabase(workout));
      const dbRow = await db.query.completedWorkouts.findFirst({
        where: eq(completedWorkouts.id, 'defaults_test'),
      });

      const reconstructed = toDomain(dbRow!);

      // Schema defaults
      expect(reconstructed.isPublic).toBe(false);
      expect(reconstructed.createdAt).toBeInstanceOf(Date);
      expect(reconstructed.verification).toBeDefined();
      expect(reconstructed.verification.verified).toBe(false);
    });
  });
});
