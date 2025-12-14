import { Result } from '@bene/shared-domain';

/**
 * Provider abstraction interface
 * All AI providers (Anthropic, OpenAI, etc.) must implement this interface
 */
export interface AIProvider {
  /**
   * Non-streaming completion
   * @param request The completion request
   * @returns Result containing the completion response
   */
  complete(request: AICompletionRequest): Promise<Result<AICompletionResponse>>;

  /**
   * Streaming completion
   * @param request The completion request
   * @returns Async generator yielding stream chunks
   */
  stream(request: AICompletionRequest): AsyncGenerator<AIStreamChunk, void, unknown>;

  /**
   * Get the provider name
   */
  getName(): string;

  /**
   * Get the default model for this provider
   */
  getDefaultModel(): string;
}

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
