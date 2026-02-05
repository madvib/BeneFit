import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import {
  GeneratePlanFromGoalsRequestSchema,
  GeneratePlanFromGoalsResponse,
  ActivatePlanRequestSchema,
  ActivatePlanResponse,
  AdjustPlanBasedOnFeedbackRequestSchema,
  AdjustPlanBasedOnFeedbackResponse,
  PausePlanRequestSchema,
  PausePlanResponse,
  GetCurrentPlanRequestSchema,
  GetCurrentPlanResponse,
} from '@bene/training-application';
import { handleResult } from '../lib/handle-result';

// Export client schemas (userId omitted) for use in fixtures
export const GeneratePlanFromGoalsClientSchema = GeneratePlanFromGoalsRequestSchema.omit({ userId: true });
export const ActivatePlanClientSchema = ActivatePlanRequestSchema.omit({ userId: true });
export const AdjustPlanClientSchema = AdjustPlanBasedOnFeedbackRequestSchema.omit({ userId: true });
export const PausePlanClientSchema = PausePlanRequestSchema.omit({ userId: true });

export const fitnessPlanRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>()
  .get('/active', async (c) => {
    const user = c.get('user');

    const useCaseInput = {
      userId: user.id,
    };

    const validated = GetCurrentPlanRequestSchema.parse(useCaseInput);

    const stub = c.env.USER_HUB.getByName(user.id).planning();

    const result = await stub.getCurrentPlan(validated);

    return handleResult<GetCurrentPlanResponse>(result, c);
  })
  .post(
    '/generate',
    zValidator('json', GeneratePlanFromGoalsClientSchema),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = GeneratePlanFromGoalsRequestSchema.parse(useCaseInput);

      const stub = c.env.USER_HUB.getByName(user.id).planning();

      const result = await stub.generateFromGoals(validated);

      return handleResult<GeneratePlanFromGoalsResponse>(result, c);
    },
  )
  .post('/activate', zValidator('json', ActivatePlanClientSchema), async (c) => {
    const user = c.get('user');
    const clientInput = c.req.valid('json');

    const useCaseInput = {
      ...clientInput,
      userId: user.id,
    };

    const validated = ActivatePlanRequestSchema.parse(useCaseInput);

    const stub = c.env.USER_HUB.getByName(user.id).planning();

    const result = await stub.activate(validated);

    return handleResult<ActivatePlanResponse>(result, c);
  })
  .post(
    '/adjust',
    zValidator('json', AdjustPlanClientSchema),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = AdjustPlanBasedOnFeedbackRequestSchema.parse(useCaseInput);

      const stub = c.env.USER_HUB.getByName(user.id).planning();


      const result = await stub.adjust(validated);
      return handleResult<AdjustPlanBasedOnFeedbackResponse>(result, c);
    },
  )
  .post('/pause', zValidator('json', PausePlanClientSchema), async (c) => {
    const user = c.get('user');
    const clientInput = c.req.valid('json');

    const useCaseInput = {
      ...clientInput,
      userId: user.id,
    };

    const validated = PausePlanRequestSchema.parse(useCaseInput);

    const stub = c.env.USER_HUB.getByName(user.id).planning();

    const result = await stub.pause(validated);
    return handleResult<PausePlanResponse>(result, c);
  });
