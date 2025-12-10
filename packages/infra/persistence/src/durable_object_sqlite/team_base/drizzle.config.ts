import { defineConfig } from 'drizzle-kit';

const base_dir = "./src/durable_object_sqlite/team_base"

export default defineConfig({
  out: `${base_dir}/migrations`,
  schema: `${base_dir}/schema/*`,
  dialect: 'sqlite',
  driver: 'durable-sqlite',
});
