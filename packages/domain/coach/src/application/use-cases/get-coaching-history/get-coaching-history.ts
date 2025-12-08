import { Result, UseCase } from '@bene/shared-domain';
import { CoachConversation } from '@core/index.js';
import { CoachConversationRepository } from '../../repositories/coach-conversation-repository.js';

export interface GetCoachHistoryRequest {
  userId: string;
  limit?: number;
}

export interface GetCoachHistoryResponse {
  messages: Array<{
    id: string;
    role: 'user' | 'coach' | 'system';
    content: string;
    timestamp: Date;
    actions?: Array<{
      type: string;
      details: string;
    }>;
  }>;
  pendingCheckIns: Array<{
    id: string;
    question: string;
    triggeredBy?: string;
  }>;
  stats: {
    totalMessages: number;
    totalCheckIns: number;
    actionsApplied: number;
  };
}

export class GetCoachHistoryUseCase
  implements UseCase<GetCoachHistoryRequest, GetCoachHistoryResponse>
{
  constructor(private conversationRepository: CoachConversationRepository) {}

  async execute(
    request: GetCoachHistoryRequest,
  ): Promise<Result<GetCoachHistoryResponse>> {
    const conversationResult = await this.conversationRepository.findByUserId(
      request.userId,
    );
    if (conversationResult.isFailure) {
      return Result.fail(new Error('No coaching history found'));
    }

    const conversation = conversationResult.value;
    const limit = request.limit || 50;
    const recentMessages = conversation.messages.slice(-limit);

    return Result.ok({
      messages: recentMessages.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: m.timestamp,
        actions: m.actions?.map((a) => ({
          type: a.type,
          details: a.details,
        })),
      })),
      pendingCheckIns: conversation.checkIns
        .filter((c) => c.status === 'pending')
        .map((c) => ({
          id: c.id,
          question: c.question,
          triggeredBy: c.triggeredBy,
        })),
      stats: {
        totalMessages: conversation.totalMessages,
        totalCheckIns: conversation.totalCheckIns,
        actionsApplied: this.countActionsApplied(conversation),
      },
    });
  }

  private countActionsApplied(conversation: CoachConversation): number {
    let count = 0;
    for (const message of conversation.messages) {
      if (message.actions) {
        count += message.actions.length;
      }
    }
    for (const checkIn of conversation.checkIns) {
      if (checkIn.actions) {
        count += checkIn.actions.length;
      }
    }
    return count;
  }
}
