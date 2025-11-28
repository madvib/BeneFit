import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { users } from './users.js';
import { completedWorkouts } from './workouts.js';

export const planTemplates = sqliteTable('plan_templates', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),

  // Author
  authorUserId: text('author_user_id').references(() => users.id),
  authorName: text('author_name').notNull(),
  authorCredentials: text('author_credentials'),

  // Tags for discovery
  tags: text('tags', { mode: 'json' }).notNull(), // string[]

  // Template structure (JSON serialized)
  structure: text('structure', { mode: 'json' }).notNull(), // TemplateStructure
  rules: text('rules', { mode: 'json' }).notNull(), // TemplateRules

  // Metadata
  isPublic: integer('is_public', { mode: 'boolean' }).notNull().default(false),
  isFeatured: integer('is_featured', { mode: 'boolean' }).notNull().default(false),
  isVerified: integer('is_verified', { mode: 'boolean' }).notNull().default(false),
  rating: real('rating'),
  usageCount: integer('usage_count').notNull().default(0),

  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  publishedAt: integer('published_at', { mode: 'timestamp' }),
}, (table) => ({
  authorIdx: index('plan_templates_author_idx').on(table.authorUserId),
  publicIdx: index('plan_templates_public_idx').on(table.isPublic),
  featuredIdx: index('plan_templates_featured_idx').on(table.isFeatured),
  ratingIdx: index('plan_templates_rating_idx').on(table.rating),
}));

// Plan metadata only - full plan lives in UserAgent DO
export const workoutPlansMetadata = sqliteTable('workout_plans_metadata', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),

  // Basic info
  name: text('name').notNull(),
  status: text('status').notNull(), // 'draft' | 'active' | 'paused' | 'completed' | 'abandoned'

  // Template reference
  templateId: text('template_id').references(() => planTemplates.id),

  // Dates
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  startedAt: integer('started_at', { mode: 'timestamp' }),
  completedAt: integer('completed_at', { mode: 'timestamp' }),
  abandonedAt: integer('abandoned_at', { mode: 'timestamp' }),

  // Quick stats
  totalWeeks: integer('total_weeks').notNull(),
  currentWeek: integer('current_week').notNull().default(1),
  completedWorkouts: integer('completed_workouts').notNull().default(0),
  totalScheduledWorkouts: integer('total_scheduled_workouts').notNull(),
}, (table) => ({
  userIdIdx: index('workout_plans_metadata_user_id_idx').on(table.userId),
  statusIdx: index('workout_plans_metadata_status_idx').on(table.status),
  userStatusIdx: index('workout_plans_metadata_user_status_idx').on(table.userId, table.status),
}));

export const planTemplatesRelations = relations(planTemplates, ({ one, many }) => ({
  author: one(users, {
    fields: [planTemplates.authorUserId],
    references: [users.id],
  }),
}));

export const workoutPlansMetadataRelations = relations(workoutPlansMetadata, ({ one, many }) => ({
  user: one(users, {
    fields: [workoutPlansMetadata.userId],
    references: [users.id],
  }),
  template: one(planTemplates, {
    fields: [workoutPlansMetadata.templateId],
    references: [planTemplates.id],
  }),
  workouts: many(completedWorkouts),
}));

// Type exports
export type PlanTemplate = typeof planTemplates.$inferSelect;
export type NewPlanTemplate = typeof planTemplates.$inferInsert;

export type WorkoutPlanMetadata = typeof workoutPlansMetadata.$inferSelect;
export type NewWorkoutPlanMetadata = typeof workoutPlansMetadata.$inferInsert;