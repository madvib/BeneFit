import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import {
  GetUpcomingWorkoutsRequestSchema,
  GetUpcomingWorkoutsResponse,
  GetWorkoutHistoryRequestSchema,
  GetWorkoutHistoryResponse,
  SkipWorkoutRequestSchema,
  SkipWorkoutResponse,
  StartWorkoutRequestSchema,
  StartWorkoutResponse,
  CompleteWorkoutRequestSchema,
  CompleteWorkoutResponse,
  JoinMultiplayerWorkoutRequestSchema,
  JoinMultiplayerWorkoutResponse,
  AddWorkoutReactionRequestSchema,
  AddWorkoutReactionResponse,
  GetTodaysWorkoutResponse,
} from '@bene/training-application';
import { handleResult } from '../lib/handle-result';

export const workoutRoutes = new Hono<{
  Bindings: Env;
  Variables: { user: any };
}>()
  .get('/today', async (c) => {
    const user = c.get('user');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Recursion limit only in client build (tsconfig.lib.json)    
    const stub = c.env.USER_HUB.getByName(user.id).workouts();

    const result = await stub.getTodaysWorkout({ userId: user.id });

    return handleResult<GetTodaysWorkoutResponse>(result, c);
  })
  .get(
    '/upcoming',
    zValidator('query', GetUpcomingWorkoutsRequestSchema.omit({ userId: true })),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('query');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = GetUpcomingWorkoutsRequestSchema.parse(useCaseInput);

      const stub = c.env.USER_HUB.getByName(user.id).workouts();

      const result = await stub.getUpcoming(validated);

      return handleResult<GetUpcomingWorkoutsResponse>(result, c);
    },
  )
  .get(
    '/history',
    zValidator('query', GetWorkoutHistoryRequestSchema.omit({ userId: true })),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('query');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = GetWorkoutHistoryRequestSchema.parse(useCaseInput);

      const stub = c.env.USER_HUB.getByName(user.id).workouts();

      const result = await stub.getHistory(validated);
      return handleResult<GetWorkoutHistoryResponse>(result, c);
    },
  )
  .post('/skip', zValidator('json', SkipWorkoutRequestSchema.omit({ userId: true })), async (c) => {
    const user = c.get('user');
    const clientInput = c.req.valid('json');

    const useCaseInput = {
      ...clientInput,
      userId: user.id,
    };

    const validated = SkipWorkoutRequestSchema.parse(useCaseInput);

    const stub = c.env.USER_HUB.getByName(user.id).workouts();

    const result = await stub.skip(validated);
    return handleResult<SkipWorkoutResponse>(result, c);
  })
  .post(
    '/:sessionId/start',
    zValidator('json', StartWorkoutRequestSchema.omit({ userId: true, userName: true })),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');
      const sessionId = c.req.param('sessionId');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
        userName: user.name || 'Unknown',
      };

      const validated = StartWorkoutRequestSchema.parse(useCaseInput);

      const stub = c.env.WORKOUT_SESSION.getByName(sessionId).workouts();

      const result = await stub.start(validated);

      return handleResult<StartWorkoutResponse>(result, c);
    },
  )
  .post(
    '/:sessionId/complete',
    zValidator('json', CompleteWorkoutRequestSchema.omit({ userId: true })),
    async (c) => {
      const sessionId = c.req.param('sessionId');
      const clientInput = c.req.valid('json');
      const user = c.get('user');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      const validated = CompleteWorkoutRequestSchema.parse(useCaseInput);

      const stub = c.env.WORKOUT_SESSION.getByName(sessionId).workouts();

      const result = await stub.complete(validated);

      return handleResult<CompleteWorkoutResponse>(result, c);
    },
  )
  .post(
    '/:sessionId/join',
    zValidator('json', JoinMultiplayerWorkoutRequestSchema.omit({ userId: true, userName: true })),
    async (c) => {
      const user = c.get('user');
      const sessionId = c.req.param('sessionId');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
        userName: user.name || 'Anonymous',
      };

      const validated = JoinMultiplayerWorkoutRequestSchema.parse(useCaseInput);

      const stub = c.env.WORKOUT_SESSION.getByName(sessionId).workouts();

      const result = await stub.joinMultiplayer(validated);
      return handleResult<JoinMultiplayerWorkoutResponse>(result, c);
    },
  )
  .post(
    '/:sessionId/reaction',
    zValidator('json', AddWorkoutReactionRequestSchema.omit({ userId: true, userName: true })),
    async (c) => {
      const user = c.get('user');
      const sessionId = c.req.param('sessionId');
      const clientInput = c.req.valid('json');

      const useCaseInput = {
        ...clientInput,
        userId: user.id,
        userName: user.name || 'Anonymous',
      };

      const validated = AddWorkoutReactionRequestSchema.parse(useCaseInput);

      const stub = c.env.WORKOUT_SESSION.getByName(sessionId).workouts();

      const result = await stub.addReaction(validated);
      return handleResult<AddWorkoutReactionResponse>(result, c);
    },
  );

export type WorkoutRoute = typeof workoutRoutes;
