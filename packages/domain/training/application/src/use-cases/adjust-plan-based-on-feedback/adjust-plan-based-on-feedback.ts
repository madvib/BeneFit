import { z } from 'zod';
import { Result, type UseCase, type EventBus } from '@bene/shared';
import { FitnessPlanRepository } from '../../repositories/fitness-plan-repository.js';
import { AIPlanGenerator, AdjustPlanInput } from '../../services/ai-plan-generator.js';
import { PlanAdjustedEvent } from '../../events/plan-adjusted.event.js';

// Zod schema for request validation
const RecentWorkoutSchema = z.object({
  perceivedExertion: z.number(),
  enjoyment: z.number(),
  difficultyRating: z.enum(['too_easy', 'just_right', 'too_hard']),
});

// Client-facing schema (what comes in the request body)
export const AdjustPlanBasedOnFeedbackRequestClientSchema = z.object({
  planId: z.string(),
  feedback: z.string(), // "Too hard", "Loving it", "Need more rest", etc.
  recentWorkouts: z.array(RecentWorkoutSchema),
});

export type AdjustPlanBasedOnFeedbackRequestClient = z.infer<
  typeof AdjustPlanBasedOnFeedbackRequestClientSchema
>;

// Complete use case input schema (client data + server context)
export const AdjustPlanBasedOnFeedbackRequestSchema =
  AdjustPlanBasedOnFeedbackRequestClientSchema.extend({
    userId: z.string(),
  });

// Zod inferred type with original name
export type AdjustPlanBasedOnFeedbackRequest = z.infer<
  typeof AdjustPlanBasedOnFeedbackRequestSchema
>;

// Zod schema for response validation
export const AdjustPlanBasedOnFeedbackResponseSchema = z.object({
  planId: z.string(),
  adjustmentsMade: z.array(z.string()),
  message: z.string(),
});

// Zod inferred type with original name
export type AdjustPlanBasedOnFeedbackResponse = z.infer<
  typeof AdjustPlanBasedOnFeedbackResponseSchema
>;

export class AdjustPlanBasedOnFeedbackUseCase implements UseCase<
  AdjustPlanBasedOnFeedbackRequest,
  AdjustPlanBasedOnFeedbackResponse
> {
  constructor(
    private planRepository: FitnessPlanRepository,
    private aiGenerator: AIPlanGenerator,
    private eventBus: EventBus,
  ) {}

  async execute(
    request: AdjustPlanBasedOnFeedbackRequest,
  ): Promise<Result<AdjustPlanBasedOnFeedbackResponse>> {
    // 1. Load plan
    const planResult = await this.planRepository.findById(request.planId);
    if (planResult.isFailure) {
      return Result.fail(new Error('Plan not found'));
    }
    const plan = planResult.value;

    // 2. Verify ownership
    if (plan.userId !== request.userId) {
      return Result.fail(new Error('Not authorized'));
    }

    // 3. Call AI to adjust future weeks
    const adjustInput: AdjustPlanInput = {
      currentPlan: plan,
      feedback: request.feedback,
      recentPerformance: request.recentWorkouts,
    };

    const adjustedPlanResult = await this.aiGenerator.adjustPlan(adjustInput);

    if (adjustedPlanResult.isFailure) {
      return Result.fail(
        new Error(`Failed to adjust plan: ${adjustedPlanResult.error}`),
      );
    }

    const adjustedPlan = adjustedPlanResult.value;

    // 4. Save adjusted plan
    await this.planRepository.save(adjustedPlan);

    // 5. Emit event
    await this.eventBus.publish(
      new PlanAdjustedEvent({
        userId: request.userId,
        planId: plan.id,
        feedback: request.feedback,
      }),
    );

    // 6. Return adjustments summary
    return Result.ok({
      planId: adjustedPlan.id,
      adjustmentsMade: [
        'Reduced volume by 10%',
        'Added extra rest day',
        'Modified progression strategy',
      ], // Would come from AI response
      message: 'Your plan has been adjusted based on your feedback',
    });
  }
}

// Deprecated original interface - preserve for potential rollback
/** @deprecated Use AdjustPlanBasedOnFeedbackRequest type instead */
export interface AdjustPlanBasedOnFeedbackRequest_Deprecated {
  userId: string;
  planId: string;
  feedback: string; // "Too hard", "Loving it", "Need more rest", etc.
  recentWorkouts: Array<{
    perceivedExertion: number;
    enjoyment: number;
    difficultyRating: 'too_easy' | 'just_right' | 'too_hard';
  }>;
}
// Deprecated original interface - preserve for potential rollback
/** @deprecated Use AdjustPlanBasedOnFeedbackResponse type instead */
export interface AdjustPlanBasedOnFeedbackResponse_Deprecated {
  planId: string;
  adjustmentsMade: string[];
  message: string;
}
