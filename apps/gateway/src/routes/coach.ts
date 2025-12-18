import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import {
  SendMessageToCoachRequestClientSchema,
  SendMessageToCoachRequestSchema,
  GenerateWeeklySummaryRequestSchema,
  DismissCheckInRequestClientSchema,
  DismissCheckInRequestSchema,
  RespondToCheckInRequestClientSchema,
  RespondToCheckInRequestSchema,
  TriggerProactiveCheckInRequestSchema,
} from '@bene/coach-domain';

export const coachRoutes = new Hono<{ Bindings: Env; Variables: { user: any } }>()
  .post(
    '/message',
    zValidator('json', SendMessageToCoachRequestClientSchema),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = SendMessageToCoachRequestSchema.parse(useCaseInput);

      const id = c.env.USER_HUB.idFromName(user.id);
      const stub = c.env.USER_HUB.get(id);

      const result = await stub.coach.sendMessage(validated);
      return c.json(result);
    },
  )
  .post('/summary', async (c) => {
    const user = c.get('user');

    const useCaseInput = {
      userId: user.id,
    };

    const validated = GenerateWeeklySummaryRequestSchema.parse(useCaseInput);

    const id = c.env.USER_HUB.idFromName(user.id);
    const stub = c.env.USER_HUB.get(id);

    const result = await stub.coach.generateWeeklySummary(validated);
    return c.json(result);
  })
  // .get('/history', async (c) => {
  //   const userId = c.req.query('userId');

  //   if (!userId) {
  //     throw new HTTPException(400, { message: 'UserId is required' });
  //   }

  //   const id = c.env.USER_HUB.idFromName(userId);
  //   const stub = c.env.USER_HUB.get(id);

  //   try {
  //     const result = await stub.coach.getHistory();
  //     return c.json(result);
  //   } catch (error) {
  //     console.error('Error getting coaching history:', error);
  //     throw new HTTPException(500, { message: 'Failed to get coaching history' });
  //   }
  // })
  .post(
    '/check-in/dismiss',
    zValidator('json', DismissCheckInRequestClientSchema),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = DismissCheckInRequestSchema.parse(useCaseInput);

      const id = c.env.USER_HUB.idFromName(user.id);
      const stub = c.env.USER_HUB.get(id);

      const result = await stub.coach.dismissCheckIn(validated);
      return c.json(result);
    },
  )

  .post(
    '/check-in/respond',
    zValidator('json', RespondToCheckInRequestClientSchema),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = RespondToCheckInRequestSchema.parse(useCaseInput);

      const id = c.env.USER_HUB.idFromName(user.id);
      const stub = c.env.USER_HUB.get(id);
      const result = await stub.coach.respondToCheckIn(validated);
      return c.json(result);
    },
  )
  .post('/check-in/trigger', async (c) => {
    const user = c.get('user');

    const useCaseInput = {
      userId: user.id,
    };

    const validated = TriggerProactiveCheckInRequestSchema.parse(useCaseInput);

    const id = c.env.USER_HUB.idFromName(user.id);
    const stub = c.env.USER_HUB.get(id);

    const result = await stub.coach.triggerProactiveCheckIn(validated);
    return c.json(result);
  });

export type CoachRoute = typeof coachRoutes;
