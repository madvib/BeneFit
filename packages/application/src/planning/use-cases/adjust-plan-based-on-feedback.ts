import { Result } from '@bene/core/shared';
import { UseCase } from '../../shared/use-case';
import { WorkoutPlan } from '@bene/core/plans';
import { WorkoutPlanRepository } from '../repositories/workout-plan-repository';
import { AIPlanGenerator, AdjustPlanInput } from '../services/ai-plan-generator';
import { EventBus } from '../../shared/event-bus';

export interface AdjustPlanRequest {
  userId: string;
  planId: string;
  feedback: string; // "Too hard", "Loving it", "Need more rest", etc.
  recentWorkouts: Array<{
    perceivedExertion: number;
    enjoyment: number;
    difficultyRating: 'too_easy' | 'just_right' | 'too_hard';
  }>;
}

export interface AdjustPlanResponse {
  planId: string;
  adjustmentsMade: string[];
  message: string;
}

export class AdjustPlanBasedOnFeedbackUseCase
  implements UseCase<AdjustPlanRequest, AdjustPlanResponse>
{
  constructor(
    private planRepository: WorkoutPlanRepository,
    private aiGenerator: AIPlanGenerator,
    private eventBus: EventBus,
  ) {}

  async execute(request: AdjustPlanRequest): Promise<Result<AdjustPlanResponse>> {
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
      return Result.fail(new Error(`Failed to adjust plan: ${adjustedPlanResult.error}`));
    }

    const adjustedPlan = adjustedPlanResult.value;

    // 4. Save adjusted plan
    await this.planRepository.save(adjustedPlan);

    // 5. Emit event
    await this.eventBus.publish({
      type: 'PlanAdjusted',
      userId: request.userId,
      planId: plan.id,
      feedback: request.feedback,
      timestamp: new Date(),
    });

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