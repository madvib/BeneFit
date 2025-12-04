import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const connectedServices = sqliteTable(
  'connected_services',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    serviceType: text('service_type', { enum: ['strava', 'garmin', 'apple_health', 'whoop', 'fitbit', 'peloton', 'polar', 'coros', 'google_fit'] }),
    
    // OAuth credentials (encrypted)
    accessTokenEncrypted: text('access_token_encrypted').notNull(),
    refreshTokenEncrypted: text('refresh_token_encrypted'),
    tokenExpiresAt: integer('token_expires_at', { mode: 'timestamp' }),
    scope: text('scope'), // OAuth scope
    
    // Service info
    serviceUserId: text('service_user_id'),
    
    // Permissions and sync
    permissions: text('permissions', { mode: 'json' }), // ServicePermissions
    syncStatus: text('sync_status', { mode: 'json' }), // SyncStatus
    metadata: text('metadata', { mode: 'json' }), // ServiceMetadata
    
    // State
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    isPaused: integer('is_paused', { mode: 'boolean' }).default(false),
    
    // LEGACY FIELDS (from integrations.ts) - Consider adding if needed:
    // credentialsEncrypted: text('credentials_encrypted') - All OAuth credentials as single encrypted JSON
    //   (currently split into accessTokenEncrypted, refreshTokenEncrypted, tokenExpiresAt, scope)
    //   This approach may be simpler for credential rotation
    
    // Timestamps
    connectedAt: integer('connected_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    lastSyncAt: integer('last_sync_at', { mode: 'timestamp' }),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (table) => ({
    userIdServiceTypeIdx: index('connected_services_user_id_service_type_idx').on(table.userId, table.serviceType),
    // LEGACY INDEXES - Consider adding:
    // activeIdx: index('connected_services_active_idx').on(table.isActive),
  })
);

export type ConnectedService = typeof connectedServices.$inferSelect;
export type NewConnectedService = typeof connectedServices.$inferInsert;
