import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { participants } from './participants.js';

export const activityProgress = sqliteTable(
  'activity_progress',
  {
    id: text('id').primaryKey(),
    participantId: text('participant_id')
      .references(() => participants.id)
      .notNull(),
    activityId: text('activity_id').notNull(),
    activityName: text('activity_name').notNull(),
    orderIndex: integer('order_index').notNull(),
    status: text('status', {
      enum: ['not_started', 'in_progress', 'completed'],
    }).default('not_started'),
    startedAt: integer('started_at', { mode: 'timestamp_ms' }),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }),

    // Live metrics
    currentSet: integer('current_set'),
    currentRep: integer('current_rep'),
    currentWeight: real('current_weight'),
    currentDistanceMeters: integer('current_distance_meters'),
    currentHeartRate: integer('current_heart_rate'),

    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (table) => [
    index('activity_progress_participant_id_order_idx').on(
      table.participantId,
      table.orderIndex,
    ),
  ],
);

export const activityProgressRelations = relations(activityProgress, ({ one }) => ({
  participant: one(participants, {
    fields: [activityProgress.participantId],
    references: [participants.id],
  }),
}));

export type ActivityProgress = typeof activityProgress.$inferSelect;
export type NewActivityProgress = typeof activityProgress.$inferInsert;
