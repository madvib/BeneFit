import { z } from 'zod';
import { Result, type UseCase, type EventBus } from '@bene/shared';
import { CoachConversationCommands } from '@core/index.js';
import { CoachConversationRepository } from '@app/ports/coach-conversation-repository.js';
import { CheckInDismissedEvent } from '@app/events/check-in-dismissed.event.js';

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use DismissCheckInRequest type instead */
export interface DismissCheckInRequest_Deprecated {
  userId: string;
  checkInId: string;
}

// Client-facing schema (what comes in the request body)
export const DismissCheckInRequestClientSchema = z.object({
  checkInId: z.string(),
});

export type DismissCheckInRequestClient = z.infer<
  typeof DismissCheckInRequestClientSchema
>;

// Complete use case input schema (client data + server context)
export const DismissCheckInRequestSchema = DismissCheckInRequestClientSchema.extend({
  userId: z.string(),
});

// Zod inferred type with original name
export type DismissCheckInRequest = z.infer<typeof DismissCheckInRequestSchema>;

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use DismissCheckInResponse type instead */
export interface DismissCheckInResponse_Deprecated {
  conversationId: string;
  dismissed: boolean;
}

// Zod schema for response validation
export const DismissCheckInResponseSchema = z.object({
  conversationId: z.string(),
  dismissed: z.boolean(),
});

// Zod inferred type with original name
export type DismissCheckInResponse = z.infer<typeof DismissCheckInResponseSchema>;

export class DismissCheckInUseCase implements UseCase<
  DismissCheckInRequest,
  DismissCheckInResponse
> {
  constructor(
    private conversationRepository: CoachConversationRepository,
    private eventBus: EventBus,
  ) {}

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
