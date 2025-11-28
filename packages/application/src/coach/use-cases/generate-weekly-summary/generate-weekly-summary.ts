import { Result } from '@bene/core/shared';
import { UseCase } from '../../shared/use-case';
import { CoachingContext } from '@bene/core/coach';
import { CoachingContextBuilder } from '../services/coaching-context-builder';
import { AICoachService } from '../services/ai-coach-service';
import { EventBus } from '../../shared/event-bus';

export interface GenerateWeeklySummaryRequest {
  userId: string;
}

export interface GenerateWeeklySummaryResponse {
  summary: string;
  highlights: string[];
  suggestions: string[];
}

export class GenerateWeeklySummaryUseCase
  implements UseCase<GenerateWeeklySummaryRequest, GenerateWeeklySummaryResponse>
{
  constructor(
    private contextBuilder: CoachingContextBuilder,
    private aiCoach: AICoachService,
    private eventBus: EventBus,
  ) {}

  async execute(
    request: GenerateWeeklySummaryRequest,
  ): Promise<Result<GenerateWeeklySummaryResponse>> {
    // 1. Build context for the week
    const contextResult = await this.contextBuilder.buildContext(request.userId);
    if (contextResult.isFailure) {
      const error = contextResult.error;
      return Result.fail(typeof error === 'string' ? error : (error as Error).message);
    }

    // 2. Generate summary with AI
    const summaryResult = await this.aiCoach.generateWeeklySummary({
      context: contextResult.value,
    });

    if (summaryResult.isFailure) {
      const error = summaryResult.error;
      return Result.fail(typeof error === 'string' ? error : (error as Error).message);
    }

    const summary = summaryResult.value;

    // 3. Emit event (for notification/email)
    await this.eventBus.publish({
      type: 'WeeklySummaryGenerated',
      userId: request.userId,
      summary: summary.summary,
      timestamp: new Date(),
    });

    return Result.ok(summary);
  }
}