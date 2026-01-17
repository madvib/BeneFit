import { faker } from '@faker-js/faker';
import { fake } from '../setup.js';
import {
  GeneratePlanFromGoalsClientSchema,
  ActivatePlanClientSchema,
  AdjustPlanClientSchema,
  PausePlanClientSchema,
} from '../../src/routes/fitness-plan.js';
import {
  GetCurrentPlanRequestSchema,
  GetCurrentPlanResponseSchema,
  GeneratePlanFromGoalsResponseSchema,
  ActivatePlanResponseSchema,
  AdjustPlanBasedOnFeedbackResponseSchema,
  PausePlanResponseSchema,
} from '@bene/training-application';

/**
 * Fixtures for fitness plan route request/response schemas
 */

// Pre-built request fixtures (using client schemas from routes)
export const getCurrentPlanRequest = fake(GetCurrentPlanRequestSchema);

export const generatePlanFromGoalsRequest = fake(GeneratePlanFromGoalsClientSchema);

export const activatePlanRequest = fake(ActivatePlanClientSchema);

export const adjustPlanRequest = fake(AdjustPlanClientSchema);

export const pausePlanRequest = fake(PausePlanClientSchema);

// Pre-built response fixtures
export const getCurrentPlanResponse = fake(GetCurrentPlanResponseSchema);

export const generatePlanFromGoalsResponse = fake(GeneratePlanFromGoalsResponseSchema);

export const activatePlanResponse = fake(ActivatePlanResponseSchema);

export const adjustPlanResponse = fake(AdjustPlanBasedOnFeedbackResponseSchema);

export const pausePlanResponse = fake(PausePlanResponseSchema);

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
export function createGetCurrentPlanRequest(
  overrides?: DeepPartial<typeof getCurrentPlanRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GetCurrentPlanRequestSchema), ...overrides };
}

export function createGeneratePlanFromGoalsRequest(
  overrides?: DeepPartial<typeof generatePlanFromGoalsRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GeneratePlanFromGoalsClientSchema), ...overrides };
}

export function createActivatePlanRequest(
  overrides?: DeepPartial<typeof activatePlanRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(ActivatePlanClientSchema), ...overrides };
}

export function createAdjustPlanRequest(
  overrides?: DeepPartial<typeof adjustPlanRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(AdjustPlanClientSchema), ...overrides };
}

export function createPausePlanRequest(
  overrides?: DeepPartial<typeof pausePlanRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(PausePlanClientSchema), ...overrides };
}

// Response helpers
export function createGetCurrentPlanResponse(
  overrides?: DeepPartial<typeof getCurrentPlanResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GetCurrentPlanResponseSchema), ...overrides };
}

export function createGeneratePlanFromGoalsResponse(
  overrides?: DeepPartial<typeof generatePlanFromGoalsResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GeneratePlanFromGoalsResponseSchema), ...overrides };
}

export function createActivatePlanResponse(
  overrides?: DeepPartial<typeof activatePlanResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(ActivatePlanResponseSchema), ...overrides };
}

export function createAdjustPlanResponse(
  overrides?: DeepPartial<typeof adjustPlanResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(AdjustPlanBasedOnFeedbackResponseSchema), ...overrides };
}

export function createPausePlanResponse(
  overrides?: DeepPartial<typeof pausePlanResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(PausePlanResponseSchema), ...overrides };
}

