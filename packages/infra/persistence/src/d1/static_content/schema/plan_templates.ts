import { sqliteTable, text, integer, real, index } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

export const planTemplates = sqliteTable(
  'plan_templates',
  {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),

    // Author
    authorUserId: text('author_user_id'),
    authorName: text('author_name').notNull(),
    authorCredentials: text('author_credentials'),

    // Extracted for querying/filtering
    minExperienceLevel: text('min_experience_level', {
      enum: ['beginner', 'intermediate', 'advanced'],
    }).notNull(),
    maxExperienceLevel: text('max_experience_level', {
      enum: ['beginner', 'intermediate', 'advanced'],
    }).notNull(),

    // Duration (extracted from structure)
    durationType: text('duration_type', { enum: ['fixed', 'variable'] }).notNull(),
    durationWeeksMin: integer('duration_weeks_min').notNull(),
    durationWeeksMax: integer('duration_weeks_max').notNull(),

    // Frequency (extracted from structure)
    frequencyType: text('frequency_type', { enum: ['fixed', 'flexible'] }).notNull(),
    workoutsPerWeekMin: integer('workouts_per_week_min').notNull(),
    workoutsPerWeekMax: integer('workouts_per_week_max').notNull(),
    // Structure
    // Tags/focus areas (for search/filter)
    tags: text('tags', { mode: 'json' }).notNull(), // string[]

    // Equipment (extracted from rules for filtering)
    requiredEquipment: text('required_equipment', { mode: 'json' }), // string[] | null

    // Full complex data (source of truth)
    structureJson: text('structure_json', { mode: 'json' }).notNull(), // TemplateStructure
    rulesJson: text('rules_json', { mode: 'json' }).notNull(), // TemplateRules

    // Metadata
    isPublic: integer('is_public', { mode: 'boolean' }).default(false).notNull(),
    isFeatured: integer('is_featured', { mode: 'boolean' }).default(false).notNull(),
    isVerified: integer('is_verified', { mode: 'boolean' }).default(false).notNull(),

    // Denormalized metrics
    ratingAverage: real('rating_average'),
    ratingCount: integer('rating_count').default(0).notNull(),
    usageCount: integer('usage_count').default(0).notNull(),

    // Versioning
    version: integer('version').default(1).notNull(),

    // Preview (small, display-only)
    previewWorkouts: text('preview_workouts', { mode: 'json' }), // WorkoutPreview[]

    createdAt: integer('created_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' })
      .default(sql`(unixepoch())`)
      .notNull(),
    publishedAt: integer('published_at', { mode: 'timestamp' }),
  },
  (table) => ({
    // Indexes for common filters
    experienceIdx: index('plan_templates_experience_idx').on(
      table.minExperienceLevel,
      table.maxExperienceLevel,
    ),
    durationIdx: index('plan_templates_duration_idx').on(
      table.durationWeeksMin,
      table.durationWeeksMax,
    ),
    publicFeaturedIdx: index('plan_templates_public_featured_idx').on(
      table.isPublic,
      table.isFeatured,
    ),
    ratingIdx: index('plan_templates_rating_idx').on(table.ratingAverage),
  }),
);

export type PlanTemplate = typeof planTemplates.$inferSelect;
export type NewPlanTemplate = typeof planTemplates.$inferInsert;
