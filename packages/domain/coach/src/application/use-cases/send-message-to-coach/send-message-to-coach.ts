import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import { createCoachConversation, CoachConversationCommands } from '@core/index.js';
import { CoachConversationRepository } from '@app/ports/coach-conversation-repository.js';
import { CoachContextBuilder, AICoachService } from '@app/services/index.js';
import {
  CoachMessageSentEvent,
  CoachAdjustedPlanEvent,
  CoachScheduledFollowupEvent,
} from '@app/events/index.js';

// Single request schema with ALL fields
export const SendMessageToCoachRequestSchema = z.object({
  // Server context
  userId: z.string(),

  // Client data
  message: z.string(),
  checkInId: z.string().optional(),
});

// Zod inferred type with original name
export type SendMessageToCoachRequest = z.infer<typeof SendMessageToCoachRequestSchema>;

// Zod schema for response validation
const ActionSchema = z.object({
  type: z.string(),
  details: z.string(),
});

export const SendMessageToCoachResponseSchema = z.object({
  conversationId: z.string(),
  coachResponse: z.string(),
  actions: z.array(ActionSchema).optional(),
  suggestedFollowUps: z.array(z.string()).optional(),
});

// Zod inferred type with original name
export type SendMessageToCoachResponse = z.infer<
  typeof SendMessageToCoachResponseSchema
>;

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

      const newConvResult = createCoachConversation({
        userId: request.userId,
        context: contextResult.value,
        initialMessage:
          "Hi! I'm your AI coach. I'm here to help you reach your fitness goals. What brings you here today?",
      });

      if (newConvResult.isFailure) {
        return Result.fail(newConvResult.error);
      }

      await this.conversationRepository.save(newConvResult.value);
      conversationResult = Result.ok(newConvResult.value);
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
      actions: aiResponse.actions?.map((a) => ({
        type: a.type,
        details: a.details,
      })),
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
