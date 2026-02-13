import { createClient } from './generated/client';
import { getConfig } from './lib/config/runtime';

class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Singleton cache - null until first access
let _clientInstance: ReturnType<typeof createClient> | null = null;

/**
 * Get or create the API client singleton.
 * Lazy initialization on first call.
 *
 * This function reads the base URL from runtime configuration
 * (set by the consuming app via initializeApiClients).
 */
export function getApiClient(): ReturnType<typeof createClient> {
  if (!_clientInstance) {
    const config = getConfig();
    _clientInstance = createClient(config.baseUrl, {
      fetch: async (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => {
        const res = await fetch(input, {
          ...init,
          credentials: 'include', // Important for auth cookies
        });

        return res;
      },
    });
  }
  return _clientInstance;
}

/**
 * Reset the API client singleton.
 * Useful for testing or environment switching.
 */
export function resetApiClient(): void {
  _clientInstance = null;
}

export type ApiClient = ReturnType<typeof getApiClient>;
export { ApiError };
