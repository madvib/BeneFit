import { http, delay } from 'msw';
import { createExploreEventFixture, createExploreTeamFixture } from '../../fixtures/explore.js';
import { toHttpResponse } from './utils.js';

export const buildGetExploreDataResponse = () => ({
  events: Array.from({ length: 4 }).map(() => createExploreEventFixture()),
  featuredTeams: Array.from({ length: 4 }).map(() => createExploreTeamFixture()),
});

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
      return toHttpResponse({ events: [], featuredTeams: [] });
    }),
  ],
};
