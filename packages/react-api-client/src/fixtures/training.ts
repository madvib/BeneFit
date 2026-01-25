import { faker } from '@faker-js/faker';
import {
  buildCreateUserProfileResponse as _buildCreateUserProfileResponse,
  buildUpdateFitnessGoalsResponse as _buildUpdateFitnessGoalsResponse,
  buildUpdatePreferencesResponse as _buildUpdatePreferencesResponse,
  buildUpdateTrainingConstraintsResponse as _buildUpdateTrainingConstraintsResponse,
  buildGetProfileResponse as _buildGetProfileResponse,
  buildGetCurrentPlanResponse as _buildGetCurrentPlanResponse,
  buildGeneratePlanFromGoalsResponse as _buildGeneratePlanFromGoalsResponse,
  buildActivatePlanResponse as _buildActivatePlanResponse,
  buildPausePlanResponse as _buildPausePlanResponse,
  buildGetUserStatsResponse as _buildGetUserStatsResponse,
  buildAdjustPlanBasedOnFeedbackResponse as _buildAdjustPlanBasedOnFeedbackResponse,
  buildGetTodaysWorkoutResponse as _buildGetTodaysWorkoutResponse,
  buildGetUpcomingWorkoutsResponse as _buildGetUpcomingWorkoutsResponse,
  buildGetWorkoutHistoryResponse as _buildGetWorkoutHistoryResponse,
  buildSkipWorkoutResponse as _buildSkipWorkoutResponse,
  buildStartWorkoutResponse as _buildStartWorkoutResponse,
  buildCompleteWorkoutResponse as _buildCompleteWorkoutResponse,
  buildJoinMultiplayerWorkoutResponse as _buildJoinMultiplayerWorkoutResponse,
  buildAddWorkoutReactionResponse as _buildAddWorkoutReactionResponse,
  createTrainingConstraintsFixture,
  createWorkoutSessionFixture,
} from '@bene/training-application/fixtures';
import { type FixtureOptions } from './utils.js';

/**
 * Training HTTP response builders
 * Simple wrappers that add seed control to domain fixtures
 */

function applySeed(options?: FixtureOptions) {
  if (options?.seed !== undefined) {
    faker.seed(options.seed);
  }
}

export function buildGetProfileResponse(
  options: Parameters<typeof _buildGetProfileResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildGetProfileResponse(options);
}

export function buildGetCurrentPlanResponse(
  options: Parameters<typeof _buildGetCurrentPlanResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildGetCurrentPlanResponse(options);
}

export function buildGeneratePlanFromGoalsResponse(
  options: Parameters<typeof _buildGeneratePlanFromGoalsResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildGeneratePlanFromGoalsResponse(options);
}

export function buildActivatePlanResponse(
  options: Parameters<typeof _buildActivatePlanResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildActivatePlanResponse(options);
}

export function buildPausePlanResponse(
  options: Parameters<typeof _buildPausePlanResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildPausePlanResponse(options);
}

export function buildGetUserStatsResponse(
  options: Parameters<typeof _buildGetUserStatsResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildGetUserStatsResponse(options);
}

export function buildAdjustPlanBasedOnFeedbackResponse(
  options: Parameters<typeof _buildAdjustPlanBasedOnFeedbackResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildAdjustPlanBasedOnFeedbackResponse(options);
}

export function buildGetTodaysWorkoutResponse(
  options: Parameters<typeof _buildGetTodaysWorkoutResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildGetTodaysWorkoutResponse(options);
}

export function buildGetUpcomingWorkoutsResponse(
  options: Parameters<typeof _buildGetUpcomingWorkoutsResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildGetUpcomingWorkoutsResponse(options);
}

export function buildGetWorkoutHistoryResponse(
  options: Parameters<typeof _buildGetWorkoutHistoryResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildGetWorkoutHistoryResponse(options);
}

export function buildSkipWorkoutResponse(
  options: Parameters<typeof _buildSkipWorkoutResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildSkipWorkoutResponse(options);
}

export function buildStartWorkoutResponse(
  options: Parameters<typeof _buildStartWorkoutResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildStartWorkoutResponse(options);
}

export function buildCompleteWorkoutResponse(
  options: Parameters<typeof _buildCompleteWorkoutResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildCompleteWorkoutResponse(options);
}

export function buildJoinMultiplayerWorkoutResponse(
  options: Parameters<typeof _buildJoinMultiplayerWorkoutResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildJoinMultiplayerWorkoutResponse(options);
}

export function buildCreateUserProfileResponse(
  options: Parameters<typeof _buildCreateUserProfileResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildCreateUserProfileResponse(options);
}

export function buildUpdateFitnessGoalsResponse(
  options: Parameters<typeof _buildUpdateFitnessGoalsResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildUpdateFitnessGoalsResponse(options);
}

export function buildUpdatePreferencesResponse(
  options: Parameters<typeof _buildUpdatePreferencesResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildUpdatePreferencesResponse(options);
}

export function buildUpdateTrainingConstraintsResponse(
  options: Parameters<typeof _buildUpdateTrainingConstraintsResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildUpdateTrainingConstraintsResponse(options);
}

export function buildAddWorkoutReactionResponse(
  options: Parameters<typeof _buildAddWorkoutReactionResponse>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return _buildAddWorkoutReactionResponse(options);
}

export function buildTrainingConstraintsResponse(
  options: Parameters<typeof createTrainingConstraintsFixture>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return createTrainingConstraintsFixture(options);
}


export function buildWorkoutSessionResponse(
  options: Parameters<typeof createWorkoutSessionFixture>[0] = {},
  fixtureOptions?: FixtureOptions
) {
  applySeed(fixtureOptions);
  return createWorkoutSessionFixture(options);
}
