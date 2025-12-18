import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import {
  GetUpcomingWorkoutsRequestClientSchema,
  GetUpcomingWorkoutsRequestSchema,
  GetWorkoutHistoryRequestClientSchema,
  GetWorkoutHistoryRequestSchema,
  SkipWorkoutRequestClientSchema,
  SkipWorkoutRequestSchema,
  StartWorkoutRequestClientSchema,
  StartWorkoutRequestSchema,
  CompleteWorkoutRequestClientSchema,
  CompleteWorkoutRequestSchema,
  JoinMultiplayerWorkoutRequestClientSchema,
  JoinMultiplayerWorkoutRequestSchema,
  AddWorkoutReactionRequestClientSchema,
  AddWorkoutReactionRequestSchema,
} from '@bene/training-application';

export const workoutRoutes = new Hono<{
  Bindings: Env;
  Variables: { user: any };
}>()
  .get('/today', async (c) => {
    const user = c.get('user');

    const id = c.env.USER_HUB.idFromName(user.id);
    const stub = c.env.USER_HUB.get(id);

    const workout = await stub.workouts.getTodaysWorkout({ userId: user.id });

    return c.json(workout);
  })
  .get(
    '/upcoming',
    zValidator('json', GetUpcomingWorkoutsRequestClientSchema),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      // Merge server context with client input
      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      // Validate the complete input (optional but catches bugs)
      const validated = GetUpcomingWorkoutsRequestSchema.parse(useCaseInput);

      const id = c.env.USER_HUB.idFromName(user.id);
      const stub = c.env.USER_HUB.get(id);

      const result = await stub.workouts.getTodaysWorkout(validated);

      return c.json(result);
    },
  )
  .get(
    '/history',
    zValidator('json', GetWorkoutHistoryRequestClientSchema),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');

      // Merge server context with client input
      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      // Validate the complete input (optional but catches bugs)
      const validated = GetWorkoutHistoryRequestSchema.parse(useCaseInput);

      const id = c.env.USER_HUB.idFromName(user.id);
      const stub = c.env.USER_HUB.get(id);

      const result = await stub.workouts.getTodaysWorkout(validated);
      return c.json(result);
    },
  )
  .post('/skip', zValidator('json', SkipWorkoutRequestClientSchema), async (c) => {
    const user = c.get('user');
    const clientInput = c.req.valid('json');

    // Merge server context with client input
    const useCaseInput = {
      ...clientInput,
      userId: user.id,
    };

    // Validate the complete input (optional but catches bugs)
    const validated = SkipWorkoutRequestSchema.parse(useCaseInput);

    const id = c.env.USER_HUB.idFromName(user.id);
    const stub = c.env.USER_HUB.get(id);

    const result = await stub.workouts.skip(validated);
    return c.json(result);
  })
  .post(
    '/:sessionId/start',
    zValidator('json', StartWorkoutRequestClientSchema),
    async (c) => {
      const user = c.get('user');
      const clientInput = c.req.valid('json');
      const sessionId = c.req.param('sessionId');

      // Merge server context with client input
      const useCaseInput = {
        ...clientInput,
        userId: user.id,
        userName: user.name || 'Unknown',
      };

      // Validate the complete input (optional but catches bugs)
      const validated = StartWorkoutRequestSchema.parse(useCaseInput);

      const id = c.env.WORKOUT_SESSION.idFromName(sessionId);
      const stub = c.env.WORKOUT_SESSION.get(id);

      const response = await stub.workouts.start(validated);

      return c.json(response, 201);
    },
  )
  .post(
    '/:sessionId/complete',
    zValidator('json', CompleteWorkoutRequestClientSchema),
    async (c) => {
      const sessionId = c.req.param('sessionId');
      const clientInput = c.req.valid('json');
      const user = c.get('user');

      // Merge server context with client input
      const useCaseInput = {
        ...clientInput,
        userId: user.id,
      };

      // Validate the complete input (optional but catches bugs)
      const validated = CompleteWorkoutRequestSchema.parse(useCaseInput);

      const id = c.env.WORKOUT_SESSION.idFromName(sessionId);
      const stub = c.env.WORKOUT_SESSION.get(id);

      const response = await stub.workouts.complete(validated);

      return c.json(response);
    },
  )
  .post(
    '/:sessionId/join',
    zValidator('json', JoinMultiplayerWorkoutRequestClientSchema),
    async (c) => {
      const user = c.get('user');
      const sessionId = c.req.param('sessionId');
      const clientInput = c.req.valid('json');

      // Merge server context with client input
      const useCaseInput = {
        ...clientInput,
        userId: user.id,
        userName: user.name || 'Anonymous',
      };

      // Validate the complete input (optional but catches bugs)
      const validated = JoinMultiplayerWorkoutRequestSchema.parse(useCaseInput);

      const id = c.env.WORKOUT_SESSION.idFromName(sessionId);
      const stub = c.env.WORKOUT_SESSION.get(id);

      const result = await stub.workouts.joinMultiplayer(validated);
      return c.json(result);
    },
  )
  .post(
    '/:sessionId/reaction',
    zValidator('json', AddWorkoutReactionRequestClientSchema),
    async (c) => {
      const user = c.get('user');
      const sessionId = c.req.param('sessionId');
      const clientInput = c.req.valid('json');

      // Merge server context with client input
      const useCaseInput = {
        ...clientInput,
        userId: user.id,
        userName: user.name || 'Anonymous',
      };

      // Validate the complete input (optional but catches bugs)
      const validated = AddWorkoutReactionRequestSchema.parse(useCaseInput);

      const id = c.env.WORKOUT_SESSION.idFromName(sessionId);
      const stub = c.env.WORKOUT_SESSION.get(id);

      const result = await stub.workouts.addReaction(validated);
      return c.json(result);
    },
  );

export type WorkoutRoute = typeof workoutRoutes;
