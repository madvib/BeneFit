import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const workoutMetadata = sqliteTable(
  'workout_metadata',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(),
    teamId: text('team_id'), // nullable
    workoutType: text('workout_type', { enum: ['strength', 'cardio', 'flexibility', 'hybrid'] }),
    completedAt: integer('completed_at', { mode: 'timestamp' }).notNull(),
    durationSeconds: integer('duration_seconds'),
    distanceMeters: integer('distance_meters'), // nullable
    caloriesBurned: integer('calories_burned'), // nullable
    totalVolume: integer('total_volume'), // for strength
    personalRecords: text('personal_records', { mode: 'json' }), // json array of PR types
    feelingRating: integer('feeling_rating'), // 1-5, nullable
    doUserId: text('do_user_id'), // which DO has full workout details
    createdAt: integer('created_at', { mode: 'timestamp' }).default(
    sql`(unixepoch())`),
  },
  (table) => [
    index('workout_metadata_user_id_completed_at_idx').on(table.userId, table.completedAt),
    index('workout_metadata_team_id_completed_at_idx').on(table.teamId, table.completedAt),
    index('workout_metadata_completed_at_idx').on(table.completedAt),
  ]
);

export type WorkoutMetadata = typeof workoutMetadata.$inferSelect;
export type NewWorkoutMetadata = typeof workoutMetadata.$inferInsert;
