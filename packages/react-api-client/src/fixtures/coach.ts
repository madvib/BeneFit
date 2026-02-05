import { Result } from '@bene/shared';
import {
  buildGetCoachHistoryResponse as _buildGetCoachHistoryResponse,
  buildTriggerProactiveCheckInResponse as _buildTriggerProactiveCheckInResponse,
  buildSendMessageToCoachResponse as _buildSendMessageToCoachResponse,
  buildGenerateWeeklySummaryResponse as _buildGenerateWeeklySummaryResponse,
  buildDismissCheckInResponse as _buildDismissCheckInResponse,
  buildRespondToCheckInResponse as _buildRespondToCheckInResponse,
} from '@bene/coach-domain/fixtures';
import type {
  GetCoachHistoryResponse,
  TriggerProactiveCheckInResponse,
  SendMessageToCoachResponse,
  GenerateWeeklySummaryResponse,
  DismissCheckInResponse,
  RespondToCheckInResponse,
} from '@bene/coach-domain';
import { type WithSeed, applySeed } from './utils.js';


export function buildGetCoachHistoryResponse(
  options: WithSeed<Parameters<typeof _buildGetCoachHistoryResponse>[0]> = {}
): Result<GetCoachHistoryResponse> {
  applySeed(options);
  return _buildGetCoachHistoryResponse(options);
}

export function buildTriggerProactiveCheckInResponse(
  options: WithSeed<Parameters<typeof _buildTriggerProactiveCheckInResponse>[0]> = {}
): Result<TriggerProactiveCheckInResponse> {
  applySeed(options);
  return _buildTriggerProactiveCheckInResponse(options);
}

export function buildSendMessageToCoachResponse(
  options: WithSeed<Parameters<typeof _buildSendMessageToCoachResponse>[0]> = {}
): Result<SendMessageToCoachResponse> {
  applySeed(options);
  return _buildSendMessageToCoachResponse(options);
}

export function buildGenerateWeeklySummaryResponse(
  options: WithSeed<Parameters<typeof _buildGenerateWeeklySummaryResponse>[0]> = {}
): Result<GenerateWeeklySummaryResponse> {
  applySeed(options);
  return _buildGenerateWeeklySummaryResponse(options);
}

export function buildDismissCheckInResponse(
  options: WithSeed<Parameters<typeof _buildDismissCheckInResponse>[0]> = {}
): Result<DismissCheckInResponse> {
  applySeed(options);
  return _buildDismissCheckInResponse(options);
}

export function buildRespondToCheckInResponse(
  options: WithSeed<Parameters<typeof _buildRespondToCheckInResponse>[0]> = {}
): Result<RespondToCheckInResponse> {
  applySeed(options);
  return _buildRespondToCheckInResponse(options);
}


