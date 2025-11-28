import { Result, UseCase } from '@bene/core/shared';
import { CoachConversationCommands } from '@bene/core/coach';
import { EventBus } from '../../../shared/event-bus.js';
import { CoachingConversationRepository } from '../../repositories/coaching-conversation-repository.js';

export interface DismissCheckInRequest {
  userId: string;
  checkInId: string;
}

export interface DismissCheckInResponse {
  conversationId: string;
  dismissed: boolean;
}

export class DismissCheckInUseCase
  implements UseCase<DismissCheckInRequest, DismissCheckInResponse> {
  constructor(
    private conversationRepository: CoachingConversationRepository,
    private eventBus: EventBus,
  ) { }

  async execute(
    request: DismissCheckInRequest,
  ): Promise<Result<DismissCheckInResponse>> {
    const conversationResult = await this.conversationRepository.findByUserId(
      request.userId,
    );
    if (conversationResult.isFailure) {
      return Result.fail(new Error('Conversation not found'));
    }

    const dismissedResult = CoachConversationCommands.dismissCheckIn(
      conversationResult.value,
      request.checkInId,
    );
    if (dismissedResult.isFailure) {
      return Result.fail(dismissedResult.error);
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
