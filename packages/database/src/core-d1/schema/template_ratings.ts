import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
import { sql, relations } from 'drizzle-orm';
import { planTemplates } from './plan_templates.js';

export const templateRatings = sqliteTable(
  'template_ratings',
  {
    id: text('id').primaryKey(),
    templateId: text('template_id').references(() => planTemplates.id),
    userId: text('user_id').notNull(),
    rating: integer('rating').notNull(), // 1-5
    reviewText: text('review_text'),
    createdAt: integer('created_at', { mode: 'timestamp' }).default(sql`(unixepoch())`),
  },
  (table) => ({
    templateIdIdx: index('template_ratings_template_id_idx').on(table.templateId),
    userIdIdx: index('template_ratings_user_id_idx').on(table.userId),
  }),
);

export const templateRatingsRelations = relations(templateRatings, ({ one }) => ({
  template: one(planTemplates, {
    fields: [templateRatings.templateId],
    references: [planTemplates.id],
  }),
}));

export type TemplateRating = typeof templateRatings.$inferSelect;
export type NewTemplateRating = typeof templateRatings.$inferInsert;
