import { createAuthClient } from 'better-auth/react';

// Create and export the auth client
// Apps will initialize this with their baseURL
let authClient: ReturnType<typeof createAuthClient> | null = null;

export function initAuthClient(baseURL: string = import.meta.env.VITE_API_BASE_URL) {
  authClient = createAuthClient({ baseURL });
  return authClient;
}

export function getAuthClient() {
  if (!authClient) {
    throw new Error('Auth client not initialized. Call initAuthClient() first.');
  }
  return authClient;
}

// Export the client directly for direct usage
export { authClient };
