import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import {
  SendMessageToCoachRequestClientSchema,
  SendMessageToCoachRequestSchema,
  SendMessageToCoachResponse,
  GenerateWeeklySummaryRequestSchema,
  GenerateWeeklySummaryResponse,
  DismissCheckInRequestClientSchema,
  DismissCheckInRequestSchema,
  DismissCheckInResponse,
  RespondToCheckInRequestClientSchema,
  RespondToCheckInRequestSchema,
  RespondToCheckInResponse,
  TriggerProactiveCheckInRequestSchema,
  TriggerProactiveCheckInResponse,
} from '@bene/coach-domain';
import { handleResult } from '../lib/handle-result';

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

      const stub = c.env.USER_HUB.getByName(user.id).coach();


      const result = await stub.sendMessage(validated);
      return handleResult<SendMessageToCoachResponse>(result, c);
    },
  )
  .post('/summary', async (c) => {
    const user = c.get('user');

    const useCaseInput = {
      userId: user.id,
    };

    const validated = GenerateWeeklySummaryRequestSchema.parse(useCaseInput);

    const stub = c.env.USER_HUB.getByName(user.id).coach();


    const result = await stub.generateWeeklySummary(validated);
    return handleResult<GenerateWeeklySummaryResponse>(result, c);
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

      const stub = c.env.USER_HUB.getByName(user.id).coach();


      const result = await stub.dismissCheckIn(validated);
      return handleResult<DismissCheckInResponse>(result, c);
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

      const stub = c.env.USER_HUB.getByName(user.id).coach();

      const result = await stub.respondToCheckIn(validated);
      return handleResult<RespondToCheckInResponse>(result, c);
    },
  )
  .post('/check-in/trigger', async (c) => {
    const user = c.get('user');

    const useCaseInput = {
      userId: user.id,
    };

    const validated = TriggerProactiveCheckInRequestSchema.parse(useCaseInput);

    const stub = c.env.USER_HUB.getByName(user.id).coach();


    const result = await stub.triggerProactiveCheckIn(validated);
    return handleResult<TriggerProactiveCheckInResponse>(result, c);
  });

export type CoachRoute = typeof coachRoutes;
