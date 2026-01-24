import { createExploreEventFixture, createExploreTeamFixture } from '../../fixtures/explore.js';

export function useExplore() {
  // Dummy data hook as requested - returns dynamic data
  const events = Array.from({ length: 4 }).map(() => createExploreEventFixture());
  const featuredTeams = Array.from({ length: 4 }).map(() => createExploreTeamFixture());

  return {
    data: {
      events,
      featuredTeams,
    },
    isLoading: false,
    isError: false,
  };
}

// Server-side friendly fetcher simulation
export async function fetchExploreData() {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 100));

  return {
    events: Array.from({ length: 4 }).map(() => createExploreEventFixture()),
    featuredTeams: Array.from({ length: 4 }).map(() => createExploreTeamFixture()),
  };
}
