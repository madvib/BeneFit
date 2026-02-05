import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { workoutActivities } from './workout_activities';
import { workoutReactions } from './workout_reactions';
import {
  WorkoutPerformance,
  WorkoutVerification,
  WorkoutType,
  GPSVerification,
  HeartRateData,
} from '@bene/training-core';

export const completedWorkouts = sqliteTable(
  'completed_workouts',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull(), // CRITICAL: Added from domain
    workoutId: text('workout_id'),

    // Core details
    title: text('title').notNull(),
    description: text('description'),

    // Plan reference
    planId: text('plan_id'), // nullable
    workoutTemplateId: text('workout_template_id'),
    weekNumber: integer('week_number'),
    dayNumber: integer('day_number'),

    // Workout details
    workoutType: text('workout_type').notNull().$type<WorkoutType>(),

    // Timing - lifted from JSON for queryability
    startedAt: integer('started_at', { mode: 'timestamp_ms' }).notNull(),
    completedAt: integer('completed_at', { mode: 'timestamp_ms' }).notNull(),
    recordedAt: integer('recorded_at', { mode: 'timestamp_ms' }).notNull(), // When recorded in system
    durationSeconds: integer('duration_ms').notNull(),

    // Subjective feedback
    notes: text('notes'),
    feelingRating: integer('feeling_rating'), // 1-5, nullable
    percceivedExertion: integer('percceived_exertion'), // 1-5, nullable
    difficultyRating: text('difficulty_rating', {
      enum: ['too_easy', 'just_right', 'too_hard'],
    }), // 1-5, nullable

    // Full detailed data (dates stored as columns above)
    performanceJson: text('performance_json', { mode: 'json' })
      .notNull()
      .$type<Omit<WorkoutPerformance, 'startedAt' | 'completedAt'>>(),

    // Calculated metrics
    totalVolume: integer('total_volume'), // nullable - for strength
    distanceMeters: integer('distance_meters'), // nullable - for cardio
    caloriesBurned: integer('calories_burned'), // nullable

    // Verification (for corporate sponsors)
    verificationJson: text('verification_json', { mode: 'json' })
      .notNull()
      .default(sql`('{"verified":false,"verifications":[],"sponsorEligible":false}')`)
      .$type<WorkoutVerification>(),

    // Social
    isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
    multiplayerSessionId: text('multiplayer_session_id'),

    //Deprecate?
    heartRateDataJson: text('heart_rate_data_json', { mode: 'json' }).$type<HeartRateData[]>(), // nullable - time series
    gpsDataJson: text('gps_data_json', { mode: 'json' }).$type<GPSVerification[]>(), // nullable - route

    // LEGACY FIELDS (from workouts.js) - Consider adding if needed:
    // reactionCount: integer('reaction_count').default(0) - Denormalized reaction count

    createdAt: integer('created_at', { mode: 'timestamp_ms' })
      .notNull()
      .default(sql`(unixepoch() * 1000)`),
  },
  (table) => [
    index('completed_workouts_user_id_idx').on(table.userId),
    index('completed_workouts_completed_at_idx').on(table.completedAt),
    index('completed_workouts_plan_id_idx').on(table.planId),
  ],
);

export type DbCompletedWorkout = typeof completedWorkouts.$inferSelect;
export type NewDbCompletedWorkout = typeof completedWorkouts.$inferInsert;

export const completedWorkoutsRelations = relations(completedWorkouts, ({ many }) => ({
  activities: many(workoutActivities),
  reactions: many(workoutReactions),
}));
