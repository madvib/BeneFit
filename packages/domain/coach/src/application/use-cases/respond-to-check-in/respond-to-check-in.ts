
import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import {
  toCoachActionView,
  type CoachActionView,
  CoachConversationCommands
} from '@/core/index.js';
import { CoachConversationRepository } from '../../ports/coach-conversation-repository.js';
import { AICoachService } from '../../services/index.js';
import { CheckInRespondedEvent } from '../../events/check-in-responded.event.js';
import { CoachActionPerformedEvent } from '../../events/coach-action-performed.event.js';

/**
 * Request schema
 */
export const RespondToCheckInRequestSchema = z.object({
  userId: z.uuid(),
  checkInId: z.uuid(),
  response: z.string(),
});

export type RespondToCheckInRequest = z.infer<typeof RespondToCheckInRequestSchema>;

/**
 * Response type - custom for check-in response
 */
export interface RespondToCheckInResponse {
  conversationId: string;
  coachAnalysis: string;
  actions: CoachActionView[];
}

export class RespondToCheckInUseCase extends BaseUseCase<
  RespondToCheckInRequest,
  RespondToCheckInResponse
> {
  constructor(
    private conversationRepository: CoachConversationRepository,
    private aiCoach: AICoachService,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(
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
      actions: actions.map(toCoachActionView),
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
        timestamp: new Date().toISOString(),
      }),
    );
  }
}
