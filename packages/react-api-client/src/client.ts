import { createClient } from './generated/client';

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

// Create API client with error handling and proper base URL
export const client = createClient(import.meta.env.VITE_API_BASE_URL, {
  fetch: async (input: Parameters<typeof fetch>[0], init?: Parameters<typeof fetch>[1]) => {
    const res = await fetch(input, {
      ...init,
      credentials: 'include', // Important for auth cookies
    });

    // Global error handling
    if (!res.ok) {
      if (res.status === 401) {
        // Handle unauthorized - maybe redirect to login
        console.error('Unauthorized access - redirect to login if needed');
      }

      const body = await res.json().catch(() => null);
      const isObject = typeof body === 'object' && body !== null;
      const message = isObject && 'error' in body ? body.error : `Request failed with status ${ res.status }`;

      throw new ApiError(
        res.status,
        res.statusText,
        String(message),
        isObject && 'code' in body ? body.code : undefined
      );
    }

    return res;
  },
});

export type ApiClient = typeof client;
export { ApiError };
