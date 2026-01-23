import { AIError, ParseError, Result, parseJsonResponse } from '@bene/shared';
import type { FitnessPlan, PlanGoals, TrainingConstraints } from '@bene/training-core';
import {
  CreateDraftFitnessPlanSchema,
  CreateWeeklyScheduleSchema,
  type WorkoutTemplate,
} from '@bene/training-core';
import type { AICompletionRequest, AIProvider } from '@bene/shared';
import { PromptBuilder } from './prompt-builder.js';
import { randomUUID } from 'crypto';

export interface GeneratePlanInput {
  userId: string;
  goals: PlanGoals;
  constraints: TrainingConstraints;
  experienceLevel: string;
  customInstructions?: string;
}

export interface AdjustPlanInput {
  currentPlan: FitnessPlan;
  feedback: string;
  recentPerformance: Array<{
    perceivedExertion: number;
    enjoyment: number;
    difficultyRating: string;
  }>;
}
/**
 * Anthropic implementation of the AIPlanGenerator interface
 * Uses the provider abstraction to support multiple AI models
 */
export class AIPlanGenerator {
  constructor(private provider: AIProvider) { }

  async generatePlan(input: GeneratePlanInput): Promise<Result<FitnessPlan>> {
    try {
      const request: AICompletionRequest = {
        messages: [
          {
            role: 'system',
            content: this.buildPlanGenerationSystemPrompt(),
          },
          {
            role: 'user',
            content: this.buildPlanRequest(input),
          },
        ],
        maxTokens: 4096,
        temperature: 0.7,
      };

      const response = await this.provider.complete(request);

      if (response.isFailure) {
        return Result.fail(new AIError(`Failed to generate plan: ${ response.error }`));
      }

      // Parse the AI response as JSON
      const planDataResult = parseJsonResponse<any>(response.value.content);
      if (planDataResult.isFailure) {
        return Result.fail(
          new ParseError(`Failed to parse plan data: ${ planDataResult.error }`),
        );
      }

      // Convert AI-generated plan data to domain FitnessPlan
      const planData = planDataResult.value;
      const tempPlanId = randomUUID(); // Generate plan ID first for weekly schedules

      // Map weeks using the createWeeklySchedule factory
      const weeksResults = (planData.weeks || []).map((week: any, index: number) => {
        const weekStart = new Date(); // Start date calculation simplified for draft
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);

        const workouts: WorkoutTemplate[] = (week.workouts || []).map((workout: any) => {
          const scheduledDate = new Date(weekStart);
          scheduledDate.setDate(scheduledDate.getDate() + (workout.dayOfWeek || 0));

          return {
            id: randomUUID(),
            planId: tempPlanId,
            weekNumber: week.weekNumber,
            dayOfWeek: workout.dayOfWeek || 0,
            scheduledDate,
            title: workout.type || 'Workout',
            type: workout.type || 'custom',
            category: (['cardio', 'strength', 'recovery'].includes(workout.type))
              ? workout.type
              : 'strength',
            status: 'scheduled',
            importance: 'recommended',
            goals: {
              completionCriteria: {
                mustComplete: true,
                autoVerifiable: false,
              },
            },
            activities: (workout.activities || []).map((activity: any, idx: number) => ({
              id: randomUUID(),
              name: activity.activityType || 'Activity',
              type: activity.activityType || 'main',
              order: idx,
              instructions: Array.isArray(activity.instructions) ? activity.instructions : [activity.instructions],
              duration: 30, // Default or parse from activity
              structure: activity.structure,
            })),
          };
        });

        const scheduleResult = CreateWeeklyScheduleSchema.safeParse({
          weekNumber: week.weekNumber,
          planId: tempPlanId,
          startDate: weekStart,
          endDate: weekEnd,
          focus: `Week ${ week.weekNumber }`,
          targetWorkouts: workouts.length,
          workouts,
        });

        if (!scheduleResult.success) {
          return Result.fail(new Error(`Failed to create weekly schedule: ${ scheduleResult.error.message }`));
        }

        return Result.ok(scheduleResult.data);
      });

      // Check for any factory failures
      const failedWeek = weeksResults.find((result: Result<any>) => result.isFailure);
      if (failedWeek) {
        return Result.fail(new Error(`Failed to create weekly schedule: ${ failedWeek.error }`));
      }

      const weeks = weeksResults.map((result: Result<any>) => result.value);

      const planParseResult = CreateDraftFitnessPlanSchema.safeParse({
        userId: input.userId,
        title: planData.name,
        description: `Custom generated plan for ${ input.goals.primary }`,
        planType: 'habit_building',
        goals: input.goals,
        progression: { type: 'adaptive' },
        constraints: input.constraints,
        startDate: new Date(),
        weeks,
      });

      if (!planParseResult.success) {
        return Result.fail(new Error(`Failed to create domain plan: ${ planParseResult.error.message }`));
      }

      return Result.ok(planParseResult.data);
    } catch (error) {
      console.error('Error generating plan:', error);
      return Result.fail(
        new AIError(
          `Error generating plan: ${ error instanceof Error ? error.message : String(error) }`,
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  async adjustPlan(input: AdjustPlanInput): Promise<Result<FitnessPlan>> {
    try {
      const request: AICompletionRequest = {
        messages: [
          {
            role: 'system',
            content: this.buildPlanAdjustmentPrompt(),
          },
          {
            role: 'user',
            content: this.buildAdjustmentRequest(input),
          },
        ],
        maxTokens: 2048,
        temperature: 0.7,
      };

      const response = await this.provider.complete(request);

      if (response.isFailure) {
        return Result.fail(new AIError(`Failed to adjust plan: ${ response.error }`));
      }

      // Parse the adjustment suggestions
      const adjustmentsResult = parseJsonResponse<any>(response.value.content);
      if (adjustmentsResult.isFailure) {
        return Result.fail(
          new ParseError(`Failed to parse adjustments: ${ adjustmentsResult.error }`),
        );
      }

      // Apply adjustments to the plan
      const adjustedPlan = this.applyAdjustments(
        input.currentPlan,
        adjustmentsResult.value,
      );

      return Result.ok(adjustedPlan);
    } catch (error) {
      console.error('Error adjusting plan:', error);
      return Result.fail(
        new AIError(
          `Error adjusting plan: ${ error instanceof Error ? error.message : String(error) }`,
          error instanceof Error ? error : undefined,
        ),
      );
    }
  }

  private buildPlanGenerationSystemPrompt(): string {
    return PromptBuilder.buildPlanGenerationSystemPrompt();
  }

  private buildPlanAdjustmentPrompt(): string {
    return `You are adjusting a workout plan based on user feedback and performance.

Consider:
- Recent performance trends
- User feedback
- Fatigue indicators
- Progression rate

Suggest specific adjustments:
- Reduce/increase volume
- Modify exercises
- Add rest days
- Adjust intensity

Output JSON with adjustments to apply.`;
  }

  private buildPlanRequest(input: GeneratePlanInput): string {
    return `Create a workout plan for:

Goal: ${ input.goals.primary }
Experience: ${ input.experienceLevel }
Available days: ${ input.constraints.availableDays.join(', ') }
Equipment: ${ input.constraints.availableEquipment.join(', ') }
Location: ${ input.constraints.location }
Max duration: ${ input.constraints.maxDuration } minutes
Injuries: ${ input.constraints.injuries?.join(', ') || 'None' }

${ input.customInstructions ? `Additional instructions: ${ input.customInstructions }` : '' }

Generate a comprehensive plan in JSON format with this structure:
{
  "name": "Plan name",
  "durationWeeks": 8,
  "workoutsPerWeek": 4,
  "progressionStrategy": "linear|undulating|adaptive",
  "weeks": [
    {
      "weekNumber": 1,
      "workouts": [
        {
          "dayOfWeek": 0-6,
          "type": "Upper Body|Lower Body|Full Body|Cardio|etc",
          "estimatedDurationMinutes": 45,
          "activities": [
            {
              "activityType": "warmup|main|cooldown",
              "instructions": "Detailed instructions",
              "structure": {
                "type": "exercises",
                "exercises": [
                  {
                    "name": "Exercise name",
                    "sets": 3,
                    "reps": "10-12",
                    "rest": 60
                  }
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}`;
  }

  private buildAdjustmentRequest(input: AdjustPlanInput): string {
    const avgExertion =
      input.recentPerformance.reduce((sum, p) => sum + p.perceivedExertion, 0) /
      input.recentPerformance.length;

    const avgEnjoyment =
      input.recentPerformance.reduce((sum, p) => sum + p.enjoyment, 0) /
      input.recentPerformance.length;

    return `Adjust this plan:

Current plan: ${ input.currentPlan.title }
Week ${ input.currentPlan.currentPosition.week } of ${ input.currentPlan.weeks.length }

Feedback: "${ input.feedback }"
Avg exertion: ${ avgExertion.toFixed(1) }/10
Avg enjoyment: ${ avgEnjoyment.toFixed(1) }/5

Recent difficulties:
${ input.recentPerformance.map((p, i) => `Workout ${ i + 1 }: ${ p.difficultyRating }`).join('\n') }

Suggest specific adjustments to future weeks.`;
  }

  private applyAdjustments(plan: FitnessPlan, adjustments: any): FitnessPlan {
    // Apply AI-suggested adjustments to the plan
    // This would use domain commands like adjustFutureWeeks
    // For now, return the plan as-is (would be implemented with actual domain logic)
    return plan;
  }
}
