import { z } from 'zod';
import { Result, type UseCase, type EventBus } from '@bene/shared-domain';
import { CoachConversationCommands } from '@core/index.js';
import { CoachConversationRepository } from '@app/ports/coach-conversation-repository.js';
import { AICoachService } from '@app/services/index.js';
import { CheckInRespondedEvent, CoachActionPerformedEvent } from '@app/events/index.js';

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use RespondToCheckInRequest type instead */
export interface RespondToCheckInRequest_Deprecated {
  userId: string;
  checkInId: string;
  response: string;
}

// Client-facing schema (what comes in the request body)
export const RespondToCheckInRequestClientSchema = z.object({
  checkInId: z.string(),
  response: z.string(),
});

export type RespondToCheckInRequestClient = z.infer<typeof RespondToCheckInRequestClientSchema>;

// Complete use case input schema (client data + server context)
export const RespondToCheckInRequestSchema = RespondToCheckInRequestClientSchema.extend({
  userId: z.string(),
});

// Zod inferred type with original name
export type RespondToCheckInRequest = z.infer<typeof RespondToCheckInRequestSchema>;

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use RespondToCheckInResponse type instead */
export interface RespondToCheckInResponse_Deprecated {
  conversationId: string;
  coachAnalysis: string;
  actions: Array<{
    type: string;
    details: string;
  }>;
}

// Zod schema for response validation
const ActionSchema = z.object({
  type: z.string(),
  details: z.string(),
});

export const RespondToCheckInResponseSchema = z.object({
  conversationId: z.string(),
  coachAnalysis: z.string(),
  actions: z.array(ActionSchema),
});

// Zod inferred type with original name
export type RespondToCheckInResponse = z.infer<typeof RespondToCheckInResponseSchema>;

export class RespondToCheckInUseCase implements UseCase<
  RespondToCheckInRequest,
  RespondToCheckInResponse
> {
  constructor(
    private conversationRepository: CoachConversationRepository,
    private aiCoach: AICoachService,
    private eventBus: EventBus,
  ) {}

  async execute(
    request: RespondToCheckInRequest,
  ): Promise<Result<RespondToCheckInResponse>> {
    // 1. Load conversation
    const conversationResult = await this.conversationRepository.findByUserId(
      request.userId,
    );
    if (conversationResult.isFailure) {
      return Result.fail(new Error('Conversation not found'));
    }
    let conversation = conversationResult.value;

    // 2. Find check-in
    const checkIn = conversation.checkIns.find((c) => c.id === request.checkInId);
    if (!checkIn) {
      return Result.fail(new Error('Check-in not found'));
    }

    if (checkIn.status !== 'pending') {
      return Result.fail(new Error('Check-in already responded to'));
    }

    // 3. Get AI analysis and actions
    const analysisResult = await this.aiCoach.analyzeCheckInResponse({
      checkIn,
      userResponse: request.response,
      context: conversation.context,
    });

    if (analysisResult.isFailure) {
      return Result.fail(analysisResult.error);
    }

    const { analysis, actions } = analysisResult.value;

    // 4. Update check-in
    const respondedConvResult = CoachConversationCommands.respondToCheckIn(
      conversation,
      request.checkInId,
      request.response,
      analysis,
      actions,
    );

    if (respondedConvResult.isFailure) {
      return Result.fail(respondedConvResult.error);
    }

    conversation = respondedConvResult.value;

    // 5. Apply actions
    for (const action of actions) {
      await this.applyAction(request.userId, action);
    }

    // 6. Save
    await this.conversationRepository.save(conversation);

    // 7. Emit event
    await this.eventBus.publish(
      new CheckInRespondedEvent({
        userId: request.userId,
        checkInId: request.checkInId,
        actionsApplied: actions.length,
      }),
    );

    return Result.ok({
      conversationId: conversation.id,
      coachAnalysis: analysis,
      actions: actions.map((a) => ({
        type: a.type,
        details: a.details,
      })),
    });
  }

  private async applyAction(
    userId: string,
    action: { type: string; details: string },
  ): Promise<void> {
    // Similar to SendMessageToCoachUseCase.applyCoachActions
    await this.eventBus.publish(
      new CoachActionPerformedEvent({
        userId,
        actionType: action.type,
        details: action.details,
        timestamp: new Date(),
      })
    );
  }
}
