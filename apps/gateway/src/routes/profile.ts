import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import {
  GetProfileRequestSchema,
  GetProfileResponse,
  CreateUserProfileResponse,
  UpdateFitnessGoalsResponse,
  UpdatePreferencesResponse,
  GetUserStatsResponse,
  UpdateTrainingConstraintsResponse,
  CreateUserProfileRequestSchema,
  UpdateFitnessGoalsRequestSchema,
  UpdatePreferencesRequestSchema,
  GetUserStatsRequestSchema,
  UpdateTrainingConstraintsRequestSchema,
} from '@bene/training-application';
import { handleResult } from '../lib/handle-result';

export const profileRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>()
  .get('/', async (c) => {
    const user = c.get('user');

    const useCaseInput = {
      userId: user.id,
    };

    const validated = GetProfileRequestSchema.parse(useCaseInput);

    const stub = c.env.USER_HUB.getByName(user.id).profile();

    const result = await stub.get(validated);

    return handleResult<GetProfileResponse>(result, c);
  })
  .post('/', zValidator('json', CreateUserProfileRequestSchema.omit({ userId: true })), async (c) => {
    const user = c.get('user');
    const clientInput = c.req.valid('json');

    const useCaseInput = {
      ...clientInput,
      userId: user.id,
    };

    const validated = CreateUserProfileRequestSchema.parse(useCaseInput);

    const stub = c.env.USER_HUB.getByName(user.id).profile();

    const result = await stub.create(validated);
    return handleResult<CreateUserProfileResponse>(result, c);
  })
  .patch(
    '/goals',
    zValidator('json', UpdateFitnessGoalsRequestSchema.omit({ userId: true })),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = UpdateFitnessGoalsRequestSchema.parse(useCaseInput);

      const stub = c.env.USER_HUB.getByName(user.id).profile();


      const result = await stub.updateGoals(validated);
      return handleResult<UpdateFitnessGoalsResponse>(result, c);
    },
  )
  .patch(
    '/preferences',
    zValidator('json', UpdatePreferencesRequestSchema.omit({ userId: true })),

    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = UpdatePreferencesRequestSchema.parse(useCaseInput);

      const stub = c.env.USER_HUB.getByName(user.id).profile();


      const result = await stub.updatePreferences(validated);
      return handleResult<UpdatePreferencesResponse>(result, c);
    },
  )
  .get('/stats', async (c) => {
    const user = c.get('user');

    const useCaseInput = {
      userId: user.id,
    };

    const validated = GetUserStatsRequestSchema.parse(useCaseInput);

    const stub = c.env.USER_HUB.getByName(user.id).profile();

    const result = await stub.getStats(validated);

    return handleResult<GetUserStatsResponse>(result, c);
  })
  .patch(
    '/constraints',
    zValidator('json', UpdateTrainingConstraintsRequestSchema.omit({ userId: true })),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = UpdateTrainingConstraintsRequestSchema.parse(useCaseInput);

      const stub = c.env.USER_HUB.getByName(user.id).profile();


      const result = await stub.updateConstraints(validated);
      return handleResult<UpdateTrainingConstraintsResponse>(result, c);
    },
  );
