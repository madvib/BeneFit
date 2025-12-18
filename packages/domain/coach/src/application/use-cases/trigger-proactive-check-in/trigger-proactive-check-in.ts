import { z } from 'zod';
import { Result, type UseCase, type EventBus } from '@bene/shared-domain';
import { Injury } from '@bene/training-core';
import {
  CoachConversationCommands,
  createCoachConversation,
  createCheckIn,
  CheckInTrigger,
} from '@core/index.js';
import { CoachConversationRepository } from '@app/ports/coach-conversation-repository.js';
import { CoachContextBuilder, AICoachService } from '@app/services/index.js';
import { ProactiveCheckInTriggeredEvent } from '@app/events/proactive-check-in-triggered.event.js';

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use TriggerProactiveCheckInRequest type instead */
export interface TriggerProactiveCheckInRequest_Deprecated {
  userId: string;
}

// Zod schema for request validation
export const TriggerProactiveCheckInRequestSchema = z.object({
  userId: z.string(),
});

// Zod inferred type with original name
export type TriggerProactiveCheckInRequest = z.infer<
  typeof TriggerProactiveCheckInRequestSchema
>;

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use TriggerProactiveCheckInResponse type instead */
export interface TriggerProactiveCheckInResponse_Deprecated {
  checkInId: string;
  question: string;
  triggeredBy: string;
}

// Zod schema for response validation
export const TriggerProactiveCheckInResponseSchema = z.object({
  checkInId: z.string(),
  question: z.string(),
  triggeredBy: z.string(),
});

// Zod inferred type with original name
export type TriggerProactiveCheckInResponse = z.infer<
  typeof TriggerProactiveCheckInResponseSchema
>;

export class TriggerProactiveCheckInUseCase implements UseCase<
  TriggerProactiveCheckInRequest,
  TriggerProactiveCheckInResponse
> {
  constructor(
    private conversationRepository: CoachConversationRepository,
    private contextBuilder: CoachContextBuilder,
    private aiCoach: AICoachService,
    private eventBus: EventBus,
  ) {}

  async execute(
    request: TriggerProactiveCheckInRequest,
  ): Promise<Result<TriggerProactiveCheckInResponse>> {
    // 1. Build current context
    const contextResult = await this.contextBuilder.buildContext(request.userId);
    if (contextResult.isFailure) {
      return Result.fail(contextResult.error);
    }
    const context = contextResult.value;

    // 2. Get or create conversation
    let conversationResult = await this.conversationRepository.findByUserId(
      request.userId,
    );

    if (conversationResult.isFailure) {
      const newConvResult = createCoachConversation({
        userId: request.userId,
        context,
      });

      if (newConvResult.isFailure) {
        return Result.fail(newConvResult.error);
      }

      await this.conversationRepository.save(newConvResult.value);
      conversationResult = Result.ok(newConvResult.value);
    }

    let conversation = conversationResult.value;

    // 3. Determine trigger reason
    const trigger = this.determineTrigger(context);
    if (!trigger) {
      return Result.fail(new Error('No check-in needed at this time'));
    }

    // 4. Generate check-in question using AI
    const questionResult = await this.aiCoach.generateCheckInQuestion({
      context,
      trigger,
    });

    if (questionResult.isFailure) {
      return Result.fail(questionResult.error);
    }

    // 5. Create check-in - This is a factory function
    const checkInResult = createCheckIn({
      type: 'proactive',
      question: questionResult.value,
      triggeredBy: trigger,
    });

    if (checkInResult.isFailure) {
      return Result.fail(checkInResult.error);
    }

    const checkIn = checkInResult.value;

    // 6. Add to conversation
    const updatedConvResult = CoachConversationCommands.scheduleCheckIn(
      conversation,
      checkIn,
    );
    if (updatedConvResult.isFailure) {
      return Result.fail(updatedConvResult.error);
    }

    conversation = updatedConvResult.value;

    // 7. Save
    await this.conversationRepository.save(conversation);

    // 8. Emit event (for notification)
    await this.eventBus.publish(
      new ProactiveCheckInTriggeredEvent({
        userId: request.userId,
        checkInId: checkIn.id,
        trigger,
      }),
    );

    return Result.ok({
      checkInId: checkIn.id,
      question: checkIn.question,
      triggeredBy: trigger,
    });
  }

  private determineTrigger(context: {
    currentPlan?: { adherenceRate: number };
    reportedInjuries?: Injury[];
    trends?: { enjoymentTrend?: string };
    recentWorkouts?: Array<{ perceivedExertion: number }>;
    workoutsThisWeek?: number;
    plannedWorkoutsThisWeek?: number;
    daysIntoCurrentWeek?: number;
  }): CheckInTrigger | undefined {
    // Low adherence
    if (context.currentPlan && context.currentPlan.adherenceRate < 0.5) {
      return 'low_adherence';
    }

    // Reported injuries
    if (context.reportedInjuries && context.reportedInjuries.length > 0) {
      return 'injury_reported';
    }

    // Declining enjoyment
    if (context.trends?.enjoymentTrend === 'declining') {
      return 'enjoyment_declining';
    }

    // High exertion pattern
    const recentHighExertion = context.recentWorkouts
      ?.slice(-3)
      .filter((w) => w.perceivedExertion >= 9);
    if (recentHighExertion && recentHighExertion.length >= 2) {
      return 'high_exertion';
    }

    // Behind on workouts
    const progress =
      (context.workoutsThisWeek || 0) / (context.plannedWorkoutsThisWeek || 1);
    if (
      context.daysIntoCurrentWeek &&
      context.daysIntoCurrentWeek >= 4 &&
      progress < 0.5
    ) {
      return 'low_adherence';
    }

    return undefined;
  }
}
