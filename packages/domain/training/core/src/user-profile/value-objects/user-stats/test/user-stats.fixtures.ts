import { faker } from '@faker-js/faker';
import { UserStats, Achievement } from '../user-stats.types.js';

export function createAchievementFixture(overrides?: Partial<Achievement>): Achievement {
  return {
    id: faker.string.uuid(),
    type: 'first_workout',
    name: faker.lorem.words(2),
    description: faker.lorem.sentence(),
    earnedAt: faker.date.recent(),
    ...overrides,
  };
}

export function createUserStatsFixture(overrides?: Partial<UserStats>): UserStats {
  return {
    totalWorkouts: faker.number.int({ min: 0, max: 100 }),
    totalMinutes: faker.number.int({ min: 0, max: 5000 }),
    totalVolume: faker.number.int({ min: 0, max: 50000 }),
    currentStreak: faker.number.int({ min: 0, max: 10 }),
    longestStreak: faker.number.int({ min: 0, max: 20 }),
    lastWorkoutDate: faker.date.recent(),
    achievements: [createAchievementFixture()],
    firstWorkoutDate: faker.date.past(),
    joinedAt: faker.date.past(),
    ...overrides,
  };
}
