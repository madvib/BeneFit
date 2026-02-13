/**
 * Runtime configuration for API clients.
 * This allows the library to receive configuration from the consuming app
 * instead of baking environment variables into the library build.
 */

interface ApiClientConfig {
  baseUrl: string;
}

let _config: ApiClientConfig | null = null;

/**
 * Initialize the API client configuration.
 * Should be called once at app startup, before any API calls.
 *
 * @example
 * ```typescript
 * // In app entry point (e.g., apps/web/src/entry-client.tsx)
 * import { initializeApiClients } from '@bene/react-api-client';
 *
 * initializeApiClients({
 *   baseUrl: import.meta.env.VITE_API_BASE_URL
 * });
 * ```
 */
export function initializeApiClients(config: ApiClientConfig): void {
  _config = config;
}

/**
 * Get the current configuration.
 * Throws an error if not initialized.
 */
export function getConfig(): ApiClientConfig {
  if (!_config) {
    throw new Error(
      'API clients not initialized. Call initializeApiClients({ baseUrl }) in your app entry point before using any API hooks or clients.'
    );
  }

  return _config;
}

/**
 * Reset configuration (for testing).
 * @internal
 */
export function resetConfig(): void {
  _config = null;
}
