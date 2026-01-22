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
  http.get('http://*/api/profile', async () => {
    await delay(100);
    return toHttpResponse(buildGetProfileResponse());
  }),

  // POST /api/profile
  http.post('http://*/api/profile', async () => {
    await delay(100);
    return toHttpResponse(buildCreateUserProfileResponse());
  }),

  // PATCH /api/profile/goals
  http.patch('http://*/api/profile/goals', async () => {
    await delay(100);
    return toHttpResponse(buildUpdateFitnessGoalsResponse());
  }),

  // PATCH /api/profile/preferences
  http.patch('http://*/api/profile/preferences', async () => {
    await delay(100);
    return toHttpResponse(buildUpdatePreferencesResponse());
  }),

  // GET /api/profile/stats
  http.get('http://*/api/profile/stats', async () => {
    await delay(100);
    return toHttpResponse(buildGetUserStatsResponse());
  }),

  // PATCH /api/profile/constraints
  http.patch('http://*/api/profile/constraints', async () => {
    await delay(100);
    return toHttpResponse(buildUpdateTrainingConstraintsResponse());
  }),
];
