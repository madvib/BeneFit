import { describe, it, expect, beforeEach } from 'vitest';
import { env, runInDurableObject } from 'cloudflare:test';
import { drizzle } from 'drizzle-orm/durable-sqlite';
import { migrate } from 'drizzle-orm/durable-sqlite/migrator';
import { eq } from 'drizzle-orm';
import { createConnectedServiceFixture } from '@bene/integrations-domain/fixtures';
import { toDomain, toDatabase } from '../../src/mappers/connected-service.mapper.js';
import { connectedServices } from '../../src/data/schema';
import { user_do_schema } from '../../src/data/schema/index.js';
import migrations from '../../migrations/migrations.js';

/**
 * Tests for ConnectedService Mapper using Cloudflare Durable Objects
 */
describe('ConnectedServiceMapper (Durable Objects)', () => {
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
    it('should map domain ConnectedService to database schema', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const service = createConnectedServiceFixture({ id: 'service_test_1' });
        const dbService = toDatabase(service);

        // Core fields
        expect(dbService.id).toBe('service_test_1');
        expect(dbService.userId).toBe(service.userId);
        expect(dbService.serviceType).toBe(service.serviceType);

        // Credentials transformation
        expect(dbService.accessTokenEncrypted).toBe(service.credentials.accessToken);
        expect(dbService.refreshTokenEncrypted).toBe(service.credentials.refreshToken);
        expect(dbService.tokenExpiresAt).toBe(service.credentials.expiresAt);
        expect(dbService.scope).toBe(service.credentials.scopes.join(','));

        // JSON fields
        expect(dbService.permissions).toEqual(service.permissions);

        // Sync dates extracted to columns
        expect(dbService.lastSyncAttempt?.getTime()).toEqual(
          service.syncStatus.lastAttemptAt?.getTime(),
        );
        expect(dbService.lastSyncSuccess?.getTime()).toEqual(
          service.syncStatus.lastSuccessAt?.getTime(),
        );
        expect(dbService.nextScheduledSync?.getTime()).toEqual(
          service.syncStatus.nextScheduledSync?.getTime(),
        );

        // JSON syncStatus should NOT have the extracted dates
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { lastAttemptAt, lastSuccessAt, nextScheduledSync, ...syncStatusData } =
          service.syncStatus;
        expect(dbService.syncStatus).toEqual(syncStatusData);
        expect(dbService.metadata).toEqual(service.metadata);

        // Status
        expect(dbService.isActive).toBe(service.isActive);
        expect(dbService.isPaused).toBe(service.isPaused);

        // Timestamps
        expect(dbService.connectedAt).toEqual(service.connectedAt);
        expect(dbService.lastSyncAt).toEqual(service.lastSyncAt);
        expect(dbService.updatedAt).toEqual(service.updatedAt);
      });
    });

    it('should handle optional fields correctly', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const service = createConnectedServiceFixture({
          credentials: {
            accessToken: 'token',
            refreshToken: undefined,
            expiresAt: undefined,
            scopes: ['read'],
            tokenType: 'Bearer',
          },
          lastSyncAt: undefined,
        });

        const dbService = toDatabase(service);

        expect(dbService.refreshTokenEncrypted).toBeUndefined();
        expect(dbService.tokenExpiresAt).toBeUndefined();
        expect(dbService.lastSyncAt).toBeUndefined();
      });
    });

    it('should join scopes array with commas', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const service = createConnectedServiceFixture({
          credentials: {
            accessToken: 'token',
            scopes: ['workouts', 'heart_rate', 'steps', 'sleep'],
            tokenType: 'Bearer',
          },
        });

        const dbService = toDatabase(service);
        expect(dbService.scope).toBe('workouts,heart_rate,steps,sleep');
      });
    });
  });

  describe('toDomain', () => {
    it('should map database row to domain entity', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });

        // Create and insert test data
        const service = createConnectedServiceFixture({ id: 'db_test_1' });
        await db.insert(connectedServices).values(toDatabase(service));

        // Read back from database
        const dbRow = await db.query.connectedServices.findFirst({
          where: eq(connectedServices.id, 'db_test_1'),
        });

        expect(dbRow).toBeDefined();

        // Map to domain
        const domainService = toDomain(dbRow!);

        // Core fields
        expect(domainService.id).toBe('db_test_1');
        expect(domainService.userId).toBe(service.userId);
        expect(domainService.serviceType).toBe(service.serviceType);

        // Credentials
        expect(domainService.credentials.accessToken).toBe(service.credentials.accessToken);
        expect(domainService.credentials.tokenType).toBe('Bearer');
        expect(Array.isArray(domainService.credentials.scopes)).toBe(true);

        // JSON fields
        expect(domainService.permissions).toBeDefined();
        expect(domainService.syncStatus).toBeDefined();
        expect(domainService.metadata).toBeDefined();

        // Status
        expect(typeof domainService.isActive).toBe('boolean');
        expect(typeof domainService.isPaused).toBe('boolean');

        // Timestamps
        expect(domainService.connectedAt).toBeInstanceOf(Date);
        expect(domainService.updatedAt).toBeInstanceOf(Date);
      });
    });

    it('should split scope string into scopes array', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });

        const service = createConnectedServiceFixture({
          id: 'scope_test',
          credentials: {
            accessToken: 'token',
            scopes: ['activity:read', 'activity:write', 'profile:read'],
            tokenType: 'Bearer',
          },
        });

        await db.insert(connectedServices).values(toDatabase(service));
        const dbRow = await db.query.connectedServices.findFirst({
          where: eq(connectedServices.id, 'scope_test'),
        });

        const domainService = toDomain(dbRow!);

        expect(domainService.credentials.scopes).toEqual([
          'activity:read',
          'activity:write',
          'profile:read',
        ]);
      });
    });

    it('should handle null scopes as empty array', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });

        const service = createConnectedServiceFixture({
          id: 'empty_scope_test',
          credentials: {
            accessToken: 'token',
            scopes: [],
            tokenType: 'Bearer',
          },
        });

        await db.insert(connectedServices).values(toDatabase(service));
        const dbRow = await db.query.connectedServices.findFirst({
          where: eq(connectedServices.id, 'empty_scope_test'),
        });

        const domainService = toDomain(dbRow!);
        expect(domainService.credentials.scopes).toEqual([]);
      });
    });

    it('should convert null to undefined for optional fields', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });

        const service = createConnectedServiceFixture({
          id: 'optional_test',
          credentials: {
            accessToken: 'token',
            refreshToken: undefined,
            expiresAt: undefined,
            scopes: ['read'],
            tokenType: 'Bearer',
          },
          lastSyncAt: undefined,
        });

        await db.insert(connectedServices).values(toDatabase(service));
        const dbRow = await db.query.connectedServices.findFirst({
          where: eq(connectedServices.id, 'optional_test'),
        });

        const domainService = toDomain(dbRow!);

        expect(domainService.credentials.refreshToken).toBeUndefined();
        expect(domainService.credentials.expiresAt).toBeUndefined();
        expect(domainService.lastSyncAt).toBeUndefined();
      });
    });
  });

  describe('Round-trip integrity', () => {
    it('should maintain data through Domain → DB → Domain', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });

        const original = createConnectedServiceFixture({
          id: 'roundtrip_test',
          serviceType: 'strava',
        });

        // Insert into DB
        await db.insert(connectedServices).values(toDatabase(original));

        // Read back
        const dbRow = await db.query.connectedServices.findFirst({
          where: eq(connectedServices.id, 'roundtrip_test'),
        });

        expect(dbRow).toBeDefined();

        // Convert back to domain
        const reconstructed = toDomain(dbRow!);

        // Core fields
        expect(reconstructed.id).toBe(original.id);
        expect(reconstructed.userId).toBe(original.userId);
        expect(reconstructed.serviceType).toBe(original.serviceType);

        // Credentials (note: tokenType is hardcoded to 'Bearer' in mapper)
        expect(reconstructed.credentials.accessToken).toBe(original.credentials.accessToken);
        expect(reconstructed.credentials.refreshToken).toBe(original.credentials.refreshToken);
        expect(reconstructed.credentials.expiresAt).toEqual(original.credentials.expiresAt);
        expect(reconstructed.credentials.scopes).toEqual(original.credentials.scopes);
        expect(reconstructed.credentials.tokenType).toBe('Bearer');

        // JSON fields
        expect(reconstructed.permissions).toEqual(original.permissions);
        expect(reconstructed.syncStatus).toEqual(original.syncStatus);
        expect(reconstructed.metadata).toEqual(original.metadata);

        // Status
        expect(reconstructed.isActive).toBe(original.isActive);
        expect(reconstructed.isPaused).toBe(original.isPaused);

        // Timestamps
        expect(reconstructed.connectedAt).toEqual(original.connectedAt);
        expect(reconstructed.lastSyncAt).toEqual(original.lastSyncAt);
        expect(reconstructed.updatedAt).toEqual(original.updatedAt);
      });
    });

    it('should handle schema defaults correctly', async () => {
      await runInDurableObject(stub, async (instance: any, state: any) => {
        const db = drizzle(state.storage, { schema: user_do_schema });

        const service = createConnectedServiceFixture({
          id: 'defaults_test',
          isActive: true, // Match DB default
          isPaused: false, // Match DB default
        });

        await db.insert(connectedServices).values(toDatabase(service));
        const dbRow = await db.query.connectedServices.findFirst({
          where: eq(connectedServices.id, 'defaults_test'),
        });

        const reconstructed = toDomain(dbRow!);

        // Schema defaults should be applied
        expect(reconstructed.isActive).toBe(true);
        expect(reconstructed.isPaused).toBe(false);
        expect(reconstructed.connectedAt).toBeInstanceOf(Date);
        expect(reconstructed.updatedAt).toBeInstanceOf(Date);
      });
    });
  });
});
