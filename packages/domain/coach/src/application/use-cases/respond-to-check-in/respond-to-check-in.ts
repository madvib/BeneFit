import { Result, UseCase } from '@bene/shared-domain';
import { CoachConversationCommands } from '@core/index.js';
import { CoachConversationRepository } from '../../repositories/coach-conversation-repository.js';
import { AICoachService } from '../../services/ai-coach-service.js';
import { EventBus } from '@bene/shared-domain';

export interface RespondToCheckInRequest {
  userId: string;
  checkInId: string;
  response: string;
}

export interface RespondToCheckInResponse {
  conversationId: string;
  coachAnalysis: string;
  actions: Array<{
    type: string;
    details: string;
  }>;
}

export class RespondToCheckInUseCase
  implements UseCase<RespondToCheckInRequest, RespondToCheckInResponse>
{
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
    await this.eventBus.publish({
      type: 'CheckInResponded',
      userId: request.userId,
      checkInId: request.checkInId,
      actionsApplied: actions.length,
      timestamp: new Date(),
    });

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
    await this.eventBus.publish({
      type: `Coach${action.type.charAt(0).toUpperCase() + action.type.slice(1)}`,
      userId,
      details: action.details,
      timestamp: new Date(),
    });
  }
}
