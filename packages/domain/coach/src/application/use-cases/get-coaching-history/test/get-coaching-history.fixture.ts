import { Result, type BaseFixtureOptions, handleFixtureOptions } from '@bene/shared';
import { createCoachConversationFixture } from '../../../../fixtures.js';
import {
  toCoachMsgView,
  toCheckInView,
  CoachConversationQueries
} from '@core/index.js';
import type { GetCoachHistoryResponse } from '../get-coaching-history.js';

export type GetCoachHistoryFixtureOptions = BaseFixtureOptions<GetCoachHistoryResponse>;

/**
 * TODO evaluate coach domain entities...this could probably just return a conversation view
 * Build GetCoachHistoryResponse fixture using domain fixtures + view mappers
 * 
 * Pattern: Domain fixture → View mappers → Use case response
 */
export function buildGetCoachHistoryResponse(
  options: GetCoachHistoryFixtureOptions = {}
): Result<GetCoachHistoryResponse> {
  const { overrides } = options;

  const errorResult = handleFixtureOptions(options, 'Failed to fetch coaching history');
  if (errorResult) return errorResult;

  // 1. Create domain fixture
  const conversation = createCoachConversationFixture();

  // 2. Map to response structure using domain view mappers
  // This ensures fixtures provide exactly what the real use case provides
  //TODO this could probably map to a function in the use case file instead of duplicating.
  const response: GetCoachHistoryResponse = {
    messages: conversation.messages.slice(-50).map(toCoachMsgView),
    pendingCheckIns: conversation.checkIns
      .filter((c) => c.status === 'pending')
      .map(toCheckInView),
    stats: {
      totalMessages: conversation.totalMessages,
      totalCheckIns: conversation.totalCheckIns,
      actionsApplied: CoachConversationQueries.getTotalActionsApplied(conversation),
    },
  };

  return Result.ok({
    ...response,
    ...overrides,
  });
}
