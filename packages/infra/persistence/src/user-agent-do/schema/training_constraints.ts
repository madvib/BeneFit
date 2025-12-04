import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const trainingConstraints = sqliteTable(
  'training_constraints',
  {
    id: text('id').primaryKey(),
    constraintType: text('constraint_type', { enum: ['injury', 'schedule', 'equipment'] }).notNull(),
    description: text('description').notNull(),
    affectedExercises: text('affected_exercises', { mode: 'json' }).notNull(), // json array of exercise IDs
    availableDays: text('available_days', { mode: 'json' }), // json array of days
    availableEquipment: text('available_equipment', { mode: 'json' }), // json array of equipment
    startDate: integer('start_date', { mode: 'timestamp' }).notNull(),
    endDate: integer('end_date', { mode: 'timestamp' }),
    isActive: integer('is_active', { mode: 'boolean' }).default(true),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  }
);

export type TrainingConstraint = typeof trainingConstraints.$inferSelect;
export type NewTrainingConstraint = typeof trainingConstraints.$inferInsert;
