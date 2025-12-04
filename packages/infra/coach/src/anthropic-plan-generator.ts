import { Result } from '@bene/domain';
import type { PlanTemplate, WorkoutPlan } from '@bene/domain/planning';
import type { UserProfile } from '@bene/domain/profile';

export interface AnthropicPlanGeneratorRequest {
  model?: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  max_tokens?: number;
  temperature?: number;
}

export interface AnthropicPlanGeneratorResponse {
  content: Array<{ type: 'text'; text: string }>;
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class AnthropicPlanGenerator {
  private readonly baseUrl = 'https://api.anthropic.com/v1/messages';
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generatePlan(
    userProfile: UserProfile,
    planTemplate: PlanTemplate
  ): Promise<Result<WorkoutPlan>> {
    try {
      const request: AnthropicPlanGeneratorRequest = {
        model: 'claude-3-sonnet-20240229',
        messages: this.buildPlanGenerationMessages(userProfile, planTemplate),
        max_tokens: 4096,
        temperature: 0.7,
      };

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Anthropic API error:', error);
        return Result.fail(`Failed to generate plan: ${response.status} ${error}`);
      }

      const data: AnthropicPlanGeneratorResponse = await response.json();

      if (!data.content || data.content.length === 0) {
        return Result.fail('AI returned empty response');
      }

      // Parse the generated plan structure from the AI response
      const planStructure = this.parsePlanStructure(data.content[0].text);

      const workoutPlan: WorkoutPlan = {
        id: `plan_${Date.now()}`, // In a real system, this would use a proper ID
        userId: userProfile.userId,
        name: planTemplate.name,
        status: 'draft', // Start as draft, user can activate later
        templateId: planTemplate.id,
        createdAt: new Date(),
        startedAt: undefined,
        completedAt: undefined,
        abandonedAt: undefined,
        totalWeeks: planStructure.totalWeeks || 8,
        currentWeek: 1,
        completedWorkouts: 0,
        totalScheduledWorkouts: planStructure.totalWorkouts || 24,
        structure: planStructure, // This would be the actual plan structure
      };

      return Result.ok(workoutPlan);
    } catch (error) {
      console.error('Error generating plan with Anthropic API:', error);
      return Result.fail(`Error generating plan: ${error}`);
    }
  }

  private buildPlanGenerationMessages(
    userProfile: UserProfile,
    planTemplate: PlanTemplate
  ): Array<{ role: 'user' | 'assistant'; content: string }> {
    const systemPrompt = this.buildSystemPrompt(userProfile, planTemplate);

    return [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: `Generate a personalized workout plan based on this template and user profile. Return only the plan structure in JSON format with the following schema: { totalWeeks: number, totalWorkouts: number, weeklySchedule: { week: number, workouts: { day: number, workoutType: string, description: string, duration: number, intensity: 'low' | 'moderate' | 'high' }[] }[], progression: { weeks: { week: number, focus: string, changes: string }[] } }. Ensure the plan accommodates the user's experience level and goals.`,
      },
    ];
  }

  private buildSystemPrompt(userProfile: UserProfile, planTemplate: PlanTemplate): string {
    let prompt = `You are an expert fitness plan generator. Create a personalized workout plan based on the user profile and template provided.\n\n`;

    // User profile context
    prompt += `USER PROFILE:\n`;
    prompt += `- Experience level: ${userProfile.experienceProfile?.level || 'Beginner'}\n`;
    prompt += `- Goals: ${JSON.stringify(userProfile.fitnessGoals || {})}\n`;
    prompt += `- Constraints: ${JSON.stringify(userProfile.trainingConstraints || {})}\n`;
    prompt += `- Preferences: ${JSON.stringify(userProfile.preferences || {})}\n\n`;

    // Template context
    prompt += `PLAN TEMPLATE:\n`;
    prompt += `- Name: ${planTemplate.name}\n`;
    prompt += `- Description: ${planTemplate.description}\n`;
    prompt += `- Structure framework: ${JSON.stringify(planTemplate.structure || {})}\n\n`;

    prompt += `Generate a detailed workout plan that:\n`;
    prompt += `1. Matches the template framework but personalizes to the user's level\n`;
    prompt += `2. Progresses appropriately over time\n`;
    prompt += `3. Respects any constraints mentioned\n`;
    prompt += `4. Includes variety to maintain engagement\n`;
    prompt += `5. Uses the fitness template as a foundation but adapts to the user\n\n`;

    prompt += `Return only the plan structure in the specified JSON format. Do not include any other text.`;

    return prompt;
  }

  private parsePlanStructure(aiResponse: string): any { // In a real implementation, this would have a proper type
    try {
      // Try to extract JSON from the response if it's wrapped in markdown
      const jsonMatch = aiResponse.match(/```json\n([\s\S]*?)\n```|```([\s\S]*?)```/);
      const jsonText = jsonMatch ? (jsonMatch[1] || jsonMatch[2]) : aiResponse;
      
      return JSON.parse(jsonText);
    } catch (error) {
      console.warn('Could not parse AI response as JSON, attempting to clean and parse again:', error);
      
      // Try to clean the response and find JSON within it
      const jsonStart = aiResponse.indexOf('{');
      const jsonEnd = aiResponse.lastIndexOf('}') + 1;
      if (jsonStart !== -1 && jsonEnd !== 0) {
        const jsonText = aiResponse.substring(jsonStart, jsonEnd);
        try {
          return JSON.parse(jsonText);
        } catch (e) {
          console.error('Failed to parse plan structure after cleaning:', e);
        }
      }
    }

    // Return a default structure if parsing fails
    return {
      totalWeeks: 8,
      totalWorkouts: 24,
      weeklySchedule: [],
      progression: { weeks: [] },
    };
  }
}