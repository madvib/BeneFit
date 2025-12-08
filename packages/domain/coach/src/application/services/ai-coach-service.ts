import { Result } from '@bene/shared-domain';
import { CoachConversation, CoachContext, CheckIn, CoachAction } from '@core/index.js';

export interface AICoachResponse {
  message: string;
  actions?: CoachAction[];
  suggestedFollowUps?: string[];
  tokensUsed?: number;
}

export interface AICoachService {
  getResponse(input: {
    conversation: CoachConversation;
    userMessage: string;
  }): Promise<Result<AICoachResponse>>;

  generateCheckInQuestion(input: {
    context: CoachContext;
    trigger: string;
  }): Promise<Result<string>>;

  analyzeCheckInResponse(input: {
    checkIn: CheckIn;
    userResponse: string;
    context: CoachContext;
  }): Promise<
    Result<{
      analysis: string;
      actions: CoachAction[];
    }>
  >;

  generateWeeklySummary(input: { context: CoachContext }): Promise<
    Result<{
      summary: string;
      highlights: string[];
      suggestions: string[];
    }>
  >;
}
