import { z } from 'zod';
import { Result, type EventBus, BaseUseCase, mapZodError } from '@bene/shared';
import { Injury } from '@bene/training-core';
import {
  CoachConversationCommands,
  CreateCoachConversationSchema,
  CreateCheckInSchema,
  CheckInTrigger,
} from '../../../core/index.js';
import { CoachConversationRepository } from '../../ports/coach-conversation-repository.js';
import { CoachContextBuilder, AICoachService } from '../../services/index.js';
import { ProactiveCheckInTriggeredEvent } from '../../events/proactive-check-in-triggered.event.js';

/**
 * Request schema
 */
export const TriggerProactiveCheckInRequestSchema = z.object({
  userId: z.uuid(),
});

export type TriggerProactiveCheckInRequest = z.infer<
  typeof TriggerProactiveCheckInRequestSchema
>;

/**
 * Response type - outcome of proactive trigger
 */
export interface TriggerProactiveCheckInResponse {
  checkInId: string;
  question: string;
  triggeredBy: string;
}

export class TriggerProactiveCheckInUseCase extends BaseUseCase<
  TriggerProactiveCheckInRequest,
  TriggerProactiveCheckInResponse
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
      const parseResult = CreateCoachConversationSchema.safeParse({
        userId: request.userId,
        context,
      });

      if (!parseResult.success) {
        return Result.fail(mapZodError(parseResult.error));
      }

      const newConversation = parseResult.data;
      await this.conversationRepository.save(newConversation);
      conversationResult = Result.ok(newConversation);
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
    const checkInParseResult = CreateCheckInSchema.safeParse({
      type: 'proactive',
      question: questionResult.value,
      triggeredBy: trigger,
    });

    if (!checkInParseResult.success) {
      return Result.fail(mapZodError(checkInParseResult.error));
    }

    const checkIn = checkInParseResult.data;

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
