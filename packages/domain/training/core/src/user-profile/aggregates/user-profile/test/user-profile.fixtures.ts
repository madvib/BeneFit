import { faker } from '@faker-js/faker';
import { createTrainingConstraintsFixture } from '@/shared/value-objects/training-constraints/index.js';
import { createExperienceProfileFixture, createFitnessGoalsFixture, createUserPreferencesFixture, createUserStatsFixture } from '../../../value-objects/index.js';
import { UserProfile } from '../user-profile.types.js';

export function createUserProfileFixture(overrides?: Partial<UserProfile>): UserProfile {
  const now = new Date();

  return {
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
}
