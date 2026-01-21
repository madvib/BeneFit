import type { AppType } from './index.js';
import { hc } from 'hono/client';

export type Client = ReturnType<typeof hc<AppType>>;

export const createClient = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args);

import {
  buildConnectServiceResponse,
  buildDisconnectServiceResponse,
  buildGetConnectedServicesResponse,
  buildSyncServiceDataResponse,
} from '@bene/integrations-domain';


// Training domain builders
import {
  buildGetProfileResponse,
  buildGetCurrentPlanResponse,
  buildGeneratePlanFromGoalsResponse,
  buildActivatePlanResponse,
  buildPausePlanResponse,
  buildGetUserStatsResponse,
  buildAdjustPlanBasedOnFeedbackResponse,
  buildGetTodaysWorkoutResponse,
  buildGetUpcomingWorkoutsResponse,
  buildGetWorkoutHistoryResponse,
  buildSkipWorkoutResponse,
  buildStartWorkoutResponse,
  buildCompleteWorkoutResponse,
  buildJoinMultiplayerWorkoutResponse,
  buildAddWorkoutReactionResponse,
} from '@bene/training-application';

// Coach domain builders
import {
  buildGetCoachHistoryResponse,
  buildSendMessageToCoachResponse,
  buildGenerateWeeklySummaryResponse,
  buildDismissCheckInResponse,
  buildRespondToCheckInResponse,
  buildTriggerProactiveCheckInResponse,
} from '@bene/coach-domain';

export function connectServiceResponse(): ReturnType<typeof buildConnectServiceResponse> { return buildConnectServiceResponse() }
export function disconnectServiceResponse(): ReturnType<typeof buildDisconnectServiceResponse> { return buildDisconnectServiceResponse() }
export function getConnectedServicesResponse(): ReturnType<typeof buildGetConnectedServicesResponse> { return buildGetConnectedServicesResponse() }
export function syncServiceDataResponse(): ReturnType<typeof buildSyncServiceDataResponse> { return buildSyncServiceDataResponse() }
export function getProfileResponse(): ReturnType<typeof buildGetProfileResponse> { return buildGetProfileResponse() }
export function getCurrentPlanResponse(): ReturnType<typeof buildGetCurrentPlanResponse> { return buildGetCurrentPlanResponse() }
export function generatePlanFromGoalsResponse(): ReturnType<typeof buildGeneratePlanFromGoalsResponse> { return buildGeneratePlanFromGoalsResponse() }
export function activatePlanResponse(): ReturnType<typeof buildActivatePlanResponse> { return buildActivatePlanResponse() }
export function pausePlanResponse(): ReturnType<typeof buildPausePlanResponse> { return buildPausePlanResponse() }
export function getUserStatsResponse(): ReturnType<typeof buildGetUserStatsResponse> { return buildGetUserStatsResponse() }
export function adjustPlanBasedOnFeedbackResponse(): ReturnType<typeof buildAdjustPlanBasedOnFeedbackResponse> { return buildAdjustPlanBasedOnFeedbackResponse() }
export function getTodaysWorkoutResponse(): ReturnType<typeof buildGetTodaysWorkoutResponse> { return buildGetTodaysWorkoutResponse() }
export function getUpcomingWorkoutsResponse(): ReturnType<typeof buildGetUpcomingWorkoutsResponse> { return buildGetUpcomingWorkoutsResponse() }
export function getWorkoutHistoryResponse(): ReturnType<typeof buildGetWorkoutHistoryResponse> { return buildGetWorkoutHistoryResponse() }
export function skipWorkoutResponse(): ReturnType<typeof buildSkipWorkoutResponse> { return buildSkipWorkoutResponse() }
export function startWorkoutResponse(): ReturnType<typeof buildStartWorkoutResponse> { return buildStartWorkoutResponse() }
export function completeWorkoutResponse(): ReturnType<typeof buildCompleteWorkoutResponse> { return buildCompleteWorkoutResponse() }
export function joinMultiplayerWorkoutResponse(): ReturnType<typeof buildJoinMultiplayerWorkoutResponse> { return buildJoinMultiplayerWorkoutResponse() }
export function addWorkoutReactionResponse(): ReturnType<typeof buildAddWorkoutReactionResponse> { return buildAddWorkoutReactionResponse() }
export function getCoachHistoryResponse(): ReturnType<typeof buildGetCoachHistoryResponse> { return buildGetCoachHistoryResponse() }
export function sendMessageToCoachResponse(): ReturnType<typeof buildSendMessageToCoachResponse> { return buildSendMessageToCoachResponse() }
export function generateWeeklySummaryResponse(): ReturnType<typeof buildGenerateWeeklySummaryResponse> { return buildGenerateWeeklySummaryResponse() }
export function dismissCheckInResponse(): ReturnType<typeof buildDismissCheckInResponse> { return buildDismissCheckInResponse() }
export function respondToCheckInResponse(): ReturnType<typeof buildRespondToCheckInResponse> { return buildRespondToCheckInResponse() }
export function triggerProactiveCheckInResponse(): ReturnType<typeof buildTriggerProactiveCheckInResponse> { return buildTriggerProactiveCheckInResponse() }