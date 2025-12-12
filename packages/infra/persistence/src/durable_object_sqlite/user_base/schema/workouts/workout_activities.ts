import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { completedWorkouts } from './completed_workouts';

export const workoutActivities = sqliteTable(
  'workout_activities',
  {
    id: text('id').primaryKey(),
    completedWorkoutId: text('completed_workout_id')
      .references(() => completedWorkouts.id)
      .notNull(),
    activityType: text('activity_type', {
      enum: ['strength', 'cardio', 'flexibility'],
    }).notNull(),
    exerciseId: text('exercise_id').notNull(),
    exerciseName: text('exercise_name').notNull(),
    orderIndex: integer('order_index').notNull(),

    // Strength-specific
    setsJson: text('sets_json', { mode: 'json' }), // nullable - [{reps, weight, rest_seconds}]

    // Cardio-specific
    durationSeconds: integer('duration_ms'), // nullable
    distanceMeters: integer('distance_meters'), // nullable
    paceAvg: real('pace_avg'), // nullable
    heartRateAvg: integer('heart_rate_avg'), // nullable

    // Flexibility-specific
    holdDurationSeconds: integer('hold_duration_seconds'), // nullable

    notes: text('notes'),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }).default(
      sql`(unixepoch())`,
    ),
  },
  (table) => [
    index('workout_activities_completed_workout_id_idx').on(
      table.completedWorkoutId,
    ),
  ],
);

export const workoutActivitiesRelations = relations(workoutActivities, ({ one }) => ({
  completedWorkout: one(completedWorkouts, {
    fields: [workoutActivities.completedWorkoutId],
    references: [completedWorkouts.id],
  }),
}));

export type WorkoutActivity = typeof workoutActivities.$inferSelect;
export type NewWorkoutActivity = typeof workoutActivities.$inferInsert;
