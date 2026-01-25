import { http, delay } from 'msw';
import {
  buildGetTodaysWorkoutResponse,
  buildGetUpcomingWorkoutsResponse,
  buildGetWorkoutHistoryResponse,
  buildSkipWorkoutResponse,
  buildStartWorkoutResponse,
  buildCompleteWorkoutResponse,
  buildJoinMultiplayerWorkoutResponse,
  buildAddWorkoutReactionResponse,
} from '../../fixtures/training.js';
import { toHttpResponse } from './utils.js';

// Update handlers to be resilient to base URL variations
export const workoutHandlers = [
  http.get('*/api/workouts/today', async () => {
    await delay(100);
    return toHttpResponse(buildGetTodaysWorkoutResponse());
  }),

  http.get('*/api/workouts/upcoming', async () => {
    await delay(100);
    return toHttpResponse(buildGetUpcomingWorkoutsResponse());
  }),

  http.get('*/api/workouts/history', async () => {
    await delay(100);
    return toHttpResponse(buildGetWorkoutHistoryResponse());
  }),

  http.post('*/api/workouts/skip', async () => {
    await delay(200);
    return toHttpResponse(buildSkipWorkoutResponse());
  }),

  http.post('*/api/workouts/:sessionId/start', async () => {
    await delay(200);
    return toHttpResponse(buildStartWorkoutResponse());
  }),

  http.post('*/api/workouts/:sessionId/complete', async () => {
    await delay(400);
    return toHttpResponse(buildCompleteWorkoutResponse());
  }),

  http.post('*/api/workouts/:sessionId/join', async () => {
    await delay(300);
    return toHttpResponse(buildJoinMultiplayerWorkoutResponse());
  }),

  http.post('*/api/workouts/:sessionId/reaction', async () => {
    await delay(100);
    return toHttpResponse(buildAddWorkoutReactionResponse());
  }),
];

export const workoutScenarios = {
  default: workoutHandlers,

  loading: [
    http.get('*/api/workouts/today', async () => {
      await delay('infinite');
      return toHttpResponse(buildGetTodaysWorkoutResponse());
    }),
    http.get('*/api/workouts/upcoming', async () => {
      await delay('infinite');
      return toHttpResponse(buildGetUpcomingWorkoutsResponse());
    }),
  ],

  error: [
    http.get('*/api/workouts/today', async () => {
      await delay(100);
      return toHttpResponse(buildGetTodaysWorkoutResponse({ success: false }));
    }),
  ],

  emptyHistory: [
    http.get('*/api/workouts/history', async () => {
      await delay(100);
      return toHttpResponse(buildGetWorkoutHistoryResponse({ success: true, overrides: { workouts: [], total: 0 } }));
    }),
  ],
};
