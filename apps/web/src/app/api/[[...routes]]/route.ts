import { Hono } from 'hono';
import { handle } from 'hono/vercel';

const app = new Hono().basePath('/api').get('/hello', (c) => {
  console.log(c);
  return c.json({
    message: 'Hello Next.js!',
  });
});

export const GET = handle(app);
export const POST = handle(app);

export type HelloType = typeof app;
