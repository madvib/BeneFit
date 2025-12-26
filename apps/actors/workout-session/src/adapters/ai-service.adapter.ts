import type {
  AIProvider,
  AICompletionRequest,
  AICompletionResponse,
  AIStreamChunk,
} from '@bene/shared';
import { Result } from '@bene/shared';
import { env } from 'cloudflare:workers';

export class AIServiceAdapter implements AIProvider {
  constructor(private aiService: typeof env.AI_SERVICE) {
    this.aiService = aiService;
  }

  async complete(request: AICompletionRequest): Promise<Result<AICompletionResponse>> {
    // Call AI service worker via RPC
    const response = await this.aiService.chat(request);
    return Result.ok(response);
  }

  async *stream(
    request: AICompletionRequest,
  ): AsyncGenerator<AIStreamChunk, void, unknown> {
    // Call AI service worker via RPC with streaming
    const streamResponse = await this.aiService.streamChat(request);
    yield* streamResponse;
  }

  getName(): string {
    return 'AIServiceAdapter';
  }

  getDefaultModel(): string {
    return 'claude-3-sonnet';
  }
}
