import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const completedWorkouts = sqliteTable(
  'completed_workouts',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(), // CRITICAL: Added from domain
    workoutId: text('workout_id').notNull(),
    
    // Plan reference
    planId: text('plan_id'), // nullable
    workoutTemplateId: text('workout_template_id'),
    weekNumber: integer('week_number'),
    dayNumber: integer('day_number'),
    
    // Workout details
    workoutType: text('workout_type', { enum: ['strength', 'cardio', 'flexibility', 'hybrid'] }).notNull(),
    description: text('description'),
    
    // Timing
    completedAt: integer('completed_at', { mode: 'timestamp' }).notNull(),
    recordedAt: integer('recorded_at', { mode: 'timestamp' }).notNull(), // When actually completed
    durationSeconds: integer('duration_seconds').notNull(),
    
    // Subjective feedback
    notes: text('notes'),
    feelingRating: integer('feeling_rating'), // 1-5, nullable
    
    // Full detailed data
    activitiesJson: text('activities_json', { mode: 'json' }).notNull(), // all sets/reps/weights/times
    heartRateDataJson: text('heart_rate_data_json', { mode: 'json' }), // nullable - time series
    gpsDataJson: text('gps_data_json', { mode: 'json' }), // nullable - route
    
    // Calculated metrics
    totalVolume: integer('total_volume'), // nullable - for strength
    distanceMeters: integer('distance_meters'), // nullable - for cardio
    caloriesBurned: integer('calories_burned'), // nullable
    
    // Social
    isPublic: integer('is_public', { mode: 'boolean' }).default(false),
    multiplayerSessionId: text('multiplayer_session_id'),
    
    // LEGACY FIELDS (from workouts.ts) - Consider adding if needed:
    // performance: text('performance', { mode: 'json' }) - Full WorkoutPerformance object as single JSON
    //   (currently split into activitiesJson, heartRateDataJson, etc.)
    // verification: text('verification', { mode: 'json' }) - WorkoutVerification object for corporate sponsors
    // reactionCount: integer('reaction_count').default(0) - Denormalized reaction count
    
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (table) => ({
    userIdIdx: index('completed_workouts_user_id_idx').on(table.userId),
    completedAtIdx: index('completed_workouts_completed_at_idx').on(table.completedAt),
    planIdIdx: index('completed_workouts_plan_id_idx').on(table.planId),
    // LEGACY INDEXES - Consider adding:
    // recordedAtIdx: index('completed_workouts_recorded_at_idx').on(table.recordedAt),
    // userRecordedIdx: index('completed_workouts_user_recorded_idx').on(table.userId, table.recordedAt),
    // publicIdx: index('completed_workouts_public_idx').on(table.isPublic),
  })
);

export type CompletedWorkout = typeof completedWorkouts.$inferSelect;
export type NewCompletedWorkout = typeof completedWorkouts.$inferInsert;
