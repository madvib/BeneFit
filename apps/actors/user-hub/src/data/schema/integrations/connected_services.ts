import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';
import {
  ServiceType,
  ServicePermissions,
  SyncStatus,
  ServiceMetadata,
} from '@bene/integrations-domain';

export const connectedServices = sqliteTable(
  'connected_services',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    serviceType: text('service_type').notNull().$type<ServiceType>(),

    // OAuth credentials (encrypted)
    accessTokenEncrypted: text('access_token_encrypted').notNull(),
    refreshTokenEncrypted: text('refresh_token_encrypted'),
    tokenExpiresAt: integer('token_expires_at', { mode: 'timestamp_ms' }),
    scope: text('scope'), // OAuth scope

    // Service info
    serviceUserId: text('service_user_id'),




    // Permissions and sync - dates extracted for queryability
    permissions: text('permissions', { mode: 'json' }).notNull().$type<ServicePermissions>(),
    lastSyncAttempt: integer('last_sync_attempt', { mode: 'timestamp_ms' }),
    lastSyncSuccess: integer('last_sync_success', { mode: 'timestamp_ms' }),
    nextScheduledSync: integer('next_scheduled_sync', { mode: 'timestamp_ms' }),
    syncStatus: text('sync_status', { mode: 'json' })
      .notNull()
      .$type<Omit<SyncStatus, 'lastAttemptAt' | 'lastSuccessAt' | 'nextScheduledSync'>>(),
    metadata: text('metadata', { mode: 'json' }).notNull().$type<ServiceMetadata>(),

    // State
    isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
    isPaused: integer('is_paused', { mode: 'boolean' }).notNull().default(false),

    // LEGACY FIELDS (from integrations) - Consider adding if needed:
    // credentialsEncrypted: text('credentials_encrypted') - All OAuth credentials as single encrypted JSON
    //   (currently split into accessTokenEncrypted, refreshTokenEncrypted, tokenExpiresAt, scope)
    //   This approach may be simpler for credential rotation

    // Timestamps
    connectedAt: integer('connected_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    lastSyncAt: integer('last_sync_at', { mode: 'timestamp_ms' }),
    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
    updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index('connected_services_user_id_service_type_idx').on(
      table.userId,
      table.serviceType,
    ),
    // LEGACY INDEXES - Consider adding:
    // activeIdx: index('connected_services_active_idx').on(table.isActive),
  ],
);

export type DbConnectedService = typeof connectedServices.$inferSelect;
export type NewDbConnectedService = typeof connectedServices.$inferInsert;
