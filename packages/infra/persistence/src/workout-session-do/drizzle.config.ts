import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './migrations',
  schema: './schema/*',
  dialect: 'sqlite',
  driver: 'durable-sqlite',
  dbCredentials: {
    url: '',
  },
});
