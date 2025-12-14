import { sqliteTable, text, index } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';
import { planTemplates } from './plan_templates.ts';

export const templateTags = sqliteTable(
  'template_tags',
  {
    id: text('id').primaryKey(),
    templateId: text('template_id').references(() => planTemplates.id),
    tag: text('tag').notNull(),
  },
  (table) => [
    index('template_tags_template_id_idx').on(table.templateId),
    index('template_tags_tag_idx').on(table.tag),
  ]
);

export const templateTagsRelations = relations(templateTags, ({ one }) => ({
  template: one(planTemplates, {
    fields: [templateTags.templateId],
    references: [planTemplates.id],
  }),
}));

export type TemplateTag = typeof templateTags.$inferSelect;
export type NewTemplateTag = typeof templateTags.$inferInsert;
