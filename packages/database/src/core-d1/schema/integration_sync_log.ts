import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const integrationSyncLog = sqliteTable(
  'integration_sync_log',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    serviceType: text('service_type', { enum: ['strava', 'garmin', 'apple_health', 'whoop'] }),
    syncStartedAt: integer('sync_started_at', { mode: 'timestamp' }).notNull(),
    syncCompletedAt: integer('sync_completed_at', { mode: 'timestamp' }),
    status: text('status', { enum: ['success', 'failed', 'in_progress'] }),
    workoutsSyncedCount: integer('workouts_synced_count').default(0),
    errorMessage: text('error_message'),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (table) => ({
    userIdIdx: index('integration_sync_log_user_id_idx').on(table.userId),
  })
);

export type IntegrationSyncLog = typeof integrationSyncLog.$inferSelect;
export type NewIntegrationSyncLog = typeof integrationSyncLog.$inferInsert;
