import { Result, UseCase, EventBus } from '@bene/shared-domain';
import { AICoachService } from '../../services/ai-coach-service.js';
import { CoachingContextBuilder } from '../../services/coaching-context-builder.js';

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
      return Result.fail(contextResult.error);
    }

    // 2. Generate summary with AI
    const summaryResult = await this.aiCoach.generateWeeklySummary({
      context: contextResult.value,
    });

    if (summaryResult.isFailure) {
      return Result.fail(summaryResult.error);
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
