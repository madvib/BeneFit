import { z } from 'zod';
import { Result, BaseUseCase } from '@bene/shared';
import { CoachConversation } from '@core/index.js';
import { CoachConversationRepository } from '@app/ports/coach-conversation-repository.js';



// Zod schema for request validation
export const GetCoachHistoryRequestSchema = z.object({
  userId: z.string(),
  limit: z.number().optional(),
});

// Zod inferred type with original name
export type GetCoachHistoryRequest = z.infer<typeof GetCoachHistoryRequestSchema>;



// Response-only DTO schemas (not shared - specific to this use case)
const ActionSchema = z.object({
  type: z.string(),
  details: z.string(),
});

const MessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'coach', 'system']),
  content: z.string(),
  timestamp: z.date(),
  actions: z.array(ActionSchema).optional(),
});

const PendingCheckInSchema = z.object({
  id: z.string(),
  question: z.string(),
  triggeredBy: z.string().optional(),
});

const StatsSchema = z.object({
  totalMessages: z.number(),
  totalCheckIns: z.number(),
  actionsApplied: z.number(),
});

export const GetCoachHistoryResponseSchema = z.object({
  messages: z.array(MessageSchema),
  pendingCheckIns: z.array(PendingCheckInSchema),
  stats: StatsSchema,
});

// Zod inferred type with original name
export type GetCoachHistoryResponse = z.infer<typeof GetCoachHistoryResponseSchema>;

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
