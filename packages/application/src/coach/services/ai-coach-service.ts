import { Result } from '@bene/core/shared';
import { CoachingConversation, CoachingContext, CheckIn, CoachAction } from '@bene/core/coach';

export interface AICoachResponse {
  message: string;
  actions?: CoachAction[];
  suggestedFollowUps?: string[];
  tokensUsed?: number;
}

export interface AICoachService {
  getResponse(input: {
    conversation: CoachingConversation;
    userMessage: string;
  }): Promise<Result<AICoachResponse>>;

  generateCheckInQuestion(input: {
    context: CoachingContext;
    trigger: string;
  }): Promise<Result<string>>;

  analyzeCheckInResponse(input: {
    checkIn: CheckIn;
    userResponse: string;
    context: CoachingContext;
  }): Promise<
    Result<{
      analysis: string;
      actions: CoachAction[];
    }>
  >;

  generateWeeklySummary(input: { context: CoachingContext }): Promise<
    Result<{
      summary: string;
      highlights: string[];
      suggestions: string[];
    }>
  >;
}