import { Hono } from 'hono';
import userRoutes from './routes/users';
import workoutRoutes from './routes/workouts';
import coachRoutes from './routes/coach';
import integrationRoutes from './routes/integrations';

import { UserHub } from '@bene/user-hub';

type Bindings = {
  USER_HUB: DurableObjectNamespace<UserHub>;
  WORKOUT_SESSION: DurableObjectNamespace<import('@bene/workout-session').WorkoutSession>;
};

const app = new Hono<{ Bindings: Bindings }>();

// Mount routes
app.route('/api', userRoutes); // mounts at /api -> /users/...
app.route('/api/workouts', workoutRoutes);
app.route('/api/coach', coachRoutes);
app.route('/api/integrations', integrationRoutes);

// Health check
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
