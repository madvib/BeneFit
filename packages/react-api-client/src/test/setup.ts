import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './msw/handlers.js';
import { resetApiClient } from '../client';
import { resetAuthClient } from '../lib/auth/auth';
import { initializeApiClients } from '../lib/config/runtime';

/**
 * MSW server for Node.js environment (tests)
 */
export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' }); // Changed from 'error' to 'warn'
  // Initialize API clients for tests
  initializeApiClients({
    baseUrl: 'http://localhost:8787', // Mock base URL for tests
  });
});

// Reset handlers after each test (removes any runtime overrides)
afterEach(() => {
  server.resetHandlers();
  // Reset clients to ensure fresh instances per test
  resetApiClient();
  resetAuthClient();
  // Re-initialize API clients after reset
  initializeApiClients({
    baseUrl: 'http://localhost:8787',
  });
});

// Clean up after all tests
afterAll(() => {
  server.close();
});
