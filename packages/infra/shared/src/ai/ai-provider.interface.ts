import { Result } from '@bene/shared-domain';
import type {
  AICompletionRequest,
  AICompletionResponse,
  AIStreamChunk,
} from './types.js';

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
