import { http, delay } from 'msw';
import {
  buildGetCurrentPlanResponse,
  buildGeneratePlanFromGoalsResponse,
  buildActivatePlanResponse,
  buildPausePlanResponse,
  buildAdjustPlanBasedOnFeedbackResponse,
} from '../../fixtures/training.js';
import { toHttpResponse } from './utils.js';

// Update handlers to be resilient to base URL variations
export const fitnessPlanHandlers = [
  http.get('*/api/fitness-plan/active', async () => {
    await delay(100);
    return toHttpResponse(buildGetCurrentPlanResponse());
  }),

  http.post('*/api/fitness-plan/generate', async () => {
    await delay(500);
    return toHttpResponse(buildGeneratePlanFromGoalsResponse());
  }),

  http.post('*/api/fitness-plan/activate', async () => {
    await delay(300);
    return toHttpResponse(buildActivatePlanResponse());
  }),

  http.post('*/api/fitness-plan/pause', async () => {
    await delay(200);
    return toHttpResponse(buildPausePlanResponse());
  }),

  http.post('*/api/fitness-plan/adjust', async () => {
    await delay(300);
    return toHttpResponse(buildAdjustPlanBasedOnFeedbackResponse());
  }),
];

export const fitnessPlanScenarios = {
  default: fitnessPlanHandlers,

  loading: [
    http.get('*/api/fitness-plan/active', async () => {
      await delay('infinite');
      return toHttpResponse(buildGetCurrentPlanResponse({ success: true }));
    }),
  ],

  error: [
    http.get('*/api/fitness-plan/active', async () => {
      await delay(100);
      return toHttpResponse(buildGetCurrentPlanResponse({ success: false }));
    }),
  ],

  noActivePlan: [
    http.get('*/api/fitness-plan/active', async () => {
      await delay(100);
      return toHttpResponse(buildGetCurrentPlanResponse({
        overrides: {
          plan: null,
          hasActivePlan: false
        }
      }));
    }),
  ],
};
