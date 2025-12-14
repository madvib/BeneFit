// apps/actors/user-hub/src/adapters/ai-service.adapter.ts
import type {
  AIProvider,
  AICompletionRequest,
  AICompletionResponse,
  AIStreamChunk,
} from '@bene/shared-infra';
import { Result } from '@bene/shared-domain';

export class AIServiceAdapter implements AIProvider {
  private aiService: Fetcher;

  constructor(aiService: Fetcher) {
    this.aiService = aiService;
  }

  async complete(request: AICompletionRequest): Promise<Result<AICompletionResponse>> {
    // Call AI service worker via RPC
    const response = await this.aiService.complete(request);
    return Result.ok(response);
  }

  async *stream(
    request: AICompletionRequest,
  ): AsyncGenerator<AIStreamChunk, void, unknown> {
    // Call AI service worker via RPC with streaming
    const streamResponse = await this.aiService.stream(request);
    yield* streamResponse;
  }

  getName(): string {
    return 'AIServiceAdapter';
  }

  getDefaultModel(): string {
    return 'claude-3-sonnet';
  }
}
