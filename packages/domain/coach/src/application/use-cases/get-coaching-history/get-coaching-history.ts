import { z } from 'zod';
import { Result, BaseUseCase } from '@bene/shared';
import {
  toCoachMsgView,
  toCheckInView,
  type CoachMsgView,
  type CheckInView,
  CoachConversationQueries
} from '@/core/index.js';
import { CoachConversationRepository } from '@/application/ports/coach-conversation-repository.js';

/**
 * Request schema
 */
export const GetCoachHistoryRequestSchema = z.object({
  userId: z.uuid(),
  limit: z.number().int().min(1).max(100).optional(),
});

export type GetCoachHistoryRequest = z.infer<typeof GetCoachHistoryRequestSchema>;

/**
 * Response type - composed of domain views
 */
export interface GetCoachHistoryResponse {
  messages: CoachMsgView[];
  pendingCheckIns: CheckInView[];
  stats: {
    totalMessages: number;
    totalCheckIns: number;
    actionsApplied: number;
  };
}

/**
 * Use case for retrieving coaching history.
 * 
 * Pattern: Loads aggregate → Filters/Slices → Maps to domain views
 */
export class GetCoachHistoryUseCase extends BaseUseCase<
  GetCoachHistoryRequest,
  GetCoachHistoryResponse
> {
  constructor(private conversationRepository: CoachConversationRepository) {
    super();
  }

  protected async performExecution(
    request: GetCoachHistoryRequest,
  ): Promise<Result<GetCoachHistoryResponse>> {
    const conversationResult = await this.conversationRepository.findByUserId(
      request.userId,
    );

    if (conversationResult.isFailure) {
      return Result.fail(conversationResult.error);
    }

    const conversation = conversationResult.value;
    const limit = request.limit || 50;

    // Slice only the messages we need before mapping to view
    const recentMessages = conversation.messages.slice(-limit);

    return Result.ok({
      messages: recentMessages.map(toCoachMsgView),
      pendingCheckIns: conversation.checkIns
        .filter((c) => c.status === 'pending')
        .map(toCheckInView),
      stats: {
        totalMessages: conversation.totalMessages,
        totalCheckIns: conversation.totalCheckIns,
        actionsApplied: CoachConversationQueries.getTotalActionsApplied(conversation),
      },
    });
  }
}
