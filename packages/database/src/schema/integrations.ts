import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';

export const connectedServices = sqliteTable('connected_services', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  serviceType: text('service_type').notNull(), // 'strava' | 'garmin' | 'apple_health' | etc.

  // OAuth credentials (ENCRYPTED in application code)
  credentialsEncrypted: text('credentials_encrypted').notNull(), // JSON encrypted

  // Permissions (JSON serialized)
  permissions: text('permissions', { mode: 'json' }).notNull(), // ServicePermissions

  // Sync status (JSON serialized)
  syncStatus: text('sync_status', { mode: 'json' }).notNull(), // SyncStatus

  // Service metadata (JSON serialized)
  metadata: text('metadata', { mode: 'json' }).notNull(), // ServiceMetadata

  // State
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  isPaused: integer('is_paused', { mode: 'boolean' }).notNull().default(false),

  // Timestamps
  connectedAt: integer('connected_at', { mode: 'timestamp' }).notNull(),
  lastSyncAt: integer('last_sync_at', { mode: 'timestamp' }),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
}, (table) => ({
  userIdIdx: index('connected_services_user_id_idx').on(table.userId),
  userServiceIdx: index('connected_services_user_service_idx').on(table.userId, table.serviceType),
  activeIdx: index('connected_services_active_idx').on(table.isActive),
}));

export const connectedServicesRelations = relations(connectedServices, ({ one }) => ({
  user: one(users, {
    fields: [connectedServices.userId],
    references: [users.id],
  }),
}));

// Type exports
export type ConnectedService = typeof connectedServices.$inferSelect;
export type NewConnectedService = typeof connectedServices.$inferInsert;