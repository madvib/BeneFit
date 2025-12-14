import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { UserHub } from '@bene/user-hub';

type Bindings = {
  USER_HUB: DurableObjectNamespace<UserHub>;
};

const integrationRoutes = new Hono<{ Bindings: Bindings }>();

// POST /api/integrations/connect
integrationRoutes.post('/connect', async (c) => {
  const body = await c.req.json();
  const { userId, serviceType, authorizationCode, redirectUri } = body;

  if (!userId || !serviceType || !authorizationCode || !redirectUri) {
    throw new HTTPException(400, { message: 'Missing required parameters' });
  }

  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);

  try {
    const result = await stub.integrations.connect({
      userId,
      serviceType,
      authorizationCode,
      redirectUri
    });
    return c.json(result);
  } catch (error) {
    console.error('Error connecting integration:', error);
    throw new HTTPException(500, { message: 'Failed to connect integration' });
  }
});

// POST /api/integrations/disconnect
integrationRoutes.post('/disconnect', async (c) => {
  const body = await c.req.json();
  const { userId, serviceId } = body;

  if (!userId || !serviceId) {
    throw new HTTPException(400, { message: 'UserId and ServiceId are required' });
  }

  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);

  try {
    const result = await stub.integrations.disconnect({ userId, serviceId });
    return c.json(result);
  } catch (error) {
    console.error('Error disconnecting integration:', error);
    throw new HTTPException(500, { message: 'Failed to disconnect integration' });
  }
});

// GET /api/integrations/connected
integrationRoutes.get('/connected', async (c) => {
  const userId = c.req.query('userId');

  if (!userId) {
    throw new HTTPException(400, { message: 'UserId is required' });
  }

  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);

  try {
    const result = await stub.integrations.getConnectedServices({ userId });
    return c.json(result);
  } catch (error) {
    console.error('Error getting connected integrations:', error);
    throw new HTTPException(500, { message: 'Failed to get connected integrations' });
  }
});

// POST /api/integrations/sync
integrationRoutes.post('/sync', async (c) => {
  const body = await c.req.json();
  const { userId, serviceId } = body;

  if (!userId || !serviceId) {
    throw new HTTPException(400, { message: 'UserId and ServiceId are required' });
  }

  const id = c.env.USER_HUB.idFromName(userId);
  const stub = c.env.USER_HUB.get(id);

  try {
    const result = await stub.integrations.sync({ userId, serviceId });
    return c.json(result);
  } catch (error) {
    console.error('Error syncing integration:', error);
    throw new HTTPException(500, { message: 'Failed to sync integration' });
  }
});

export default integrationRoutes;
