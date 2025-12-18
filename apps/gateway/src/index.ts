import { Hono } from 'hono';
import { authMiddleware } from './middleware/auth';
import { createAuth } from './lib/auth';
import {
  coachRoutes,
  fitnessPlanRoutes,
  integrationRoutes,
  profileRoutes,
  workoutRoutes,
} from './routes';

const app = new Hono<{
  Bindings: Env;
  Variables: { user: any };
}>()
  .on(['POST', 'GET'], '/api/auth/*', (c) => {
    return createAuth(c.env).handler(c.req.raw);
  })
  .use('/api/*', authMiddleware)
  .route('/api/coach', coachRoutes)
  .route('/api/fitness-plan', fitnessPlanRoutes)
  .route('/api/integrations', integrationRoutes)
  .route('/api/profile', profileRoutes)
  .route('/api/workouts', workoutRoutes)
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
