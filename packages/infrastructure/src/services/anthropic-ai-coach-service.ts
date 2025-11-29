import { Result } from '@bene/domain-shared';
import type { CoachingMessage, CoachingConversation } from '@bene/domain/coaching';

export interface AnthropicAIRequest {
  model?: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  max_tokens?: number;
  temperature?: number;
}

export interface AnthropicAIResponse {
  content: Array<{ type: 'text'; text: string }>;
  model: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

export class AnthropicAICoachService {
  private readonly baseUrl = 'https://api.anthropic.com/v1/messages';
  private readonly apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async sendMessage(
    conversation: CoachingConversation,
    userMessage: string,
  ): Promise<Result<CoachingMessage>> {
    try {
      const request: AnthropicAIRequest = {
        model: 'claude-3-sonnet-20240229',
        messages: this.buildMessages(conversation, userMessage),
        max_tokens: 1024,
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
        return Result.fail(`Failed to get AI response: ${response.status} ${error}`);
      }

      const data: AnthropicAIResponse = await response.json();

      if (!data.content || data.content.length === 0) {
        return Result.fail('AI returned empty response');
      }

      const aiMessage: CoachingMessage = {
        id: `msg_${Date.now()}`,
        role: 'assistant',
        content: data.content[0].text,
        timestamp: new Date(),
        metadata: {
          model: data.model,
          inputTokens: data.usage.input_tokens,
          outputTokens: data.usage.output_tokens,
        },
      };

      return Result.ok(aiMessage);
    } catch (error) {
      console.error('Error calling Anthropic API:', error);
      return Result.fail(`Error calling Anthropic API: ${error}`);
    }
  }

  private buildMessages(
    conversation: CoachingConversation,
    userMessage: string,
  ): Array<{ role: 'user' | 'assistant'; content: string }> {
    // Build context from the coaching conversation
    const contextMessages: Array<{ role: 'user' | 'assistant'; content: string }> = [
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

    contextMessages.push(...recentMessages);

    // Add the current user message
    contextMessages.push({
      role: 'user',
      content: userMessage,
    });

    return contextMessages;
  }

  private buildSystemPrompt(conversation: CoachingConversation): string {
    // Build a system prompt with user context and coaching goals
    const context = conversation.context;
    const userProfile = context?.userProfile;
    const currentPlan = context?.currentPlan;

    let prompt =
      'You are an expert fitness coach with deep knowledge of exercise science and behavior change. ';

    if (userProfile) {
      prompt += `The user is ${userProfile.displayName || 'a user'} who has `;

      if (userProfile.experienceProfile?.level) {
        prompt += `fitness experience level: ${userProfile.experienceProfile.level}. `;
      }

      if (userProfile.fitnessGoals) {
        prompt += `Their goals are: ${JSON.stringify(userProfile.fitnessGoals)}. `;
      }
    }

    if (currentPlan) {
      prompt += `They are currently following a plan called "${currentPlan.name || 'their plan'}". `;
    }

    if (context?.recentWorkouts?.length > 0) {
      const lastWorkout = context.recentWorkouts[0];
      prompt += `Their last workout on ${lastWorkout.recordedAt} was a ${lastWorkout.workoutType}. `;
    }

    prompt += `Respond concisely but helpfully to their fitness coaching questions. Focus on motivation, technique, form, progression, and building sustainable habits. If they ask about their plan, remind them that specific plan details are managed separately and they should check their workout for the day. Keep responses under 200 words.`;

    return prompt;
  }
}
