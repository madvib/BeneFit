import { faker } from '@faker-js/faker';
import { UserStats, Achievement } from '../user-stats.types.js';
import { userStatsFromPersistence } from '../user-stats.factory.js';

export function createAchievementFixture(overrides?: Partial<Achievement>): Achievement {
  const data = {
    id: faker.string.uuid(),
    type: 'first_workout' as const,
    name: faker.lorem.words(2),
    description: faker.lorem.sentence(),
    earnedAt: faker.date.recent(),
    ...overrides,
  };

  return data as Achievement;
}

export function createUserStatsFixture(overrides?: Partial<UserStats>): UserStats {
  const data = {
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

  const result = userStatsFromPersistence(data);

  if (result.isFailure) {
    throw new Error(`Failed to create UserStats fixture: ${ result.error }`);
  }

  return result.value;
}
