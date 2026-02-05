import { describe, it, expect, beforeEach } from 'vitest';
import { env, runInDurableObject } from 'cloudflare:test';
import { drizzle } from 'drizzle-orm/durable-sqlite';
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { createConnectedServiceFixture } from '@bene/integrations-domain/fixtures';
import { DurableConnectedServiceRepository } from '../../src/repositories/durable-connected-service.repository.js';
import { user_do_schema } from '../../src/data/schema/index.js';
import migrations from '../../migrations/migrations.js';

describe('DurableConnectedServiceRepository', () => {
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
    it('should return service when found', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableConnectedServiceRepository(db);

        const service = createConnectedServiceFixture({
          userId: crypto.randomUUID(),
        });
        await repo.save(service);

        const result = await repo.findById(service.id);

        expect(result.isSuccess).toBe(true);
        expect(result.value.id).toBe(service.id);
        expect(result.value.userId).toBe(service.userId);
      });
    });

    it('should return failure when not found', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableConnectedServiceRepository(db);

        const result = await repo.findById('non-existent-id');

        expect(result.isFailure).toBe(true);
        expect(result.errorMessage).toContain('ConnectedService');
      });
    });
  });

  describe('findByUserId', () => {
    it('should return services ordered by connectedAt desc', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableConnectedServiceRepository(db);

        const userId = crypto.randomUUID();
        const service1 = createConnectedServiceFixture({
          userId,
          connectedAt: new Date('2023-01-01'),
        });
        const service2 = createConnectedServiceFixture({
          userId,
          connectedAt: new Date('2023-01-02'),
        });
        await repo.save(service1);
        await repo.save(service2);

        const result = await repo.findByUserId(userId);

        expect(result.isSuccess).toBe(true);
        expect(result.value.length).toBe(2);
        expect(result.value[0].id).toBe(service2.id);
        expect(result.value[1].id).toBe(service1.id);
      });
    });

    it('should return empty array for user with no services', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableConnectedServiceRepository(db);

        const result = await repo.findByUserId('non-existent-user');

        expect(result.isSuccess).toBe(true);
        expect(result.value.length).toBe(0);
      });
    });
  });

  describe('findByUserIdAndType', () => {
    it('should return service when found', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableConnectedServiceRepository(db);

        const userId = crypto.randomUUID();
        const service = createConnectedServiceFixture({
          userId,
          serviceType: 'strava' as const,
        });
        await repo.save(service);

        const result = await repo.findByUserIdAndType(userId, 'strava');

        expect(result.isSuccess).toBe(true);
        expect(result.value).not.toBeNull();
        expect(result.value!.id).toBe(service.id);
        expect(result.value!.serviceType).toBe('strava');
      });
    });

    it('should return null when not found', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableConnectedServiceRepository(db);

        const userId = crypto.randomUUID();
        const service = createConnectedServiceFixture({
          userId,
          serviceType: 'strava' as const,
        });
        await repo.save(service);

        const result = await repo.findByUserIdAndType(userId, 'garmin');

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeNull();
      });
    });

    it('should return null for user with no services', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableConnectedServiceRepository(db);

        const result = await repo.findByUserIdAndType('non-existent-user', 'strava');

        expect(result.isSuccess).toBe(true);
        expect(result.value).toBeNull();
      });
    });
  });

  describe('findDueForSync', () => {
    it('should return services that have never been synced', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableConnectedServiceRepository(db);

        const result = await repo.findDueForSync();

        expect(result.isSuccess).toBe(true);
        expect(Array.isArray(result.value)).toBe(true);
      });
    });

    it('should return empty array when no services are due for sync', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableConnectedServiceRepository(db);

        const result = await repo.findDueForSync();

        expect(result.isSuccess).toBe(true);
        expect(Array.isArray(result.value)).toBe(true);
      });
    });
  });

  describe('save', () => {
    it('should create new service', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableConnectedServiceRepository(db);

        const service = createConnectedServiceFixture({
          userId: crypto.randomUUID(),
        });

        const result = await repo.save(service);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(service.id);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.userId).toBe(service.userId);
      });
    });

    it('should update existing service', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableConnectedServiceRepository(db);

        const service = createConnectedServiceFixture({
          userId: crypto.randomUUID(),
          isActive: true,
        });
        await repo.save(service);

        const updatedService = createConnectedServiceFixture({
          id: service.id,
          userId: service.userId,
          serviceType: service.serviceType,
          credentials: service.credentials,
          permissions: service.permissions,
          syncStatus: service.syncStatus,
          metadata: service.metadata,
          isActive: false,
          isPaused: service.isPaused,
          connectedAt: service.connectedAt,
          lastSyncAt: service.lastSyncAt,
          updatedAt: new Date(),
        });
        const result = await repo.save(updatedService);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(service.id);
        expect(findResult.isSuccess).toBe(true);
        expect(findResult.value.isActive).toBe(false);
      });
    });
  });

  describe('delete', () => {
    it('should delete service', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableConnectedServiceRepository(db);

        const service = createConnectedServiceFixture({
          userId: crypto.randomUUID(),
        });
        await repo.save(service);

        const result = await repo.delete(service.id);

        expect(result.isSuccess).toBe(true);

        const findResult = await repo.findById(service.id);
        expect(findResult.isFailure).toBe(true);
      });
    });

    it('should handle deletion of non-existent service', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });
        const repo = new DurableConnectedServiceRepository(db);

        const result = await repo.delete('non-existent-id');

        expect(result.isSuccess).toBe(true);
      });
    });
  });
});
