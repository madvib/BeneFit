import { eq, and, desc } from 'drizzle-orm';
import { Result } from '@bene/domain';
import type { ConnectedService } from '@bene/domain/integrations';
import type { ConnectedServiceRepository } from '@bene/application/integrations';
import type { DbClient } from '@bene/database';
import { connectedServices } from '@bene/database/schema';

export class D1ConnectedServiceRepository implements ConnectedServiceRepository {
  constructor(private db: DbClient) {}

  async findById(serviceId: string): Promise<Result<ConnectedService>> {
    try {
      const row = await this.db
        .select()
        .from(connectedServices)
        .where(eq(connectedServices.id, serviceId))
        .limit(1);

      if (row.length === 0) {
        return Result.fail(`Connected service ${serviceId} not found`);
      }

      const service = this.toDomain(row[0]);
      return Result.ok(service);
    } catch (error) {
      return Result.fail(`Failed to find connected service: ${error}`);
    }
  }

  async findByUserId(userId: string): Promise<Result<ConnectedService[]>> {
    try {
      const rows = await this.db
        .select()
        .from(connectedServices)
        .where(eq(connectedServices.userId, userId))
        .orderBy(desc(connectedServices.connectedAt));

      const services = rows.map(row => this.toDomain(row));
      return Result.ok(services);
    } catch (error) {
      return Result.fail(`Failed to find connected services: ${error}`);
    }
  }

  async findByUserIdAndType(
    userId: string,
    serviceType: string,
  ): Promise<Result<ConnectedService | null>> {
    try {
      const row = await this.db
        .select()
        .from(connectedServices)
        .where(
          and(
            eq(connectedServices.userId, userId),
            eq(connectedServices.serviceType, serviceType)
          )
        )
        .limit(1);

      if (row.length === 0) {
        return Result.ok(null);
      }

      const service = this.toDomain(row[0]);
      return Result.ok(service);
    } catch (error) {
      return Result.fail(`Failed to find connected service: ${error}`);
    }
  }

  async findDueForSync(): Promise<Result<ConnectedService[]>> {
    try {
      // For now, return all active services - in reality this would check lastSyncAt
      const rows = await this.db
        .select()
        .from(connectedServices)
        .where(eq(connectedServices.isActive, true))
        .orderBy(desc(connectedServices.lastSyncAt));

      const services = rows.map(row => this.toDomain(row));
      return Result.ok(services);
    } catch (error) {
      return Result.fail(`Failed to find connected services due for sync: ${error}`);
    }
  }

  async save(service: ConnectedService): Promise<Result<void>> {
    try {
      const row = this.toDatabase(service);

      // Upsert
      await this.db.insert(connectedServices).values(row).onConflictDoUpdate({
        target: connectedServices.id,
        set: row,
      });

      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to save connected service: ${error}`);
    }
  }

  async delete(serviceId: string): Promise<Result<void>> {
    try {
      await this.db
        .delete(connectedServices)
        .where(eq(connectedServices.id, serviceId));

      return Result.ok();
    } catch (error) {
      return Result.fail(`Failed to delete connected service: ${error}`);
    }
  }

  // MAPPERS

  private toDomain(row: typeof connectedServices.$inferSelect): ConnectedService {
    return {
      id: row.id,
      userId: row.userId,
      serviceType: row.serviceType as any,
      credentials: row.credentialsEncrypted, // This would be decrypted in a real implementation
      permissions: row.permissions as any, // Placeholder for actual permissions type
      syncStatus: row.syncStatus as any, // Placeholder for actual sync status type
      metadata: row.metadata as any, // Placeholder for actual metadata type
      isActive: row.isActive,
      isPaused: row.isPaused,
      connectedAt: row.connectedAt,
      lastSyncAt: row.lastSyncAt || undefined,
      updatedAt: row.updatedAt,
    };
  }

  private toDatabase(service: ConnectedService): typeof connectedServices.$inferInsert {
    return {
      id: service.id,
      userId: service.userId,
      serviceType: service.serviceType,
      credentialsEncrypted: service.credentials,
      permissions: service.permissions as any,
      syncStatus: service.syncStatus as any,
      metadata: service.metadata as any,
      isActive: service.isActive,
      isPaused: service.isPaused,
      connectedAt: service.connectedAt,
      lastSyncAt: service.lastSyncAt,
      updatedAt: service.updatedAt,
    };
  }
}