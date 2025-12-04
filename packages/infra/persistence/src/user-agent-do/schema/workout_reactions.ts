import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { completedWorkouts } from './completed_workouts.js';

export const workoutReactions = sqliteTable(
  'workout_reactions',
  {
    id: text('id').primaryKey(),
    workoutId: text('workout_id').references(() => completedWorkouts.id).notNull(),
    userId: text('user_id').notNull(),
    userName: text('user_name').notNull(),
    reactionType: text('reaction_type', { enum: ['fire', 'strong', 'clap', 'heart', 'smile'] }).notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (table) => ({
    workoutIdIdx: index('workout_reactions_workout_id_idx').on(table.workoutId),
    userWorkoutIdx: index('workout_reactions_user_workout_idx').on(table.userId, table.workoutId),
  })
);

export const workoutReactionsRelations = relations(workoutReactions, ({ one }) => ({
  workout: one(completedWorkouts, {
    fields: [workoutReactions.workoutId],
    references: [completedWorkouts.id],
  }),
}));

export type WorkoutReaction = typeof workoutReactions.$inferSelect;
export type NewWorkoutReaction = typeof workoutReactions.$inferInsert;
