import { Result } from '@bene/core/shared';
import { UseCase } from '../../shared/use-case';
import { CoachingConversation } from '@bene/core/coach';
import { CoachingConversationRepository } from '../repositories/coaching-conversation-repository';

export interface GetCoachingHistoryRequest {
  userId: string;
  limit?: number;
}

export interface GetCoachingHistoryResponse {
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

export class GetCoachingHistoryUseCase
  implements UseCase<GetCoachingHistoryRequest, GetCoachingHistoryResponse>
{
  constructor(private conversationRepository: CoachingConversationRepository) {}

  async execute(
    request: GetCoachingHistoryRequest,
  ): Promise<Result<GetCoachingHistoryResponse>> {
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

  private countActionsApplied(conversation: CoachingConversation): number {
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