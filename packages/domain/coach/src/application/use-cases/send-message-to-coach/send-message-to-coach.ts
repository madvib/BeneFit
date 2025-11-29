import { Result, UseCase, EventBus } from '@bene/domain-shared';
import { createCoachingConversation, CoachConversationCommands } from '@core/index.js';
import { CoachingConversationRepository } from '../../repositories/coaching-conversation-repository.js';
import { CoachingContextBuilder } from '../../services/coaching-context-builder.js';
import { AICoachService } from '../../services/ai-coach-service.js';

export interface SendMessageToCoachRequest {
  userId: string;
  message: string;
  checkInId?: string; // If responding to a check-in
}

export interface SendMessageToCoachResponse {
  conversationId: string;
  coachResponse: string;
  actions?: Array<{
    type: string;
    details: string;
  }>;
  suggestedFollowUps?: string[];
}

export class SendMessageToCoachUseCase
  implements UseCase<SendMessageToCoachRequest, SendMessageToCoachResponse>
{
  constructor(
    private conversationRepository: CoachingConversationRepository,
    private contextBuilder: CoachingContextBuilder,
    private aiCoach: AICoachService,
    private eventBus: EventBus,
  ) {}

  async execute(
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
        return Result.fail(new Error('Failed to build coaching context'));
      }

      const newConvResult = createCoachingConversation({
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
      return Result.fail(new Error(`Coach unavailable: ${error}`));
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
    await this.eventBus.publish({
      type: 'CoachMessageSent',
      userId: request.userId,
      conversationId: updatedConversation.id,
      actionsApplied: aiResponse.actions?.length || 0,
      timestamp: new Date(),
    });

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
          await this.eventBus.publish({
            type: 'CoachAdjustedPlan',
            userId,
            details: action.details,
            planChangeId: action.planChangeId,
            timestamp: new Date(),
          });
          break;

        case 'scheduled_followup':
          await this.eventBus.publish({
            type: 'CoachScheduledFollowup',
            userId,
            details: action.details,
            timestamp: new Date(),
          });
          break;

        // Other actions...
      }
    }
  }
}
