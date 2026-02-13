import type {
  AIProvider,
  AICompletionRequest,
  AIStreamChunk,
} from '@bene/shared';
import { WorkerEntrypoint } from 'cloudflare:workers';
import { AnthropicProvider } from './providers/anthropic-provider';
import { OpenAIProvider } from './providers/openai-provider';
import { CloudflareProvider } from './providers/cloudflare-provider';

// ===== REQUEST/RESPONSE TYPES =====
// These are what use cases send/receive

export interface ChatRequest {
  messages: Array<{ role: string; content: string }>;
  model?: string;
  provider?: 'anthropic' | 'openai' | 'cloudflare';
  maxTokens?: number;
  temperature?: number;
}

export interface ChatResponse {
  content: string;
  model: string;
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

export type StreamChatRequest = ChatRequest;

export default class AIService extends WorkerEntrypoint<Env> {
  private providers: Map<string, AIProvider> = new Map();

  constructor(ctx: ExecutionContext, env: Env) {
    super(ctx, env);
    this.initializeProviders();
  }

  private initializeProviders() {
    // Anthropic
    if (this.env.ANTHROPIC_API_KEY) {
      this.providers.set(
        'anthropic',
        new AnthropicProvider({
          apiKey: this.env.ANTHROPIC_API_KEY,
          defaultModel: 'claude-3-5-sonnet-20241022',
          defaultMaxTokens: 4096,
          defaultTemperature: 0.7,
        }),
      );
    }

    // OpenAI
    if (this.env.OPENAI_API_KEY) {
      this.providers.set(
        'openai',
        new OpenAIProvider({
          apiKey: this.env.OPENAI_API_KEY,
          defaultModel: 'gpt-4-turbo-preview',
          defaultMaxTokens: 4096,
          defaultTemperature: 0.7,
        }),
      );
    }

    // Cloudflare (always available)
    this.providers.set(
      'cloudflare',
      new CloudflareProvider({
        ai: this.env.AI,
        defaultModel: '@cf/meta/llama-3.1-8b-instruct',
        defaultMaxTokens: 2048,
        defaultTemperature: 0.7,
      }),
    );
  }

  private getProvider(name?: string): AIProvider {
    const providerName = name || this.env.DEFAULT_PROVIDER || 'cloudflare';
    const provider = this.providers.get(providerName);

    if (!provider) {
      throw new Error(`Provider ${ providerName } not configured`);
    }

    return provider;
  }

  // ===== RPC METHODS (called by DOs/other services) =====

  /**
   * Generate a completion
   */
  async chat(request: ChatRequest): Promise<ChatResponse> {
    const provider = this.getProvider(request.provider);

    const aiRequest: AICompletionRequest = {
      messages: request.messages,
      model: request.model,
      maxTokens: request.maxTokens,
      temperature: request.temperature,
    };

    const result = await provider.complete(aiRequest);

    if (!result.isSuccess) {
      throw new Error(`AI provider error: ${ result.error?.message }`);
    }

    const response = result.value;

    return {
      content: response.content,
      model: response.model,
      usage: {
        inputTokens: response.usage.inputTokens,
        outputTokens: response.usage.outputTokens,
      },
    };
  }

  /**
   * Stream a completion
   */
  async streamChat(request: StreamChatRequest): Promise<ReadableStream<AIStreamChunk>> {
    const provider = this.getProvider(request.provider);

    const aiRequest: AICompletionRequest = {
      messages: request.messages,
      model: request.model,
      maxTokens: request.maxTokens,
      temperature: request.temperature,
    };

    const generator = provider.stream(aiRequest);

    // Convert AsyncGenerator to ReadableStream
    return new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of generator) {
            controller.enqueue(chunk);

            if (chunk.isComplete) {
              controller.close();
              return;
            }
          }
        } catch (error) {
          controller.error(error);
        }
      },
    });
  }

  /**
   * Get available providers
   */
  async getProviders(): Promise<string[]> {
    return Array.from(this.providers.keys());
  }

  /**
   * Get default model for a provider
   */
  async getDefaultModel(provider?: string): Promise<string> {
    const p = this.getProvider(provider);
    return p.getDefaultModel();
  }

  /**
   * HTTP handler for health checks
   */
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/health') {
      return Response.json({ status: 'ok', service: 'ai', timestamp: new Date().toISOString() });
    }

    return new Response('AI Service - Access via RPC', { status: 404 });
  }
}
