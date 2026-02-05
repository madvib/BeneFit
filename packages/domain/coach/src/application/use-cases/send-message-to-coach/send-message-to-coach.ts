import { z } from 'zod';
import { Result, type EventBus, BaseUseCase, mapZodError } from '@bene/shared';
import {
  CreateCoachConversationSchema,
  CoachConversationCommands,
  type CoachActionView,
  toCoachActionView
} from '@/core/index.js';
import { CoachConversationRepository } from '../../ports/coach-conversation-repository.js';
import { CoachContextBuilder, AICoachService } from '../../services/index.js';
import { CoachMessageSentEvent } from '../../events/coach-message-sent.event.js';
import { CoachAdjustedPlanEvent } from '../../events/coach-adjusted-plan.event.js';
import { CoachScheduledFollowupEvent } from '../../events/coach-scheduled-followup.event.js';

/**
 * Request schema
 */
export const SendMessageToCoachRequestSchema = z.object({
  userId: z.uuid(),
  message: z.string(),
  checkInId: z.uuid().optional(),
});

export type SendMessageToCoachRequest = z.infer<typeof SendMessageToCoachRequestSchema>;

/**
 * Response type - custom for message exchange
 */
export interface SendMessageToCoachResponse {
  conversationId: string;
  coachResponse: string;
  actions?: CoachActionView[];
  suggestedFollowUps?: string[];
}

export class SendMessageToCoachUseCase extends BaseUseCase<
  SendMessageToCoachRequest,
  SendMessageToCoachResponse
> {
  constructor(
    private conversationRepository: CoachConversationRepository,
    private contextBuilder: CoachContextBuilder,
    private aiCoach: AICoachService,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(
    request: SendMessageToCoachRequest,
  ): Promise<Result<SendMessageToCoachResponse>> {
    // 1. Get or create conversation
    let conversationResult = await this.conversationRepository.findByUserId(
      request.userId,
    );

    if (conversationResult.isFailure) {
      // Create new conversation
      const contextResult = await this.contextBuilder.buildContext(request.userId);
      if (contextResult.isFailure) {
        return Result.fail(
          new Error(`Failed to build coaching context: ${ contextResult.error }`),
        );
      }

      const parseResult = CreateCoachConversationSchema.safeParse({
        userId: request.userId,
        context: contextResult.value,
        initialMessage:
          "Hi! I'm your AI coach. I'm here to help you reach your fitness goals. What brings you here today?",
      });

      if (!parseResult.success) {
        return Result.fail(mapZodError(parseResult.error));
      }

      const newConversation = parseResult.data;
      await this.conversationRepository.save(newConversation);
      conversationResult = Result.ok(newConversation);
    }

    const conversation = conversationResult.value;

    // 2. Add user message
    const withUserMessageResult = CoachConversationCommands.addUserMessage(
      conversation,
      request.message,
      request.checkInId,
    );

    if (withUserMessageResult.isFailure) {
      return Result.fail(withUserMessageResult.error);
    }

    let updatedConversation = withUserMessageResult.value;

    // 3. Get AI coach response
    const aiResponseResult = await this.aiCoach.getResponse({
      conversation: updatedConversation,
      userMessage: request.message,
    });

    if (aiResponseResult.isFailure) {
      const error = aiResponseResult.error;
      return Result.fail(new Error(`Coach unavailable: ${ error }`));
    }

    const aiResponse = aiResponseResult.value;

    // 4. Add coach message with actions
    const withCoachMessageResult = CoachConversationCommands.addCoachMessage(
      updatedConversation,
      aiResponse.message,
      aiResponse.actions,
      request.checkInId,
      aiResponse.tokensUsed,
    );

    if (withCoachMessageResult.isFailure) {
      return Result.fail(withCoachMessageResult.error);
    }

    updatedConversation = withCoachMessageResult.value;

    // 5. Apply actions if any
    if (aiResponse.actions && aiResponse.actions.length > 0) {
      await this.applyCoachActions(request.userId, aiResponse.actions);
    }

    // 6. Save conversation
    await this.conversationRepository.save(updatedConversation);

    // 7. Emit event
    await this.eventBus.publish(
      new CoachMessageSentEvent({
        userId: request.userId,
        conversationId: updatedConversation.id,
        actionsApplied: aiResponse.actions?.length || 0,
      }),
    );

    return Result.ok({
      conversationId: updatedConversation.id,
      coachResponse: aiResponse.message,
      actions: aiResponse.actions?.map(toCoachActionView),
      suggestedFollowUps: aiResponse.suggestedFollowUps,
    });
  }

  private async applyCoachActions(
    userId: string,
    actions: Array<{ type: string; details: string; planChangeId?: string }>,
  ): Promise<void> {
    for (const action of actions) {
      // Emit events for actions that need to be handled
      switch (action.type) {
        case 'adjusted_plan':
          await this.eventBus.publish(
            new CoachAdjustedPlanEvent({
              userId,
              details: action.details,
              planChangeId: action.planChangeId,
              timestamp: new Date().toISOString(),
            }),
          );
          break;

        case 'scheduled_followup':
          await this.eventBus.publish(
            new CoachScheduledFollowupEvent({
              userId,
              details: action.details,
              timestamp: new Date().toISOString(),
            }),
          );
          break;

        // Other actions...
      }
    }
  }
}
