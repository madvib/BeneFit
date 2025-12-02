import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const fitnessGoals = sqliteTable(
  'fitness_goals',
  {
    id: text('id').primaryKey(),
    goalType: text('goal_type', { enum: ['strength', 'hypertrophy', 'endurance', 'weight_loss', 'weight_gain', 'general_fitness', 'sport_specific', 'mobility', 'rehabilitation'] }).notNull(),
    secondaryGoals: text('secondary_goals', { mode: 'json' }), // string[]
    
    // Weight targets
    currentWeight: real('current_weight'),
    targetWeight: real('target_weight'),
    weightUnit: text('weight_unit', { enum: ['kg', 'lbs'] }),
    targetBodyFat: real('target_body_fat'), // percentage
    
    targetDate: integer('target_date', { mode: 'timestamp' }),
    
    // Qualitative
    motivation: text('motivation'),
    successCriteria: text('success_criteria', { mode: 'json' }), // string[]
    
    status: text('status', { enum: ['active', 'achieved', 'abandoned'] }).default('active'),
    notes: text('notes'),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  }
);

export type FitnessGoal = typeof fitnessGoals.$inferSelect;
export type NewFitnessGoal = typeof fitnessGoals.$inferInsert;
