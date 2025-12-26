import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './migrations',
  schema: `./src/data/schema/*`,
  dialect: 'sqlite',
  driver: 'durable-sqlite',
});
