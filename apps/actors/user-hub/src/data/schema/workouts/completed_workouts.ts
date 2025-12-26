import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const completedWorkouts = sqliteTable(
  'completed_workouts',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(), // CRITICAL: Added from domain
    workoutId: text('workout_id'),

    // Plan reference
    planId: text('plan_id'), // nullable
    workoutTemplateId: text('workout_template_id'),
    weekNumber: integer('week_number'),
    dayNumber: integer('day_number'),

    // Workout details
    workoutType: text('workout_type', {
      enum: [
        'strength',
        'cardio',
        'flexibility',
        'hybrid',
        'running',
        'cycling',
        'rest',
        'custom',
      ],
    }).notNull(),
    description: text('description'),

    // Timing
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }).notNull(),
    recordedAt: integer('recorded_at', { mode: 'timestamp_ms' }).notNull(), // When actually completed
    durationSeconds: integer('duration_ms').notNull(),

    // Subjective feedback
    notes: text('notes'),
    feelingRating: integer('feeling_rating'), // 1-5, nullable
    percceivedExertion: integer('percceived_exertion'), // 1-5, nullable
    difficultyRating: text('difficulty_rating', {
      enum: ['too_easy', 'just_right', 'too_hard'],
    }), // 1-5, nullable

    // Full detailed data
    performanceJson: text('performance_json', { mode: 'json' }), // Full WorkoutPerformance object as single JSON

    // Calculated metrics
    totalVolume: integer('total_volume'), // nullable - for strength
    distanceMeters: integer('distance_meters'), // nullable - for cardio
    caloriesBurned: integer('calories_burned'), // nullable

    // Verification (for corporate sponsors)
    verificationJson: text('verification_json', { mode: 'json' }), // WorkoutVerification

    // Social
    isPublic: integer('is_public', { mode: 'boolean' }).default(false),
    multiplayerSessionId: text('multiplayer_session_id'),

    //Deprecate?
    heartRateDataJson: text('heart_rate_data_json', { mode: 'json' }), // nullable - time series
    gpsDataJson: text('gps_data_json', { mode: 'json' }), // nullable - route

    // LEGACY FIELDS (from workouts.js) - Consider adding if needed:
    // reactionCount: integer('reaction_count').default(0) - Denormalized reaction count

    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (table) => [
    index('completed_workouts_user_id_idx').on(table.userId),
    index('completed_workouts_completed_at_idx').on(table.completedAt),
    index('completed_workouts_plan_id_idx').on(table.planId),
  ],
);

export type CompletedWorkout = typeof completedWorkouts.$inferSelect;
export type NewCompletedWorkout = typeof completedWorkouts.$inferInsert;
