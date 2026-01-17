import { faker } from '@faker-js/faker';
import { fake } from '../setup.js';
import {
  GetUpcomingWorkoutsClientSchema,
  GetWorkoutHistoryClientSchema,
  SkipWorkoutClientSchema,
  StartWorkoutClientSchema,
  CompleteWorkoutClientSchema,
  JoinMultiplayerWorkoutClientSchema,
  AddWorkoutReactionClientSchema,
} from '../../src/routes/workouts.js';
import {
  GetUpcomingWorkoutsResponseSchema,
  GetWorkoutHistoryResponseSchema,
  GetTodaysWorkoutResponseSchema,
  SkipWorkoutResponseSchema,
  StartWorkoutResponseSchema,
  CompleteWorkoutResponseSchema,
  JoinMultiplayerWorkoutResponseSchema,
  AddWorkoutReactionResponseSchema,
} from '@bene/training-application';

/**
 * Fixtures for workout route request/response schemas
 */

// Pre-built request fixtures (using client schemas from routes)
export const getUpcomingWorkoutsRequest = fake(GetUpcomingWorkoutsClientSchema);

export const getWorkoutHistoryRequest = fake(GetWorkoutHistoryClientSchema);

export const skipWorkoutRequest = fake(SkipWorkoutClientSchema);

export const startWorkoutRequest = fake(StartWorkoutClientSchema);

export const completeWorkoutRequest = fake(CompleteWorkoutClientSchema);

export const joinMultiplayerWorkoutRequest = fake(JoinMultiplayerWorkoutClientSchema);

export const addWorkoutReactionRequest = fake(AddWorkoutReactionClientSchema);

// Pre-built response fixtures
export const getUpcomingWorkoutsResponse = fake(GetUpcomingWorkoutsResponseSchema);

export const getWorkoutHistoryResponse = fake(GetWorkoutHistoryResponseSchema);

export const getTodaysWorkoutResponse = fake(GetTodaysWorkoutResponseSchema);

export const skipWorkoutResponse = fake(SkipWorkoutResponseSchema);

export const startWorkoutResponse = fake(StartWorkoutResponseSchema);

export const completeWorkoutResponse = fake(CompleteWorkoutResponseSchema);

export const joinMultiplayerWorkoutResponse = fake(JoinMultiplayerWorkoutResponseSchema);

export const addWorkoutReactionResponse = fake(AddWorkoutReactionResponseSchema);

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
export function createGetUpcomingWorkoutsRequest(
  overrides?: DeepPartial<typeof getUpcomingWorkoutsRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GetUpcomingWorkoutsClientSchema), ...overrides };
}

export function createGetWorkoutHistoryRequest(
  overrides?: DeepPartial<typeof getWorkoutHistoryRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GetWorkoutHistoryClientSchema), ...overrides };
}

export function createSkipWorkoutRequest(
  overrides?: DeepPartial<typeof skipWorkoutRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(SkipWorkoutClientSchema), ...overrides };
}

export function createStartWorkoutRequest(
  overrides?: DeepPartial<typeof startWorkoutRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(StartWorkoutClientSchema), ...overrides };
}

export function createCompleteWorkoutRequest(
  overrides?: DeepPartial<typeof completeWorkoutRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(CompleteWorkoutClientSchema), ...overrides };
}

export function createJoinMultiplayerWorkoutRequest(
  overrides?: DeepPartial<typeof joinMultiplayerWorkoutRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(JoinMultiplayerWorkoutClientSchema), ...overrides };
}

export function createAddWorkoutReactionRequest(
  overrides?: DeepPartial<typeof addWorkoutReactionRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(AddWorkoutReactionClientSchema), ...overrides };
}

// Response helpers
export function createGetUpcomingWorkoutsResponse(
  overrides?: DeepPartial<typeof getUpcomingWorkoutsResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GetUpcomingWorkoutsResponseSchema), ...overrides };
}

export function createGetWorkoutHistoryResponse(
  overrides?: DeepPartial<typeof getWorkoutHistoryResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GetWorkoutHistoryResponseSchema), ...overrides };
}

export function createGetTodaysWorkoutResponse(
  overrides?: DeepPartial<typeof getTodaysWorkoutResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GetTodaysWorkoutResponseSchema), ...overrides };
}

export function createSkipWorkoutResponse(
  overrides?: DeepPartial<typeof skipWorkoutResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(SkipWorkoutResponseSchema), ...overrides };
}

export function createStartWorkoutResponse(
  overrides?: DeepPartial<typeof startWorkoutResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(StartWorkoutResponseSchema), ...overrides };
}

export function createCompleteWorkoutResponse(
  overrides?: DeepPartial<typeof completeWorkoutResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(CompleteWorkoutResponseSchema), ...overrides };
}

export function createJoinMultiplayerWorkoutResponse(
  overrides?: DeepPartial<typeof joinMultiplayerWorkoutResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(JoinMultiplayerWorkoutResponseSchema), ...overrides };
}

export function createAddWorkoutReactionResponse(
  overrides?: DeepPartial<typeof addWorkoutReactionResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(AddWorkoutReactionResponseSchema), ...overrides };
}

