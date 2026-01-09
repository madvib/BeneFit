import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import {
  ConnectServiceRequestSchema,
  ConnectServiceResponse,
  DisconnectServiceRequestSchema,
  DisconnectServiceResponse,
  GetConnectedServicesRequestSchema,
  GetConnectedServicesResponse,
  SyncServiceDataRequestSchema,
  SyncServiceDataResponse,
} from '@bene/integrations-domain';
import { handleResult } from '../lib/handle-result';

export const integrationRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>()
  .post(
    '/connect',
    zValidator('json', ConnectServiceRequestSchema.omit({ userId: true })),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = ConnectServiceRequestSchema.parse(useCaseInput);

      const stub = c.env.USER_HUB.getByName(user.id).integrations();


      const result = await stub.connect(validated);
      return handleResult<ConnectServiceResponse>(result, c);
    },
  )
  .post(
    '/disconnect',
    zValidator('json', DisconnectServiceRequestSchema.omit({ userId: true })),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = DisconnectServiceRequestSchema.parse(useCaseInput);

      const stub = c.env.USER_HUB.getByName(user.id).integrations();


      const result = await stub.disconnect(validated);
      return handleResult<DisconnectServiceResponse>(result, c);
    },
  )
  .get('/connected', async (c) => {
    const user = c.get('user');

    const useCaseInput = {
      userId: user.id,
    };

    const validated = GetConnectedServicesRequestSchema.parse(useCaseInput);

    const stub = c.env.USER_HUB.getByName(user.id).integrations();


    const result = await stub.getConnectedServices(validated);
    return handleResult<GetConnectedServicesResponse>(result, c);
  })
  .post('/sync', async (c) => {
    const user = c.get('user');

    const useCaseInput = {
      userId: user.id,
    };

    const validated = SyncServiceDataRequestSchema.parse(useCaseInput);
    const stub = c.env.USER_HUB.getByName(user.id).integrations();


    const result = await stub.sync(validated);
    return handleResult<SyncServiceDataResponse>(result, c);
  });

export type IntegrationsRoute = typeof integrationRoutes;
