import { faker } from '@faker-js/faker';
import { fake } from '../setup.js';
import {
  CreateUserProfileClientSchema,
  UpdateFitnessGoalsClientSchema,
  UpdatePreferencesClientSchema,
  UpdateTrainingConstraintsClientSchema,
} from '../../src/routes/profile.js';
import {
  GetProfileRequestSchema,
  GetProfileResponseSchema,
  CreateUserProfileResponseSchema,
  UpdateFitnessGoalsResponseSchema,
  UpdatePreferencesResponseSchema,
  GetUserStatsRequestSchema,
  GetUserStatsResponseSchema,
  UpdateTrainingConstraintsResponseSchema,
} from '@bene/training-application';

/**
 * Fixtures for profile route request/response schemas
 */

// Pre-built request fixtures (using client schemas from routes)
export const getProfileRequest = fake(GetProfileRequestSchema);

export const createUserProfileRequest = fake(CreateUserProfileClientSchema);

export const updateFitnessGoalsRequest = fake(UpdateFitnessGoalsClientSchema);

export const updatePreferencesRequest = fake(UpdatePreferencesClientSchema);

export const getUserStatsRequest = fake(GetUserStatsRequestSchema);

export const updateTrainingConstraintsRequest = fake(UpdateTrainingConstraintsClientSchema);

// Pre-built response fixtures
export const getProfileResponse = fake(GetProfileResponseSchema);

export const createUserProfileResponse = fake(CreateUserProfileResponseSchema);

export const updateFitnessGoalsResponse = fake(UpdateFitnessGoalsResponseSchema);

export const updatePreferencesResponse = fake(UpdatePreferencesResponseSchema);

export const getUserStatsResponse = fake(GetUserStatsResponseSchema);

export const updateTrainingConstraintsResponse = fake(UpdateTrainingConstraintsResponseSchema);

/**
 * Helper functions for creating fixtures with overrides and optional seeding
 */

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>;
} : T;

interface FixtureOptions {
  seed?: number;
}

// Request helpers
export function createGetProfileRequest(
  overrides?: DeepPartial<typeof getProfileRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GetProfileRequestSchema), ...overrides };
}

export function createCreateUserProfileRequest(
  overrides?: DeepPartial<typeof createUserProfileRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(CreateUserProfileClientSchema), ...overrides };
}

export function createUpdateFitnessGoalsRequest(
  overrides?: DeepPartial<typeof updateFitnessGoalsRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(UpdateFitnessGoalsClientSchema), ...overrides };
}

export function createUpdatePreferencesRequest(
  overrides?: DeepPartial<typeof updatePreferencesRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(UpdatePreferencesClientSchema), ...overrides };
}

export function createGetUserStatsRequest(
  overrides?: DeepPartial<typeof getUserStatsRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GetUserStatsRequestSchema), ...overrides };
}

export function createUpdateTrainingConstraintsRequest(
  overrides?: DeepPartial<typeof updateTrainingConstraintsRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(UpdateTrainingConstraintsClientSchema), ...overrides };
}

// Response helpers
export function createGetProfileResponse(
  overrides?: DeepPartial<typeof getProfileResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GetProfileResponseSchema), ...overrides };
}

export function createCreateUserProfileResponse(
  overrides?: DeepPartial<typeof createUserProfileResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(CreateUserProfileResponseSchema), ...overrides };
}

export function createUpdateFitnessGoalsResponse(
  overrides?: DeepPartial<typeof updateFitnessGoalsResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(UpdateFitnessGoalsResponseSchema), ...overrides };
}

export function createUpdatePreferencesResponse(
  overrides?: DeepPartial<typeof updatePreferencesResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(UpdatePreferencesResponseSchema), ...overrides };
}

export function createGetUserStatsResponse(
  overrides?: DeepPartial<typeof getUserStatsResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GetUserStatsResponseSchema), ...overrides };
}

export function createUpdateTrainingConstraintsResponse(
  overrides?: DeepPartial<typeof updateTrainingConstraintsResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(UpdateTrainingConstraintsResponseSchema), ...overrides };
}

