import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { authMiddleware } from './middleware/auth';
import { errorHandler } from './middleware/on-error';
import {
  coachRoutes,
  fitnessPlanRoutes,
  integrationRoutes,
  profileRoutes,
  workoutRoutes,
  webhookRoutes,
} from './routes';
import { createAuth } from './lib/better-auth/auth';

const app = new Hono<{
  Bindings: Env;
  Variables: { user: any };
}>()
  .onError(errorHandler)
  .use(
    '/api/*',
    cors({
      origin: ['http://localhost:3000', 'https://staging.getbene.fit', 'https://getbene.fit'],
      allowHeaders: ['Content-Type', 'Authorization'],
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      credentials: true,
    }),
  )
  .on(['POST', 'GET'], '/api/auth/*', (c) => {
    return createAuth(c.env.DB_USER_AUTH).handler(c.req.raw);
  })
  .use('/api/*', authMiddleware)
  .route('/api/coach', coachRoutes)
  .route('/api/fitness-plan', fitnessPlanRoutes)
  .route('/api/integrations', integrationRoutes)
  .route('/api/profile', profileRoutes)
  .route('/api/workouts', workoutRoutes)
  .route('/webhooks', webhookRoutes)
  .get('/ws', async (c) => {
    const user = c.get('user');
    const id = c.env.USER_HUB.idFromName(user.id);
    const stub = c.env.USER_HUB.get(id);

    // Forward WebSocket upgrade request to the UserHub DO
    return await stub.fetch(c.req.raw);
  })
  .get('/health', (c) => {
    return c.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

export default app;

export type AppType = typeof app;
