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

    return res;
  },
});

export type ApiClient = typeof client;
export { ApiError };
