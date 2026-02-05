import { AICompletionRequest, AIError, AIProvider, Result } from '@bene/shared';
import { PromptBuilder } from '@bene/training-application';

import {
  CheckIn,
  CoachAction,
  CoachContext,
  CoachConversation,
  CoachErrors,
} from '../../core/index.js';

export interface AICoachResponse {
  message: string;
  actions?: CoachAction[];
  suggestedFollowUps?: string[];
  tokensUsed?: number;
}

export class AICoachService {
  constructor(private provider: AIProvider) {}

  async getResponse(input: {
    conversation: CoachConversation;
    userMessage: string;
  }): Promise<Result<AICoachResponse>> {
    try {
      const request: AICompletionRequest = {
        messages: this.buildMessages(input.conversation, input.userMessage),
        maxTokens: 1024,
        temperature: 0.7,
      };

      const response = await this.provider.complete(request);

      if (response.isFailure) {
        return Result.fail(new AIError(`Failed to get AI response: ${response.error}`));
      }

      const aiResponse: AICoachResponse = {
        message: response.value.content,
        tokensUsed:
          response.value.usage.inputTokens + response.value.usage.outputTokens,
      };

      return Result.ok(aiResponse);
    } catch (error) {
      console.error('Error calling AI coach service:', error);
      const errorMessage = `Error calling AI coach service: ${error instanceof Error ? error.message : String(error)}`;
      return Result.fail(
        new AIError(errorMessage, error instanceof Error ? error : undefined),
      );
    }
  }

  async generateCheckInQuestion(input: {
    context: CoachContext;
    trigger: string;
  }): Promise<Result<string>> {
    try {
      const request: AICompletionRequest = {
        messages: [
          {
            role: 'system',
            content: this.buildCheckInSystemPrompt(),
          },
          {
            role: 'user',
            content: this.buildCheckInQuestionRequest(input.context, input.trigger),
          },
        ],
        maxTokens: 256,
        temperature: 0.8,
      };

      const response = await this.provider.complete(request);

      if (response.isFailure) {
        return Result.fail(
          new AIError(`Failed to generate check-in question: ${response.error}`),
        );
      }

      return Result.ok(response.value.content.trim());
    } catch (error) {
      console.error('Error generating check-in question:', error);
      const errorMessage = `Error generating check-in question: ${error instanceof Error ? error.message : String(error)}`;
      return Result.fail(new CoachErrors.CheckInError(errorMessage));
    }
  }

  async analyzeCheckInResponse(input: {
    checkIn: CheckIn;
    userResponse: string;
    context: CoachContext;
  }): Promise<Result<{ analysis: string; actions: CoachAction[] }>> {
    try {
      const request: AICompletionRequest = {
        messages: [
          {
            role: 'system',
            content: this.buildCheckInAnalysisSystemPrompt(),
          },
          {
            role: 'user',
            content: this.buildCheckInAnalysisRequest(
              input.checkIn,
              input.userResponse,
              input.context,
            ),
          },
        ],
        maxTokens: 512,
        temperature: 0.6,
      };

      const response = await this.provider.complete(request);

      if (response.isFailure) {
        return Result.fail(
          new AIError(`Failed to analyze check-in: ${response.error}`),
        );
      }

      // Parse the response to extract analysis and suggested actions
      const result = this.parseCheckInAnalysis(response.value.content);

      return Result.ok(result);
    } catch (error) {
      console.error('Error analyzing check-in response:', error);
      const errorMessage = `Error analyzing check-in response: ${error instanceof Error ? error.message : String(error)}`;
      return Result.fail(new CoachErrors.AnalysisError(errorMessage));
    }
  }

  async generateWeeklySummary(input: {
    context: CoachContext;
  }): Promise<
    Result<{ summary: string; highlights: string[]; suggestions: string[] }>
  > {
    try {
      const request: AICompletionRequest = {
        messages: [
          {
            role: 'system',
            content: this.buildWeeklySummarySystemPrompt(),
          },
          {
            role: 'user',
            content: this.buildWeeklySummaryRequest(input.context),
          },
        ],
        maxTokens: 1024,
        temperature: 0.7,
      };

      const response = await this.provider.complete(request);

      if (response.isFailure) {
        return Result.fail(
          new AIError(`Failed to generate weekly summary: ${response.error}`),
        );
      }

      // Parse the response to extract summary, highlights, and suggestions
      const result = this.parseWeeklySummary(response.value.content);

      return Result.ok(result);
    } catch (error) {
      console.error('Error generating weekly summary:', error);
      const errorMessage = `Error generating weekly summary: ${error instanceof Error ? error.message : String(error)}`;
      return Result.fail(new CoachErrors.CommunicationError(errorMessage));
    }
  }

  private buildMessages(
    conversation: CoachConversation,
    userMessage: string,
  ): Array<{ role: 'system' | 'user' | 'assistant'; content: string }> {
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> =
      [
        {
          role: 'system',
          content: this.buildSystemPrompt(conversation),
        },
      ];

    // Add recent messages from the conversation (limit to last 10 to avoid token limits)
    const recentMessages = (conversation.messages || []).slice(-10).map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    messages.push(...recentMessages);

    // Add the current user message
    messages.push({
      role: 'user',
      content: userMessage,
    });

    return messages;
  }

  private buildSystemPrompt(conversation: CoachConversation): string {
    const context = conversation.context;
    const currentPlan = context?.currentPlan;

    let prompt = PromptBuilder.buildCoachSystemPrompt();

    if (currentPlan) {
      prompt += `\n\nThey are currently following a plan called "${currentPlan.planName || 'their plan'}". `;
    }

    if (context?.recentWorkouts && context.recentWorkouts.length > 0) {
      const lastWorkout = context.recentWorkouts[0];
      prompt += `\n\nTheir last workout on ${lastWorkout?.date} was a ${lastWorkout?.type}. `;
    }

    return prompt;
  }

  private buildCheckInSystemPrompt(): string {
    return `You are a fitness coach generating a check-in question for a user.
Your question should be:
- Brief and conversational (1-2 sentences)
- Relevant to their current context
- Designed to gather useful information about their progress, energy, or challenges
- Encouraging and supportive in tone

Output only the question, nothing else.`;
  }

  private buildCheckInQuestionRequest(context: CoachContext, trigger: string): string {
    let request = `Generate a check-in question based on this context:\n\n`;
    request += `Trigger: ${trigger}\n`;

    if (context.currentPlan) {
      request += `Current plan: ${context.currentPlan.planName}, Week ${context.currentPlan.weekNumber}\n`;
    }

    if (context.workoutsThisWeek !== undefined) {
      request += `Workouts this week: ${context.workoutsThisWeek}/${context.plannedWorkoutsThisWeek || 0}\n`;
    }

    if (context.energyLevel) {
      request += `Energy level: ${context.energyLevel}\n`;
    }

    return request;
  }

  private buildCheckInAnalysisSystemPrompt(): string {
    return `You are a fitness coach analyzing a user's check-in response.
Provide:
1. A brief analysis of their response (2-3 sentences)
2. Suggested actions to help them (if any)

Be supportive and constructive. Focus on actionable insights.`;
  }

  private buildCheckInAnalysisRequest(
    checkIn: CheckIn,
    userResponse: string,
    context: CoachContext,
  ): string {
    let request = `Analyze this check-in response:\n\n`;
    request += `Question: ${checkIn.question}\n`;
    request += `User's response: "${userResponse}"\n\n`;

    if (context.currentPlan) {
      request += `Context: Week ${context.currentPlan.weekNumber} of ${context.currentPlan.totalWeeks}\n`;
    }

    request += `\nProvide analysis and suggested actions.`;

    return request;
  }

  private buildWeeklySummarySystemPrompt(): string {
    return `You are a fitness coach creating a weekly summary for a user.
Provide:
1. A brief summary of their week (2-3 sentences)
2. 2-3 highlights (accomplishments or positive moments)
3. 2-3 suggestions for the upcoming week

Be encouraging and specific. Celebrate wins and provide actionable guidance.`;
  }

  private buildWeeklySummaryRequest(context: CoachContext): string {
    let request = `Create a weekly summary based on this context:\n\n`;

    if (context.workoutsThisWeek !== undefined) {
      request += `Workouts completed: ${context.workoutsThisWeek}/${context.plannedWorkoutsThisWeek || 0}\n`;
    }

    if (context.recentWorkouts && context.recentWorkouts.length > 0) {
      request += `\nRecent workouts:\n`;
      context.recentWorkouts.slice(0, 5).forEach((w) => {
        request += `- ${w.type} (${new Date(w.date).toLocaleDateString()})`;
        if (w.perceivedExertion) request += ` - Exertion: ${w.perceivedExertion}/10`;
        request += `\n`;
      });
    }

    if (context.trends) {
      request += `\nTrends: ${JSON.stringify(context.trends)}\n`;
    }

    return request;
  }

  private parseCheckInAnalysis(content: string): {
    analysis: string;
    actions: CoachAction[];
  } {
    // Simple parsing - in production, this would be more sophisticated
    // or the AI would return structured JSON
    const lines = content.split('\n').filter((l) => l.trim());

    return {
      analysis: content,
      actions: [], // Would extract suggested actions from the response
    };
  }

  private parseWeeklySummary(content: string): {
    summary: string;
    highlights: string[];
    suggestions: string[];
  } {
    // Simple parsing - in production, this would be more sophisticated
    // or the AI would return structured JSON
    const lines = content.split('\n').filter((l) => l.trim());

    return {
      summary: content,
      highlights: [], // Would extract highlights from the response
      suggestions: [], // Would extract suggestions from the response
    };
  }
}
