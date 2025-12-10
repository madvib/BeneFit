import { sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const usersPublic = sqliteTable('users_public', {
  id: text('id').primaryKey(), // The UserID from Auth/DO
  handle: text('handle').notNull(),
  name: text('name').notNull(),
  avatarUrl: text('avatar_url'),
  lastActive: text('last_active'), // Optional for presence/sorting
}, (users) => [
  uniqueIndex('handle_idx').on(users.handle),
  uniqueIndex('name_idx').on(users.name),
]);

export type UserPublic = typeof usersPublic.$inferSelect;
export type NewUserPublic = typeof usersPublic.$inferInsert;
