import { Hono, HTTPException } from 'hono';

import { UserHub } from '@bene/user-hub';

type Bindings = {
  USER_HUB: DurableObjectNamespace<UserHub>;
};

const userRoutes = new Hono<{ Bindings: Bindings }>();

// Get user profile
userRoutes.get('/users/:userId/profile', async (c) => {
  const userId = c.req.param('userId');
  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);

  try {
    const result = await stub.profile.get({ userId });
    return c.json(result);
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw new HTTPException(500, { message: 'Failed to get user profile' });
  }
});

// Get user's active plan
userRoutes.get('/users/:userId/plan', async (c) => {
  const userId = c.req.param('userId');
  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);

  try {
    const result = await stub.queries.getActivePlan({ userId });
    return c.json(result);
  } catch (error) {
    console.error('Error getting active plan:', error);
    throw new HTTPException(500, { message: 'Failed to get active plan' });
  }
});

// Get today's workout
userRoutes.get('/users/:userId/workout/today', async (c) => {
  const userId = c.req.param('userId');
  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);

  try {
    const result = await stub.queries.getTodaysWorkout({ userId });
    return c.json(result);
  } catch (error) {
    console.error('Error getting today\'s workout:', error);
    throw new HTTPException(500, { message: 'Failed to get today\'s workout' });
  }
});

// Start a workout
userRoutes.post('/users/:userId/workout/start', async (c) => {
  const userId = c.req.param('userId');
  const body = await c.req.json();
  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);

  try {
    const result = await stub.workouts.start({ userId, workoutId: body.workoutId });
    return c.json(result);
  } catch (error) {
    console.error('Error starting workout:', error);
    throw new HTTPException(500, { message: 'Failed to start workout' });
  }
});

// Complete a workout
userRoutes.post('/users/:userId/workout/complete', async (c) => {
  const userId = c.req.param('userId');
  const body = await c.req.json();
  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);

  try {
    const result = await stub.workouts.complete({
      sessionId: body.sessionId,
      performanceData: body.performanceData
    });
    return c.json(result);
  } catch (error) {
    console.error('Error completing workout:', error);
    throw new HTTPException(500, { message: 'Failed to complete workout' });
  }
});

// Generate a plan from goals
userRoutes.post('/users/:userId/plan/generate', async (c) => {
  const userId = c.req.param('userId');
  const body = await c.req.json();
  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);

  try {
    const result = await stub.planning.generateFromGoals({
      userId,
      goals: body.goals,
      constraints: body.constraints
    });
    return c.json(result);
  } catch (error) {
    console.error('Error generating plan:', error);
    throw new HTTPException(500, { message: 'Failed to generate plan' });
  }
});

// Send message to coach
userRoutes.post('/users/:userId/coaching/message', async (c) => {
  const userId = c.req.param('userId');
  const body = await c.req.json();
  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);

  try {
    const result = await stub.coach.sendMessage({ userId, message: body.message });
    return c.json(result);
  } catch (error) {
    console.error('Error sending coaching message:', error);
    throw new HTTPException(500, { message: 'Failed to send coaching message' });
  }
});

// Get coaching history
userRoutes.get('/users/:userId/coaching/history', async (c) => {
  const userId = c.req.param('userId');
  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);

  try {
    const result = await stub.coach.getHistory();
    return c.json(result);
  } catch (error) {
    console.error('Error getting coaching history:', error);
    throw new HTTPException(500, { message: 'Failed to get coaching history' });
  }
});

// WebSocket upgrade for real-time features
userRoutes.get('/users/:userId/ws', async (c) => {
  const userId = c.req.param('userId');
  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);

  // Forward WebSocket upgrade request to the UserHub DO
  return await stub.fetch(c.req.raw);
});

export default userRoutes;

// Export the client types for frontend use
export type UserHubClient = typeof userRoutes;