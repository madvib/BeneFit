import { faker } from '@faker-js/faker';

import { createTrainingConstraintsFixture, createExperienceProfileFixture, createFitnessGoalsFixture, createUserPreferencesFixture, createUserStatsFixture } from '@/fixtures.js';
import { userProfileFromPersistence } from '../user-profile.factory.js';
import { UserProfile } from '../user-profile.types.js';

/**
 * Creates a UserProfile fixture for testing.
 * Rehydrates from persistence to ensure branding and type safety.
 */
export function createUserProfileFixture(overrides?: Partial<UserProfile>): UserProfile {
  const now = new Date();

  const data = {
    userId: faker.string.uuid(),
    displayName: faker.person.fullName(),
    avatar: faker.image.avatar(),
    bio: faker.lorem.sentence(),
    location: faker.location.city(),
    timezone: faker.location.timeZone(),

    experienceProfile: createExperienceProfileFixture(),
    fitnessGoals: createFitnessGoalsFixture(),
    trainingConstraints: createTrainingConstraintsFixture(),
    preferences: createUserPreferencesFixture(),
    stats: createUserStatsFixture(),

    createdAt: now,
    updatedAt: now,
    lastActiveAt: now,
    ...overrides,
  };

  const result = userProfileFromPersistence(data);

  if (result.isFailure) {
    throw new Error(`Failed to create UserProfile fixture: ${ result.error }`);
  }

  return result.value;
}
