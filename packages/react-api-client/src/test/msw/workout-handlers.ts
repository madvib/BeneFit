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

export const workoutHandlers = [
  http.get('http://*/api/workouts/today', async () => {
    await delay(100);
    return toHttpResponse(buildGetTodaysWorkoutResponse());
  }),

  http.get('http://*/api/workouts/upcoming', async () => {
    await delay(150);
    return toHttpResponse(buildGetUpcomingWorkoutsResponse());
  }),

  http.get('http://*/api/workouts/history', async () => {
    await delay(200);
    return toHttpResponse(buildGetWorkoutHistoryResponse());
  }),

  http.post('http://*/api/workouts/skip', async () => {
    await delay(100);
    return toHttpResponse(buildSkipWorkoutResponse());
  }),

  http.post('http://*/api/workouts/:sessionId/start', async () => {
    await delay(200);
    return toHttpResponse(buildStartWorkoutResponse());
  }),

  http.post('http://*/api/workouts/:sessionId/complete', async () => {
    await delay(300);
    return toHttpResponse(buildCompleteWorkoutResponse());
  }),

  http.post('http://*/api/workouts/:sessionId/join', async () => {
    await delay(250);
    return toHttpResponse(buildJoinMultiplayerWorkoutResponse());
  }),

  http.post('http://*/api/workouts/:sessionId/reaction', async () => {
    await delay(50);
    return toHttpResponse(buildAddWorkoutReactionResponse());
  }),
];
