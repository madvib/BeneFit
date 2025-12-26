import { type DrizzleSqliteDODatabase } from 'drizzle-orm/durable-sqlite';
import { eq, and, desc, or, isNull, lt } from 'drizzle-orm';
import {
  Result,
  EntityNotFoundError,
  QueryError,
  SaveError,
  DeleteError,
} from '@bene/shared';
import type { ConnectedService, ServiceType } from '@bene/integrations-domain';
import type { ConnectedServiceRepository } from '@bene/integrations-domain';
import { toDatabase, toDomain } from '../mappers/connected-service.mapper.js';
import {
  connectedServices,
  integrations_schema,
} from '../data/schema/integrations/index.js';

export class DurableConnectedServiceRepository implements ConnectedServiceRepository {
  constructor(private db: DrizzleSqliteDODatabase<typeof integrations_schema>) {}

  async findById(serviceId: string): Promise<Result<ConnectedService>> {
    try {
      const row = await this.db
        .select()
        .from(connectedServices)
        .where(eq(connectedServices.id, serviceId))
        .limit(1);

      if (row.length === 0) {
        return Result.fail(new EntityNotFoundError('ConnectedService', serviceId));
      }

      const service = toDomain(row[0]!);
      return Result.ok(service);
    } catch (error) {
      return Result.fail(
        new QueryError(
          'find',
          'ConnectedService',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async findByUserId(userId: string): Promise<Result<ConnectedService[]>> {
    try {
      const rows = await this.db
        .select()
        .from(connectedServices)
        .where(eq(connectedServices.userId, userId))
        .orderBy(desc(connectedServices.connectedAt));

      const services = rows.map((row) => toDomain(row));
      return Result.ok(services);
    } catch (error) {
      return Result.fail(
        new QueryError(
          'find by user',
          'ConnectedServices',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async findByUserIdAndType(
    userId: string,
    serviceType: ServiceType,
  ): Promise<Result<ConnectedService | null>> {
    try {
      const row = await this.db
        .select()
        .from(connectedServices)
        .where(
          and(
            eq(connectedServices.userId, userId),
            eq(connectedServices.serviceType, serviceType),
          ),
        )
        .limit(1);

      if (row.length === 0) {
        return Result.ok(null);
      }

      const service = toDomain(row[0]!);
      return Result.ok(service);
    } catch (error) {
      return Result.fail(
        new QueryError(
          'find by user and type',
          'ConnectedService',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async findDueForSync(): Promise<Result<ConnectedService[]>> {
    try {
      const now = new Date();
      const syncThreshold = new Date(now.getTime() - 60 * 60 * 1000); // 1 hour ago

      const rows = await this.db
        .select()
        .from(connectedServices)
        .where(
          and(
            eq(connectedServices.isActive, true),
            or(
              isNull(connectedServices.lastSyncAt),
              lt(connectedServices.lastSyncAt, syncThreshold),
            ),
          ),
        )
        .orderBy(desc(connectedServices.lastSyncAt));

      const services = rows.map((row) => toDomain(row));
      return Result.ok(services);
    } catch (error) {
      return Result.fail(
        new QueryError(
          'find due for sync',
          'ConnectedServices',
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async save(service: ConnectedService): Promise<Result<void>> {
    try {
      const row = toDatabase(service);

      await this.db.insert(connectedServices).values(row).onConflictDoUpdate({
        target: connectedServices.id,
        set: row,
      });

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new SaveError(
          'ConnectedService',
          service.id,
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async delete(serviceId: string): Promise<Result<void>> {
    try {
      await this.db
        .delete(connectedServices)
        .where(eq(connectedServices.id, serviceId));

      return Result.ok();
    } catch (error) {
      return Result.fail(
        new DeleteError(
          'ConnectedService',
          serviceId,
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }
}
