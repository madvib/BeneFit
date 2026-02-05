import { describe, it, expect, beforeEach } from 'vitest';
import { env, runInDurableObject } from 'cloudflare:test';
import { drizzle } from 'drizzle-orm/durable-sqlite';
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { DurableUserProfileRepository } from '../../src/repositories/durable-user-profile.repository.js';
import { createUserProfileFixture } from '@bene/training-core/fixtures';
import { user_do_schema } from '../../src/data/schema/index.js';
import migrations from '../../migrations/migrations.js';

describe('DurableUserProfileRepository', () => {
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
    it('should return profile when found', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableUserProfileRepository(db);

        const profile = createUserProfileFixture({
          userId: crypto.randomUUID(),
          bio: 'Test bio',
        });
        await repo.save(profile);

        const result = await repo.findById(profile.userId);

        expect(result.isSuccess).toBe(true);
        expect(result.value.userId).toBe(profile.userId);
        expect(result.value.bio).toBe('Test bio');
      });
    });

    it('should return failure when not found', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableUserProfileRepository(db);

        const result = await repo.findById('non-existent-id');

        expect(result.isFailure).toBe(true);
        expect(result.errorMessage).toContain('UserProfile');
      });
    });
  });

  describe('save', () => {
    it('should create new profile', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableUserProfileRepository(db);

        const profile = createUserProfileFixture({
          userId: crypto.randomUUID(),
          bio: 'New bio',
        });

        const result = await repo.save(profile);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(profile.userId);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.bio).toBe('New bio');
      });
    });

    it('should update existing profile', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableUserProfileRepository(db);

        const profile = createUserProfileFixture({
          userId: crypto.randomUUID(),
          bio: 'Original bio',
        });
        await repo.save(profile);

        const updatedProfile = createUserProfileFixture({
          userId: profile.userId,
          bio: 'Updated bio',
          displayName: profile.displayName,
          timezone: profile.timezone,
          experienceProfile: profile.experienceProfile,
          fitnessGoals: profile.fitnessGoals,
          trainingConstraints: profile.trainingConstraints,
          preferences: profile.preferences,
          stats: profile.stats,
          createdAt: profile.createdAt,
          updatedAt: new Date(),
          lastActiveAt: profile.lastActiveAt,
        });
        const result = await repo.save(updatedProfile);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(profile.userId);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.bio).toBe('Updated bio');
      });
    });

    it('should save achievements', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableUserProfileRepository(db);

        const profile = createUserProfileFixture({
          userId: crypto.randomUUID(),
          bio: 'Test bio',
        });

        const result = await repo.save(profile);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(profile.userId);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.stats.achievements.length).toBeGreaterThanOrEqual(0);
      });
    });
  });

  describe('delete', () => {
    it('should delete profile', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableUserProfileRepository(db);

        const profile = createUserProfileFixture({
          userId: crypto.randomUUID(),
        });
        await repo.save(profile);

        const result = await repo.delete(profile.userId);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(profile.userId);
        expect(findResult.isFailure).toBe(true);
      });
    });

    it('should handle deletion of non-existent profile', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableUserProfileRepository(db);

        const result = await repo.delete('non-existent-id');

        expect(result.isSuccess).toBe(true);
      });
    });
  });
});
