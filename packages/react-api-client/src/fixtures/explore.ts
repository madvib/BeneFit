import { faker } from '@faker-js/faker';
import { Result } from '@bene/shared';

export interface ExploreEvent {
  id: string;
  title: string;
  date: string;
  image: string;
  participants: number;
}

export interface ExploreTeam {
  id: string;
  name: string;
  members: number;
  activityType: string;
  image: string;
}

export function createExploreEventFixture(overrides?: Partial<ExploreEvent>): ExploreEvent {
  return {
    id: faker.string.uuid(),
    title: faker.company.catchPhrase(),
    date: faker.date.future().toISOString(),
    image: faker.image.url(),
    participants: faker.number.int({ min: 10, max: 200 }),
    ...overrides,
  };
}

export function createExploreTeamFixture(overrides?: Partial<ExploreTeam>): ExploreTeam {
  return {
    id: faker.string.uuid(),
    name: faker.company.name(),
    members: faker.number.int({ min: 5, max: 100 }),
    activityType: faker.helpers.arrayElement(['Running', 'Lifting', 'Yoga', 'HIIT']),
    image: faker.image.url(),
    ...overrides,
  };
}

export function buildGetExploreDataResponse(options: {
  success?: boolean;
  overrides?: Partial<{ events: ExploreEvent[]; featuredTeams: ExploreTeam[] }>
} = {}): Result<{ events: ExploreEvent[]; featuredTeams: ExploreTeam[] }> {
  if (options.success === false) {
    return Result.fail(new Error('Failed to fetch explore data'));
  }

  return Result.ok({
    events: Array.from({ length: 4 }).map(() => createExploreEventFixture()),
    featuredTeams: Array.from({ length: 4 }).map(() => createExploreTeamFixture()),
    ...options.overrides,
  });
}
