import { http, delay } from 'msw';
import {
  buildGetCurrentPlanResponse,
  buildGeneratePlanFromGoalsResponse,
  buildActivatePlanResponse,
  buildPausePlanResponse,
  buildAdjustPlanBasedOnFeedbackResponse,
} from '../../fixtures/training.js';
import { toHttpResponse } from './utils.js';

export const fitnessPlanHandlers = [
  http.get('http://*/api/fitness-plan/active', async () => {
    await delay(100);
    return toHttpResponse(buildGetCurrentPlanResponse());
  }),

  http.post('http://*/api/fitness-plan/generate', async () => {
    await delay(500);
    return toHttpResponse(buildGeneratePlanFromGoalsResponse());
  }),

  http.post('http://*/api/fitness-plan/activate', async () => {
    await delay(300);
    return toHttpResponse(buildActivatePlanResponse());
  }),

  http.post('http://*/api/fitness-plan/pause', async () => {
    await delay(200);
    return toHttpResponse(buildPausePlanResponse());
  }),

  http.post('http://*/api/fitness-plan/adjust', async () => {
    await delay(300);
    return toHttpResponse(buildAdjustPlanBasedOnFeedbackResponse());
  }),
];
