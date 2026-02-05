import { http, delay } from 'msw';
import { Result } from '@bene/shared';
import { buildGetExploreDataResponse } from '../../fixtures/explore.js';
import { toHttpResponse } from './utils.js';

export const exploreHandlers = [
  http.get('*/api/explore', async () => {
    await delay(200);
    return toHttpResponse(buildGetExploreDataResponse());
  }),
];

export const exploreScenarios = {
  default: exploreHandlers,
  empty: [
    http.get('*/api/explore', async () => {
      await delay(200);
      return toHttpResponse(Result.ok({ events: [], featuredTeams: [] }));
    }),
  ],
};
