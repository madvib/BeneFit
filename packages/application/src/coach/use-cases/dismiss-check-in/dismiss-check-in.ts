import { Result } from '@bene/core/shared';
import { UseCase } from '../../shared/use-case';
import { CoachingConversation, CoachConversationCommands } from '@bene/core/coach';
import { CoachingConversationRepository } from '../repositories/coaching-conversation-repository';
import { EventBus } from '../../shared/event-bus';

export interface DismissCheckInRequest {
  userId: string;
  checkInId: string;
}

export interface DismissCheckInResponse {
  conversationId: string;
  dismissed: boolean;
}

export class DismissCheckInUseCase
  implements UseCase<DismissCheckInRequest, DismissCheckInResponse>
{
  constructor(
    private conversationRepository: CoachingConversationRepository,
    private eventBus: EventBus,
  ) {}

  async execute(
    request: DismissCheckInRequest,
  ): Promise<Result<DismissCheckInResponse>> {
    const conversationResult = await this.conversationRepository.findByUserId(
      request.userId,
    );
    if (conversationResult.isFailure) {
      return Result.fail('Conversation not found');
    }

    const dismissedResult = CoachConversationCommands.dismissCheckIn(conversationResult.value, request.checkInId);
    if (dismissedResult.isFailure) {
      const error = dismissedResult.error;
      return Result.fail(typeof error === 'string' ? error : (error as Error).message);
    }

    await this.conversationRepository.save(dismissedResult.value);

    await this.eventBus.publish({
      type: 'CheckInDismissed',
      userId: request.userId,
      checkInId: request.checkInId,
      timestamp: new Date(),
    });

    return Result.ok({
      conversationId: dismissedResult.value.id,
      dismissed: true,
    });
  }
}