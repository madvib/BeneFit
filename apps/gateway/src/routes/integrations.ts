import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import {
  ConnectServiceRequestClientSchema,
  ConnectServiceRequestSchema,
  DisconnectServiceRequestClientSchema,
  DisconnectServiceRequestSchema,
  GetConnectedServicesRequestSchema,
  SyncServiceDataRequestSchema,
} from '@bene/integrations-domain';

export const integrationRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>()
  .post(
    '/connect',
    zValidator('json', ConnectServiceRequestClientSchema),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      // Merge server context with client input
      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      // Validate the complete input (optional but catches bugs)
      const validated = ConnectServiceRequestSchema.parse(useCaseInput);

      const id = c.env.USER_HUB.idFromName(user.id);
      const stub = c.env.USER_HUB.get(id);

      const result = await stub.integrations.connect(validated);
      return c.json(result);
    },
  )
  .post(
    '/disconnect',
    zValidator('json', DisconnectServiceRequestClientSchema),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = DisconnectServiceRequestSchema.parse(useCaseInput);

      const id = c.env.USER_HUB.idFromName(user.id);
      const stub = c.env.USER_HUB.get(id);

      const result = await stub.integrations.disconnect(validated);
      return c.json(result);
    },
  )
  .get('/connected', async (c) => {
    const user = c.get('user');

    const useCaseInput = {
      userId: user.id,
    };

    const validated = GetConnectedServicesRequestSchema.parse(useCaseInput);

    const id = c.env.USER_HUB.idFromName(user.id);
    const stub = c.env.USER_HUB.get(id);

    const result = await stub.integrations.getConnectedServices(validated);
    return c.json(result);
  })
  .post('/sync', async (c) => {
    const user = c.get('user');

    const useCaseInput = {
      userId: user.id,
    };

    const validated = SyncServiceDataRequestSchema.parse(useCaseInput);

    const id = c.env.USER_HUB.idFromName(user.id);
    const stub = c.env.USER_HUB.get(id);

    const result = await stub.integrations.sync(validated);
    return c.json(result);
  });

export type IntegrationsRoute = typeof integrationRoutes;
