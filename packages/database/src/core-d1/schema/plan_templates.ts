import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const planTemplates = sqliteTable(
  'plan_templates',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    
    // Author
    createdByUserId: text('created_by_user_id'), // nullable
    authorName: text('author_name').notNull(),
    authorCredentials: text('author_credentials'),
    
    // Classification
    experienceLevel: text('experience_level', { enum: ['beginner', 'intermediate', 'advanced'] }),
    durationWeeks: integer('duration_weeks'),
    workoutsPerWeek: integer('workouts_per_week'),
    focusAreas: text('focus_areas', { mode: 'json' }), // json array of strings
    
    // Structure
    weeksJson: text('weeks_json', { mode: 'json' }), // json full template structure
    
    // Metadata
    isPublic: integer('is_public', { mode: 'boolean' }).default(false),
    isFeatured: integer('is_featured', { mode: 'boolean' }).default(false),
    isVerified: integer('is_verified', { mode: 'boolean' }).default(false),
    ratingAverage: real('rating_average'),
    ratingCount: integer('rating_count').default(0),
    usageCount: integer('usage_count').default(0),
    
    // Versioning
    version: integer('version').default(1),
    
    // Preview
    previewWorkouts: text('preview_workouts', { mode: 'json' }), // json array
    
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
    publishedAt: integer('published_at', { mode: 'timestamp' }),
  },
  (table) => ({
    experienceLevelIdx: index('plan_templates_experience_level_idx').on(table.experienceLevel),
    publicFeaturedIdx: index('plan_templates_public_featured_idx').on(table.isPublic, table.isFeatured),
  })
);

export type PlanTemplate = typeof planTemplates.$inferSelect;
export type NewPlanTemplate = typeof planTemplates.$inferInsert;
