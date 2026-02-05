import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from './msw/handlers.js';

/**
 * MSW server for Node.js environment (tests)
 */
export const server = setupServer(...handlers);

// Start server before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' }); // Changed from 'error' to 'warn'
});

// Reset handlers after each test (removes any runtime overrides)
afterEach(() => {
  server.resetHandlers();
});

// Clean up after all tests
afterAll(() => {
  server.close();
});
