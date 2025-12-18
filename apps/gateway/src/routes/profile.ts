import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import {
  GetProfileRequestSchema,
  CreateUserProfileRequestClientSchema,
  CreateUserProfileRequestSchema,
  UpdateFitnessGoalsRequestClientSchema,
  UpdateFitnessGoalsRequestSchema,
  UpdatePreferencesRequestSchema,
  GetUserStatsRequestSchema,
  UpdateTrainingConstraintsRequestSchema,
  UpdatePreferencesRequestClientSchema,
  UpdateTrainingConstraintsRequestClientSchema,
} from '@bene/training-application';

export const profileRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>()
  .get('/', async (c) => {
    const user = c.get('user');

    const useCaseInput = {
      userId: user.id,
    };

    const validated = GetProfileRequestSchema.parse(useCaseInput);

    const id = c.env.USER_HUB.idFromName(user.id);
    const stub = c.env.USER_HUB.get(id);

    const result = await stub.profile.get(validated);
    return c.json(result);
  })
  .post('/', zValidator('json', CreateUserProfileRequestClientSchema), async (c) => {
    const user = c.get('user');
    const clientInput = c.req.valid('json');

    const useCaseInput = {
      ...clientInput,
      userId: user.id,
    };

    const validated = CreateUserProfileRequestSchema.parse(useCaseInput);

    const id = c.env.USER_HUB.idFromName(user.id);
    const stub = c.env.USER_HUB.get(id);

    const result = await stub.profile.create(validated);
    return c.json(result);
  })
  .post(
    '/goals',
    zValidator('json', UpdateFitnessGoalsRequestClientSchema),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = UpdateFitnessGoalsRequestSchema.parse(useCaseInput);

      const id = c.env.USER_HUB.idFromName(user.id);
      const stub = c.env.USER_HUB.get(id);

      const result = await stub.profile.updateGoals(validated);
      return c.json(result);
    },
  )
  .post(
    '/preferences',
    zValidator('json', UpdatePreferencesRequestClientSchema),

    async (c) => {
      const user = c.get('user');

      const useCaseInput = {
        userId: user.id,
      };

      const validated = UpdatePreferencesRequestSchema.parse(useCaseInput);

      const id = c.env.USER_HUB.idFromName(user.id);
      const stub = c.env.USER_HUB.get(id);

      const result = await stub.profile.updatePreferences(validated);
      return c.json(result);
    },
  )
  .get('/stats', async (c) => {
    const user = c.get('user');

    const useCaseInput = {
      userId: user.id,
    };

    const validated = GetUserStatsRequestSchema.parse(useCaseInput);

    const id = c.env.USER_HUB.idFromName(user.id);
    const stub = c.env.USER_HUB.get(id);

    const result = await stub.profile.getStats(validated);
    return c.json(result);
  })
  .post(
    '/contraints',
    zValidator('json', UpdateTrainingConstraintsRequestClientSchema),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = UpdateTrainingConstraintsRequestSchema.parse(useCaseInput);

      const id = c.env.USER_HUB.idFromName(user.id);
      const stub = c.env.USER_HUB.get(id);

      const result = await stub.profile.updateConstraints(validated);
      return c.json(result);
    },
  );
