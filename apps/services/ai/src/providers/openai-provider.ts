import {
  AIProvider,
  AIProviderConfig,
  AICompletionRequest,
  Result,
  AICompletionResponse,
  AIStreamChunk,
} from '@bene/shared';

export class OpenAIProvider implements AIProvider {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly defaultModel: string;
  private readonly defaultMaxTokens: number;
  private readonly defaultTemperature: number;

  constructor(config: AIProviderConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://api.openai.com/v1/chat/completions';
    this.defaultModel = config.defaultModel || 'gpt-4-turbo-preview';
    this.defaultMaxTokens = config.defaultMaxTokens || 4096;
    this.defaultTemperature = config.defaultTemperature || 0.7;
  }

  getName(): string {
    return 'OpenAI';
  }

  getDefaultModel(): string {
    return this.defaultModel;
  }

  async complete(request: AICompletionRequest): Promise<Result<AICompletionResponse>> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          model: request.model || this.defaultModel,
          messages: request.messages,
          max_tokens: request.maxTokens || this.defaultMaxTokens,
          temperature: request.temperature ?? this.defaultTemperature,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('OpenAI API error:', error);
        return Result.fail(new Error(`OpenAI API error: ${response.status} ${error}`));
      }

      const data = (await response.json()) as any;

      const aiResponse: AICompletionResponse = {
        content: data.choices[0]?.message?.content || '',
        model: data.model,
        usage: {
          inputTokens: data.usage?.prompt_tokens || 0,
          outputTokens: data.usage?.completion_tokens || 0,
        },
      };

      return Result.ok(aiResponse);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return Result.fail(
        new Error(
          `Error calling OpenAI API: ${
            error instanceof Error ? error.message : String(error)
          }`,
        ),
      );
    }
  }

  async *stream(
    request: AICompletionRequest,
  ): AsyncGenerator<AIStreamChunk, void, unknown> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        model: request.model || this.defaultModel,
        messages: request.messages,
        max_tokens: request.maxTokens || this.defaultMaxTokens,
        temperature: request.temperature ?? this.defaultTemperature,
        stream: true,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${response.status} ${error}`);
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
              const content = parsed.choices[0]?.delta?.content;

              if (content) {
                yield { content, isComplete: false };
              }
            } catch (e) {
              continue;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  private getHeaders(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };
  }
}
