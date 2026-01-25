import { faker } from '@faker-js/faker';

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
