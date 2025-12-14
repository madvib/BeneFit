import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
// @ts-ignore - build time dependency
import { WorkoutSession } from '@bene/workout-session';

type Bindings = {
  WORKOUT_SESSION: DurableObjectNamespace<WorkoutSession>;
};

const workoutRoutes = new Hono<{ Bindings: Bindings }>();

// GET /api/workouts/today
workoutRoutes.get('/today', async (c) => {
  const userId = c.req.query('userId');
  if (!userId) {
    throw new HTTPException(400, { message: 'UserId is required' });
  }

  const id = c.env.WORKOUT_SESSION.idFromName(userId);
  const stub = c.env.WORKOUT_SESSION.get(id);

  try {
    const result = await stub.getTodaysWorkout(userId);
    return c.json(result);
  } catch (error) {
    console.error('Error getting today\'s workout:', error);
    throw new HTTPException(500, { message: 'Failed to get today\'s workout' });
  }
});

// POST /api/workouts/start
workoutRoutes.post('/start', async (c) => {
  const body = await c.req.json();
  const { userId, workoutId } = body;

  if (!userId || !workoutId) {
    throw new HTTPException(400, { message: 'UserId and WorkoutId are required' });
  }

  const id = c.env.WORKOUT_SESSION.idFromName(userId);
  const stub = c.env.WORKOUT_SESSION.get(id);

  try {
    const result = await stub.startWorkout({ userId, workoutId });
    return c.json(result);
  } catch (error) {
    console.error('Error starting workout:', error);
    throw new HTTPException(500, { message: 'Failed to start workout' });
  }
});

export default workoutRoutes;
