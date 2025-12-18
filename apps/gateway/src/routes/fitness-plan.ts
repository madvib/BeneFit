import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import {
  // GetTodaysWorkoutRequestClientSchema,
  // GetTodaysWorkoutRequestSchema,
  GeneratePlanFromGoalsRequestClientSchema,
  GeneratePlanFromGoalsRequestSchema,
  ActivatePlanRequestClientSchema,
  ActivatePlanRequestSchema,
  AdjustPlanBasedOnFeedbackRequestClientSchema,
  AdjustPlanBasedOnFeedbackRequestSchema,
  PausePlanRequestClientSchema,
  PausePlanRequestSchema,
} from '@bene/training-application';

export const fitnessPlanRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>()
  // .get('/', zValidator('json', GetTodaysWorkoutRequestClientSchema), async (c) => {
  //   const user = c.get('user');
  //   const clientInput = c.req.valid('json');

  //   // Merge server context with client input
  //   const useCaseInput = {
  //     ...clientInput,
  //     userId: user.id,
  //   };

  //   // Validate the complete input (optional but catches bugs)
  //   const validated = GetTodaysWorkoutRequestSchema.parse(useCaseInput);

  //   const id = c.env.USER_HUB.idFromName(user.id);
  //   const stub = c.env.USER_HUB.get(id);

  //   const result = await stub.planning.getActivePlan(validated);
  //   return c.json(result);
  // })
  .post(
    '/generate',
    zValidator('json', GeneratePlanFromGoalsRequestClientSchema),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = GeneratePlanFromGoalsRequestSchema.parse(useCaseInput);

      const id = c.env.USER_HUB.idFromName(user.id);
      const stub = c.env.USER_HUB.get(id);

      const result = await stub.planning.generateFromGoals(validated);
      return c.json(result);
    },
  )
  .post('/activate', zValidator('json', ActivatePlanRequestClientSchema), async (c) => {
    const user = c.get('user');
    const clientInput = c.req.valid('json');

    const useCaseInput = {
      ...clientInput,
      userId: user.id,
    };

    const validated = ActivatePlanRequestSchema.parse(useCaseInput);

    const id = c.env.USER_HUB.idFromName(user.id);
    const stub = c.env.USER_HUB.get(id);

    const result = await stub.planning.activate(validated);
    return c.json(result);
  })
  .post(
    '/adjust',
    zValidator('json', AdjustPlanBasedOnFeedbackRequestClientSchema),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = AdjustPlanBasedOnFeedbackRequestSchema.parse(useCaseInput);

      const id = c.env.USER_HUB.idFromName(user.id);
      const stub = c.env.USER_HUB.get(id);

      const result = await stub.planning.adjust(validated);
      return c.json(result);
    },
  )
  .post('/pause', zValidator('json', PausePlanRequestClientSchema), async (c) => {
    const user = c.get('user');
    const clientInput = c.req.valid('json');

    const useCaseInput = {
      ...clientInput,
      userId: user.id,
    };

    const validated = PausePlanRequestSchema.parse(useCaseInput);

    const id = c.env.USER_HUB.idFromName(user.id);
    const stub = c.env.USER_HUB.get(id);

    const result = await stub.planning.pause(validated);
    return c.json(result);
  });
