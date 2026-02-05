import {
  AICompletionRequest,
  AICompletionResponse,
  AIProvider,
  AIProviderConfig,
  AIStreamChunk,
  Result,
} from '@bene/shared';

/**
 * Anthropic-specific request format
 */

interface AnthropicRequest {
  model: string;
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  max_tokens: number;
  temperature?: number;
  stream?: boolean;
}

/**
 * Anthropic-specific response format
 */
interface AnthropicResponse {
  id: string;
  type: 'message';
  role: 'assistant';
  content: Array<{ type: 'text'; text: string }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Anthropic provider implementation
 */
export class AnthropicProvider implements AIProvider {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly defaultModel: string;
  private readonly defaultMaxTokens: number;
  private readonly defaultTemperature: number;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.anthropic.com/v1/messages';
    this.defaultModel = config.defaultModel || 'claude-3-5-sonnet-20241022';
    this.defaultMaxTokens = config.defaultMaxTokens || 4096;
    this.defaultTemperature = config.defaultTemperature || 0.7;
  }

  getName(): string {
    return 'Anthropic';
  }

  getDefaultModel(): string {
    return this.defaultModel;
  }

  async complete(request: AICompletionRequest): Promise<Result<AICompletionResponse>> {
    try {
      const anthropicRequest = this.convertToAnthropicRequest(request);

      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(anthropicRequest),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Anthropic API error:', error);
        return Result.fail(
          new Error(`Anthropic API error: ${response.status} ${error}`),
        );
      }

      const data = (await response.json()) as AnthropicResponse;

      if (!data.content || data.content.length === 0) {
        return Result.fail(new Error('Anthropic returned empty response'));
      }

      const aiResponse: AICompletionResponse = {
        content: data.content[0]?.text || '',
        model: data.model,
        usage: {
          inputTokens: data.usage.input_tokens,
          outputTokens: data.usage.output_tokens,
        },
      };

      return Result.ok(aiResponse);
    } catch (error) {
      console.error('Error calling Anthropic API:', error);
      return Result.fail(
        new Error(
          `Error calling Anthropic API: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }

  async *stream(
    request: AICompletionRequest,
  ): AsyncGenerator<AIStreamChunk, void, unknown> {
    const anthropicRequest = this.convertToAnthropicRequest(request, true);

    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(anthropicRequest),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Anthropic API error:', error);
      throw new Error(`Anthropic API error: ${response.status} ${error}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          yield { content: '', isComplete: true };
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              yield { content: '', isComplete: true };
              return;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                yield { content: parsed.delta.text, isComplete: false };
              }
            } catch (e) {
              // Skip invalid JSON
              continue;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private convertToAnthropicRequest(
    request: AICompletionRequest,
    stream = false,
  ): AnthropicRequest {
    // Separate system messages from user/assistant messages
    const systemMessages = request.messages.filter(
      (m: { role: string }) => m.role === 'system',
    );
    const conversationMessages = request.messages.filter(
      (m: { role: string }) => m.role !== 'system',
    );

    // Anthropic doesn't support system role in messages array
    // System messages should be passed as a separate parameter
    // For now, we'll prepend system content to the first user message
    let messages = conversationMessages.map((m: { role: string; content: string }) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }));

    if (systemMessages.length > 0 && messages.length > 0) {
      const systemContent = systemMessages
        .map((m: { content: string }) => m.content)
        .join('\n\n');
      if (messages[0]?.role === 'user') {
        messages[0] = {
          ...messages[0],
          content: `${systemContent}\n\n${messages[0].content}`,
        };
      } else {
        // Insert system content as first user message
        messages = [{ role: 'user', content: systemContent }, ...messages];
      }
    }

    return {
      model: request.model || this.defaultModel,
      messages,
      max_tokens: request.maxTokens || this.defaultMaxTokens,
      temperature: request.temperature ?? this.defaultTemperature,
      stream,
    };
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'x-api-key': this.apiKey,
      'anthropic-version': '2023-06-01',
    };
  }
}
