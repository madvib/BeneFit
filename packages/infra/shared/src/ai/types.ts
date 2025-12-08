/**
 * Core types for AI provider abstraction
 * These types are provider-agnostic and can be used with any AI service
 */

/**
 * Message format (provider-agnostic)
 */
export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * Request configuration for AI completions
 */
export interface AICompletionRequest {
  messages: AIMessage[];
  maxTokens?: number;
  temperature?: number;
  model?: string;
}

/**
 * Response format from AI completions
 */
export interface AICompletionResponse {
  content: string;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

/**
 * Streaming chunk for real-time responses
 */
export interface AIStreamChunk {
  content: string;
  isComplete: boolean;
}

/**
 * Provider configuration
 */
export interface AIProviderConfig {
  apiKey: string;
  baseUrl?: string;
  defaultModel?: string;
  defaultMaxTokens?: number;
  defaultTemperature?: number;
}
