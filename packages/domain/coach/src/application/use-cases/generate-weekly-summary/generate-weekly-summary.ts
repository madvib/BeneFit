import { z } from 'zod';
import { Result, type EventBus, BaseUseCase } from '@bene/shared';
import { AICoachService, CoachContextBuilder } from '../../services/index.js';
import { WeeklySummaryGeneratedEvent } from '../../events/weekly-summary-generated.event.js';

/**
 * Request schema
 */
export const GenerateWeeklySummaryRequestSchema = z.object({
  userId: z.uuid(),
});

export type GenerateWeeklySummaryRequest = z.infer<
  typeof GenerateWeeklySummaryRequestSchema
>;

/**
 * Response type - custom for summary report
 */
// TODO this should be a value object eventually
export interface GenerateWeeklySummaryResponse {
  summary: string;
  highlights: string[];
  suggestions: string[];
}

export class GenerateWeeklySummaryUseCase extends BaseUseCase<
  GenerateWeeklySummaryRequest,
  GenerateWeeklySummaryResponse
> {
  constructor(
    private contextBuilder: CoachContextBuilder,
    private aiCoach: AICoachService,
    private eventBus: EventBus,
  ) {
    super();
  }

  protected async performExecution(
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
    await this.eventBus.publish(
      new WeeklySummaryGeneratedEvent({
        userId: request.userId,
        summary: summary.summary,
      }),
    );

    return Result.ok(summary);
  }
}
