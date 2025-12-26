import {
  AIProvider,
  AIProviderConfig,
  AICompletionRequest,
  AICompletionResponse,
  AIStreamChunk,
  Result,
} from '@bene/shared';

interface CloudflareAIConfig {
  ai: Ai;
  defaultModel?: string;
  defaultMaxTokens?: number;
  defaultTemperature?: number;
}

export class CloudflareProvider implements AIProvider {
  private readonly ai: Ai;
  private readonly defaultModel: string;
  private readonly defaultMaxTokens: number;
  private readonly defaultTemperature: number;

  constructor(config: CloudflareAIConfig) {
    this.ai = config.ai;
    this.defaultModel = config.defaultModel || '@cf/meta/llama-3.1-8b-instruct';
    this.defaultMaxTokens = config.defaultMaxTokens || 2048;
    this.defaultTemperature = config.defaultTemperature || 0.7;
  }

  getName(): string {
    return 'Cloudflare';
  }

  getDefaultModel(): string {
    return this.defaultModel;
  }

  async complete(request: AICompletionRequest): Promise<Result<AICompletionResponse>> {
    try {
      const response = await this.ai.run(request.model || this.defaultModel, {
        messages: request.messages.map((m) => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content,
        })),
        max_tokens: request.maxTokens || this.defaultMaxTokens,
        temperature: request.temperature ?? this.defaultTemperature,
      });

      // Cloudflare AI response format
      const aiResponse: AICompletionResponse = {
        content: (response as any).response || '',
        model: request.model || this.defaultModel,
        usage: {
          inputTokens: 0, // Cloudflare doesn't provide token counts
          outputTokens: 0,
        },
      };

      return Result.ok(aiResponse);
    } catch (error) {
      console.error('Error calling Cloudflare AI:', error);
      return Result.fail(
        new Error(
          `Error calling Cloudflare AI: ${
            error instanceof Error ? error.message : String(error)
          }`,
        ),
      );
    }
  }

  async *stream(
    request: AICompletionRequest,
  ): AsyncGenerator<AIStreamChunk, void, unknown> {
    try {
      const stream = await this.ai.run(request.model || this.defaultModel, {
        messages: request.messages.map((m) => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content,
        })),
        max_tokens: request.maxTokens || this.defaultMaxTokens,
        temperature: request.temperature ?? this.defaultTemperature,
        stream: true,
      });

      // Cloudflare AI returns an async iterable
      for await (const chunk of stream as any) {
        if (chunk.response) {
          yield {
            content: chunk.response,
            isComplete: false,
          };
        }
      }

      yield {
        content: '',
        isComplete: true,
      };
    } catch (error) {
      console.error('Error streaming from Cloudflare AI:', error);
      throw error;
    }
  }
}
