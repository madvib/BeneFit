import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { UserHub } from '@bene/user-hub';

type Bindings = {
  USER_HUB: DurableObjectNamespace<UserHub>;
};

const coachRoutes = new Hono<{ Bindings: Bindings }>();

// POST /api/coach/message
coachRoutes.post('/message', async (c) => {
  const body = await c.req.json();
  const { userId, message } = body;

  if (!userId || !message) {
    throw new HTTPException(400, { message: 'UserId and Message are required' });
  }

  const id = c.env.USER_HUB.idFromName(userId);
  // @ts-ignore - access helper
  const stub = c.env.USER_HUB.get(id);

  try {
    const result = await stub.coach.sendMessage({ userId, message });
    return c.json(result);
  } catch (error) {
    console.error('Error sending coaching message:', error);
    throw new HTTPException(500, { message: 'Failed to send coaching message' });
  }
});

// GET /api/coach/history
coachRoutes.get('/history', async (c) => {
  const userId = c.req.query('userId');

  if (!userId) {
    throw new HTTPException(400, { message: 'UserId is required' });
  }

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

// POST /api/coach/check-in/dismiss
coachRoutes.post('/check-in/dismiss', async (c) => {
  const body = await c.req.json();
  const { userId, checkInId } = body;
  if (!userId || !checkInId) {
    throw new HTTPException(400, { message: 'UserId and CheckInId are required' });
  }
  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);
  try {
    const result = await stub.coach.dismissCheckIn({ userId, checkInId });
    return c.json(result);
  } catch (error) {
    console.error('Error dismissing check-in:', error);
    throw new HTTPException(500, { message: 'Failed to dismiss check-in' });
  }
});

// POST /api/coach/summary
coachRoutes.post('/summary', async (c) => {
  const body = await c.req.json();
  const { userId } = body;
  if (!userId) {
    throw new HTTPException(400, { message: 'UserId is required' });
  }
  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);
  try {
    const result = await stub.coach.generateWeeklySummary({ userId });
    return c.json(result);
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new HTTPException(500, { message: 'Failed to generate summary' });
  }
});

// POST /api/coach/check-in/respond
coachRoutes.post('/check-in/respond', async (c) => {
  const body = await c.req.json();
  const { userId, checkInId, response } = body;
  if (!userId || !checkInId || !response) {
    throw new HTTPException(400, { message: 'UserId, CheckInId and Response are required' });
  }
  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);
  try {
    const result = await stub.coach.respondToCheckIn({ userId, checkInId, response });
    return c.json(result);
  } catch (error) {
    console.error('Error responding to check-in:', error);
    throw new HTTPException(500, { message: 'Failed to respond to check-in' });
  }
});

// POST /api/coach/check-in/trigger
coachRoutes.post('/check-in/trigger', async (c) => {
  const body = await c.req.json();
  const { userId } = body;
  if (!userId) {
    throw new HTTPException(400, { message: 'UserId is required' });
  }
  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);
  try {
    const result = await stub.coach.triggerProactiveCheckIn({ userId });
    return c.json(result);
  } catch (error) {
    console.error('Error triggering check-in:', error);
    throw new HTTPException(500, { message: 'Failed to trigger check-in' });
  }
});

export default coachRoutes;
