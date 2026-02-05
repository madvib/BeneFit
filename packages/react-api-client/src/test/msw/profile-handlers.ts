import { http, delay } from 'msw';
import {
  buildGetProfileResponse,
  buildGetUserStatsResponse,
  buildCreateUserProfileResponse,
  buildUpdateFitnessGoalsResponse,
  buildUpdatePreferencesResponse,
  buildUpdateTrainingConstraintsResponse,
} from '../../fixtures/training.js';
import { toHttpResponse } from './utils.js';

export const profileHandlers = [
  // GET /api/profile
  http.get('*/api/profile', async () => {
    await delay(100);
    return toHttpResponse(buildGetProfileResponse());
  }),

  // POST /api/profile
  http.post('*/api/profile', async () => {
    await delay(100);
    return toHttpResponse(buildCreateUserProfileResponse());
  }),

  // PATCH /api/profile/goals
  http.patch('*/api/profile/goals', async () => {
    await delay(100);
    return toHttpResponse(buildUpdateFitnessGoalsResponse());
  }),

  // PATCH /api/profile/preferences
  http.patch('*/api/profile/preferences', async () => {
    await delay(100);
    return toHttpResponse(buildUpdatePreferencesResponse());
  }),

  // GET /api/profile/stats
  http.get('*/api/profile/stats', async () => {
    await delay(100);
    return toHttpResponse(buildGetUserStatsResponse());
  }),

  // PATCH /api/profile/constraints
  http.patch('*/api/profile/constraints', async () => {
    await delay(100);
    return toHttpResponse(buildUpdateTrainingConstraintsResponse());
  }),
];

export const profileScenarios = {
  default: profileHandlers,

  loading: [
    http.get('*/api/profile', async () => {
      await delay('infinite');
      return toHttpResponse(buildGetProfileResponse());
    }),
  ],

  error: [
    http.get('*/api/profile', async () => {
      await delay(100);
      return toHttpResponse(buildGetProfileResponse({ success: false }));
    }),
  ],
};
