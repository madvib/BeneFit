import { Result, UseCase } from '@bene/domain-shared';
import {
  CoachConversationCommands,
  createCoachingConversation,
  createCheckIn,
  CheckInTrigger,
} from '@core/index.js';
import { CoachingConversationRepository } from '../../repositories/coaching-conversation-repository.js';
import { CoachingContextBuilder } from '../../services/coaching-context-builder.js';
import { AICoachService } from '../../services/ai-coach-service.js';
import { EventBus } from '@bene/domain-shared';

export interface TriggerProactiveCheckInRequest {
  userId: string;
}

export interface TriggerProactiveCheckInResponse {
  checkInId: string;
  question: string;
  triggeredBy: string;
}

export class TriggerProactiveCheckInUseCase
  implements UseCase<TriggerProactiveCheckInRequest, TriggerProactiveCheckInResponse>
{
  constructor(
    private conversationRepository: CoachingConversationRepository,
    private contextBuilder: CoachingContextBuilder,
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
      const newConvResult = createCoachingConversation({
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
    await this.eventBus.publish({
      type: 'ProactiveCheckInTriggered',
      userId: request.userId,
      checkInId: checkIn.id,
      trigger,
      timestamp: new Date(),
    });

    return Result.ok({
      checkInId: checkIn.id,
      question: checkIn.question,
      triggeredBy: trigger,
    });
  }

  private determineTrigger(context: {
    currentPlan?: { adherenceRate: number };
    reportedInjuries?: string[];
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
    const progress = (context.workoutsThisWeek || 0) / (context.plannedWorkoutsThisWeek || 1);
    if (context.daysIntoCurrentWeek && context.daysIntoCurrentWeek >= 4 && progress < 0.5) {
      return 'low_adherence';
    }

    return undefined;
  }
}
