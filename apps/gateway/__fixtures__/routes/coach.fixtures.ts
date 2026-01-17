import { faker } from '@faker-js/faker';
import { fake } from '../setup.js';
import {
  SendMessageToCoachClientSchema,
  DismissCheckInClientSchema,
  RespondToCheckInClientSchema,
} from '../../src/routes/coach.js';
import {
  GenerateWeeklySummaryRequestSchema,
  GenerateWeeklySummaryResponseSchema,
  GetCoachHistoryRequestSchema,
  GetCoachHistoryResponseSchema,
  TriggerProactiveCheckInRequestSchema,
  TriggerProactiveCheckInResponseSchema,
  SendMessageToCoachResponseSchema,
  DismissCheckInResponseSchema,
  RespondToCheckInResponseSchema,
} from '@bene/coach-domain';

/**
 * Fixtures for coach route request/response schemas
 */

// Pre-built request fixtures (using client schemas from routes)
export const sendMessageRequest = fake(SendMessageToCoachClientSchema);

export const dismissCheckInRequest = fake(DismissCheckInClientSchema);

export const respondToCheckInRequest = fake(RespondToCheckInClientSchema);

export const generateWeeklySummaryRequest = fake(GenerateWeeklySummaryRequestSchema);

export const getCoachHistoryRequest = fake(GetCoachHistoryRequestSchema);

export const triggerProactiveCheckInRequest = fake(TriggerProactiveCheckInRequestSchema);

// Pre-built response fixtures
export const sendMessageResponse = fake(SendMessageToCoachResponseSchema);

export const generateWeeklySummaryResponse = fake(GenerateWeeklySummaryResponseSchema);

export const getCoachHistoryResponse = fake(GetCoachHistoryResponseSchema);

export const dismissCheckInResponse = fake(DismissCheckInResponseSchema);

export const respondToCheckInResponse = fake(RespondToCheckInResponseSchema);

export const triggerProactiveCheckInResponse = fake(TriggerProactiveCheckInResponseSchema);

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
export function createSendMessageRequest(
  overrides?: DeepPartial<typeof sendMessageRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(SendMessageToCoachClientSchema), ...overrides };
}

export function createDismissCheckInRequest(
  overrides?: DeepPartial<typeof dismissCheckInRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(DismissCheckInClientSchema), ...overrides };
}

export function createRespondToCheckInRequest(
  overrides?: DeepPartial<typeof respondToCheckInRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(RespondToCheckInClientSchema), ...overrides };
}

export function createGenerateWeeklySummaryRequest(
  overrides?: DeepPartial<typeof generateWeeklySummaryRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GenerateWeeklySummaryRequestSchema), ...overrides };
}

export function createGetCoachHistoryRequest(
  overrides?: DeepPartial<typeof getCoachHistoryRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GetCoachHistoryRequestSchema), ...overrides };
}

export function createTriggerProactiveCheckInRequest(
  overrides?: DeepPartial<typeof triggerProactiveCheckInRequest>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(TriggerProactiveCheckInRequestSchema), ...overrides };
}

// Response helpers
export function createSendMessageResponse(
  overrides?: DeepPartial<typeof sendMessageResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(SendMessageToCoachResponseSchema), ...overrides };
}

export function createGenerateWeeklySummaryResponse(
  overrides?: DeepPartial<typeof generateWeeklySummaryResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GenerateWeeklySummaryResponseSchema), ...overrides };
}

export function createGetCoachHistoryResponse(
  overrides?: DeepPartial<typeof getCoachHistoryResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(GetCoachHistoryResponseSchema), ...overrides };
}

export function createDismissCheckInResponse(
  overrides?: DeepPartial<typeof dismissCheckInResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(DismissCheckInResponseSchema), ...overrides };
}

export function createRespondToCheckInResponse(
  overrides?: DeepPartial<typeof respondToCheckInResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(RespondToCheckInResponseSchema), ...overrides };
}

export function createTriggerProactiveCheckInResponse(
  overrides?: DeepPartial<typeof triggerProactiveCheckInResponse>,
  options?: FixtureOptions
) {
  if (options?.seed !== undefined) faker.seed(options.seed);
  return { ...fake(TriggerProactiveCheckInResponseSchema), ...overrides };
}

