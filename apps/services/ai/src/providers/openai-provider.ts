import { AICompletionRequest, AICompletionResponse, AIProvider, AIProviderConfig, AIStreamChunk, Result } from '@bene/shared-domain';

/**
 * OpenAI provider implementation (placeholder for future implementation)
 */
export class OpenAIProvider implements AIProvider {
  private readonly _baseUrl: string;
  private readonly _apiKey: string;
  private readonly defaultModel: string;

  constructor(config: AIProviderConfig) {
    this._apiKey = config.apiKey;
    this._baseUrl = config.baseUrl || 'https://api.openai.com/v1/chat/completions';
    this.defaultModel = config.defaultModel || 'gpt-4';
  }

  getName(): string {
    return 'OpenAI';
  }

  getDefaultModel(): string {
    return this.defaultModel;
  }

  async complete(request: AICompletionRequest): Promise<Result<AICompletionResponse>> {
    // TODO: Implement OpenAI API integration
    return Result.fail(new Error('OpenAI provider not yet implemented'));
  }

  async *stream(
    request: AICompletionRequest,
  ): AsyncGenerator<AIStreamChunk, void, unknown> {
    // TODO: Implement OpenAI streaming
    throw new Error('OpenAI provider not yet implemented');
  }
}
