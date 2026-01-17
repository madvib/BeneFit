import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { setupTestDb } from './test-utils.js';
import { seedWorkoutSession } from '../seed.js';
import { DurableWorkoutSessionRepository } from '../../repositories/durable-workout-session.repository.js';
import { SEED_USER_IDS } from '@bene/shared';

describe('WorkoutSession Repository Tests', () => {
  let db: Awaited<ReturnType<typeof setupTestDb>>['db'];
  let client: Awaited<ReturnType<typeof setupTestDb>>['client'];
  let repo: DurableWorkoutSessionRepository;

  beforeEach(async () => {
    const setup = await setupTestDb();
    db = setup.db;
    client = setup.client;
    await seedWorkoutSession(db);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    repo = new DurableWorkoutSessionRepository(db as any);
  });

  afterEach(() => {
    client?.close();
  });

  it('findById: should return seeded session', async () => {
    // Seeding creates 3 sessions, let's find one by searching first
    const firstSession = await db.query.sessionMetadata.findFirst();
    expect(firstSession).toBeDefined();

    const result = await repo.findById(firstSession!.id);
    expect(result.isSuccess).toBe(true);
    expect(result.value.id).toBe(firstSession!.id);
  });

  it('findActiveByUserId: should return active session for user', async () => {
    const userId = SEED_USER_IDS.USER_001;
    const result = await repo.findActiveByUserId(userId);

    expect(result.isSuccess).toBe(true);
    expect(result.value.ownerId).toBe(userId);
    expect(result.value.state).toBe('in_progress');
  });

  it('save: should update existing session', async () => {
    const firstSession = await db.query.sessionMetadata.findFirst();
    const domainResult = await repo.findById(firstSession!.id);
    const session = domainResult.value;

    const updatedSession = { ...session, workoutType: 'Updated Type' };
    const saveResult = await repo.save(updatedSession);
    expect(saveResult.isSuccess).toBe(true);

    const verify = await repo.findById(session.id);
    expect(verify.value.workoutType).toBe('Updated Type');
  });

  it('delete: should remove session', async () => {
    const firstSession = await db.query.sessionMetadata.findFirst();
    const result = await repo.delete(firstSession!.id);
    expect(result.isSuccess).toBe(true);

    const verify = await repo.findById(firstSession!.id);
    expect(verify.isFailure).toBe(true);
  });
});
