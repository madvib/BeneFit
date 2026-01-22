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
  overrides?: Parameters<typeof _buildGetProfileResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildGetProfileResponse(overrides);
}

export function buildGetCurrentPlanResponse(
  overrides?: Parameters<typeof _buildGetCurrentPlanResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildGetCurrentPlanResponse(overrides);
}

export function buildGeneratePlanFromGoalsResponse(
  overrides?: Parameters<typeof _buildGeneratePlanFromGoalsResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildGeneratePlanFromGoalsResponse(overrides);
}

export function buildActivatePlanResponse(
  overrides?: Parameters<typeof _buildActivatePlanResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildActivatePlanResponse(overrides);
}

export function buildPausePlanResponse(
  overrides?: Parameters<typeof _buildPausePlanResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildPausePlanResponse(overrides);
}

export function buildGetUserStatsResponse(
  overrides?: Parameters<typeof _buildGetUserStatsResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildGetUserStatsResponse(overrides);
}

export function buildAdjustPlanBasedOnFeedbackResponse(
  overrides?: Parameters<typeof _buildAdjustPlanBasedOnFeedbackResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildAdjustPlanBasedOnFeedbackResponse(overrides);
}

export function buildGetTodaysWorkoutResponse(
  overrides?: Parameters<typeof _buildGetTodaysWorkoutResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildGetTodaysWorkoutResponse(overrides);
}

export function buildGetUpcomingWorkoutsResponse(
  overrides?: Parameters<typeof _buildGetUpcomingWorkoutsResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildGetUpcomingWorkoutsResponse(overrides);
}

export function buildGetWorkoutHistoryResponse(
  overrides?: Parameters<typeof _buildGetWorkoutHistoryResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildGetWorkoutHistoryResponse(overrides);
}

export function buildSkipWorkoutResponse(
  overrides?: Parameters<typeof _buildSkipWorkoutResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildSkipWorkoutResponse(overrides);
}

export function buildStartWorkoutResponse(
  overrides?: Parameters<typeof _buildStartWorkoutResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildStartWorkoutResponse(overrides);
}

export function buildCompleteWorkoutResponse(
  overrides?: Parameters<typeof _buildCompleteWorkoutResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildCompleteWorkoutResponse(overrides);
}

export function buildJoinMultiplayerWorkoutResponse(
  overrides?: Parameters<typeof _buildJoinMultiplayerWorkoutResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildJoinMultiplayerWorkoutResponse(overrides);
}

export function buildCreateUserProfileResponse(
  overrides?: Parameters<typeof _buildCreateUserProfileResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildCreateUserProfileResponse(overrides);
}

export function buildUpdateFitnessGoalsResponse(
  overrides?: Parameters<typeof _buildUpdateFitnessGoalsResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildUpdateFitnessGoalsResponse(overrides);
}

export function buildUpdatePreferencesResponse(
  overrides?: Parameters<typeof _buildUpdatePreferencesResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildUpdatePreferencesResponse(overrides);
}

export function buildUpdateTrainingConstraintsResponse(
  overrides?: Parameters<typeof _buildUpdateTrainingConstraintsResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildUpdateTrainingConstraintsResponse(overrides);
}

export function buildAddWorkoutReactionResponse(
  overrides?: Parameters<typeof _buildAddWorkoutReactionResponse>[0],
  options?: FixtureOptions
) {
  applySeed(options);
  return _buildAddWorkoutReactionResponse(overrides);
}
