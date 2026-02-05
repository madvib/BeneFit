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
import { type WithSeed, applySeed } from './utils.js';

/**
 * Training HTTP response builders
 * Simple wrappers that add seed control to domain fixtures
 */



export function buildGetProfileResponse(
  options: WithSeed<Parameters<typeof _buildGetProfileResponse>[0]> = {}
) {
  applySeed(options);
  return _buildGetProfileResponse(options);
}

export function buildGetCurrentPlanResponse(
  options: WithSeed<Parameters<typeof _buildGetCurrentPlanResponse>[0]> = {}
) {
  applySeed(options);
  return _buildGetCurrentPlanResponse(options);
}

export function buildGeneratePlanFromGoalsResponse(
  options: WithSeed<Parameters<typeof _buildGeneratePlanFromGoalsResponse>[0]> = {}
) {
  applySeed(options);
  return _buildGeneratePlanFromGoalsResponse(options);
}

export function buildActivatePlanResponse(
  options: WithSeed<Parameters<typeof _buildActivatePlanResponse>[0]> = {}
) {
  applySeed(options);
  return _buildActivatePlanResponse(options);
}

export function buildPausePlanResponse(
  options: WithSeed<Parameters<typeof _buildPausePlanResponse>[0]> = {}
) {
  applySeed(options);
  return _buildPausePlanResponse(options);
}

export function buildGetUserStatsResponse(
  options: WithSeed<Parameters<typeof _buildGetUserStatsResponse>[0]> = {}
) {
  applySeed(options);
  return _buildGetUserStatsResponse(options);
}

export function buildAdjustPlanBasedOnFeedbackResponse(
  options: WithSeed<Parameters<typeof _buildAdjustPlanBasedOnFeedbackResponse>[0]> = {}
) {
  applySeed(options);
  return _buildAdjustPlanBasedOnFeedbackResponse(options);
}

export function buildGetTodaysWorkoutResponse(
  options: WithSeed<Parameters<typeof _buildGetTodaysWorkoutResponse>[0]> = {}
) {
  applySeed(options);
  return _buildGetTodaysWorkoutResponse(options);
}

export function buildGetUpcomingWorkoutsResponse(
  options: WithSeed<Parameters<typeof _buildGetUpcomingWorkoutsResponse>[0]> = {}
) {
  applySeed(options);
  return _buildGetUpcomingWorkoutsResponse(options);
}

export function buildGetWorkoutHistoryResponse(
  options: WithSeed<Parameters<typeof _buildGetWorkoutHistoryResponse>[0]> = {}
) {
  applySeed(options);
  return _buildGetWorkoutHistoryResponse(options);
}

export function buildSkipWorkoutResponse(
  options: WithSeed<Parameters<typeof _buildSkipWorkoutResponse>[0]> = {}
) {
  applySeed(options);
  return _buildSkipWorkoutResponse(options);
}

export function buildStartWorkoutResponse(
  options: WithSeed<Parameters<typeof _buildStartWorkoutResponse>[0]> = {}
) {
  applySeed(options);
  return _buildStartWorkoutResponse(options);
}

export function buildCompleteWorkoutResponse(
  options: WithSeed<Parameters<typeof _buildCompleteWorkoutResponse>[0]> = {}
) {
  applySeed(options);
  return _buildCompleteWorkoutResponse(options);
}

export function buildJoinMultiplayerWorkoutResponse(
  options: WithSeed<Parameters<typeof _buildJoinMultiplayerWorkoutResponse>[0]> = {}
) {
  applySeed(options);
  return _buildJoinMultiplayerWorkoutResponse(options);
}

export function buildCreateUserProfileResponse(
  options: WithSeed<Parameters<typeof _buildCreateUserProfileResponse>[0]> = {}
) {
  applySeed(options);
  return _buildCreateUserProfileResponse(options);
}

export function buildUpdateFitnessGoalsResponse(
  options: WithSeed<Parameters<typeof _buildUpdateFitnessGoalsResponse>[0]> = {}
) {
  applySeed(options);
  return _buildUpdateFitnessGoalsResponse(options);
}

export function buildUpdatePreferencesResponse(
  options: WithSeed<Parameters<typeof _buildUpdatePreferencesResponse>[0]> = {}
) {
  applySeed(options);
  return _buildUpdatePreferencesResponse(options);
}

export function buildUpdateTrainingConstraintsResponse(
  options: WithSeed<Parameters<typeof _buildUpdateTrainingConstraintsResponse>[0]> = {}
) {
  applySeed(options);
  return _buildUpdateTrainingConstraintsResponse(options);
}

export function buildAddWorkoutReactionResponse(
  options: WithSeed<Parameters<typeof _buildAddWorkoutReactionResponse>[0]> = {}
) {
  applySeed(options);
  return _buildAddWorkoutReactionResponse(options);
}

export function buildTrainingConstraintsResponse(
  options: WithSeed<Parameters<typeof createTrainingConstraintsFixture>[0]> = {}
) {
  applySeed(options);
  return createTrainingConstraintsFixture(options);
}


export function buildWorkoutSessionResponse(
  options: WithSeed<Parameters<typeof createWorkoutSessionFixture>[0]> = {}
) {
  applySeed(options);
  return createWorkoutSessionFixture(options);
}
