import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import { CoachConversationCommands } from '../../../core/index.js';
import { CoachConversationRepository } from '../../ports/coach-conversation-repository.js';
import { CheckInDismissedEvent } from '../../events/check-in-dismissed.event.js';



// Client-facing schema (what comes in the request body)
/**
 * Request schema
 */
export const DismissCheckInRequestSchema = z.object({
  userId: z.uuid(),
  checkInId: z.uuid(),
});

export type DismissCheckInRequest = z.infer<typeof DismissCheckInRequestSchema>;

/**
 * Response type - custom for dismissal
 */
export interface DismissCheckInResponse {
  conversationId: string;
  dismissed: boolean;
}

export class DismissCheckInUseCase extends BaseUseCase<
  DismissCheckInRequest,
  DismissCheckInResponse
> {
  constructor(
    private conversationRepository: CoachConversationRepository,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(
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

    await this.eventBus.publish(
      new CheckInDismissedEvent({
        userId: request.userId,
        checkInId: request.checkInId,
      }),
    );

    return Result.ok({
      conversationId: dismissedResult.value.id,
      dismissed: true,
    });
  }
}
