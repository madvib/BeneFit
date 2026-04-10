import { Hono } from 'hono';
import { vi } from 'vitest';
import { errorHandler } from '../middleware/on-error.js';
import {
  coachRoutes,
  fitnessPlanRoutes,
  integrationRoutes,
  profileRoutes,
  workoutRoutes,
  billingRoutes,
  stripeWebhookRoute,
} from '../routes/index.js';
import { webhookRoutes } from '../routes/webhooks.js';
import type { GatewayEnv } from '../lib/types.js';
import type { AuthUser } from '../lib/types.js';

export const TEST_USER: AuthUser = {
  id: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
  email: 'test@example.com',
  name: 'Test User',
  emailVerified: true,
  createdAt: new Date('2025-01-01'),
  updatedAt: new Date('2025-01-01'),
};

/**
 * Creates a base mock env with all required bindings stubbed.
 */
export function createMockEnv(overrides: Record<string, any> = {}): Env {
  return {
    DB_USER_AUTH: {} as any,
    USER_HUB: {
      getByName: vi.fn().mockReturnValue({}),
      idFromName: vi.fn().mockReturnValue('test-do-id'),
      get: vi.fn().mockReturnValue({ fetch: vi.fn() }),
    } as any,
    WORKOUT_SESSION: {} as any,
    CORS_ORIGIN: 'http://localhost:3000',
    TRUSTED_ORIGINS: 'http://localhost:3000',
    BETTER_AUTH_SECRET: 'test-secret',
    BETTER_AUTH_URL: 'http://localhost:8787',
    GOOGLE_CLIENT_ID: '',
    GOOGLE_CLIENT_SECRET: '',
    STRAVA_CLIENT_ID: '',
    STRAVA_CLIENT_SECRET: '',
    VITE_API_BASE_URL: '',
    CLOUDFLARE_ACCOUNT_ID: '',
    CLOUDFLARE_USER_AUTH_DATABASE_ID: '',
    CLOUDFLARE_D1_TOKEN: '',
    ...overrides,
  } as unknown as Env;
}

/**
 * Creates a test-ready Hono app with mocked auth and env bindings.
 */
export function createTestApp(envOverrides: Record<string, any> = {}) {
  const mockEnv = createMockEnv(envOverrides);

  const app = new Hono<GatewayEnv>()
    .onError(errorHandler)
    // Inject env for all routes
    .use('*', async (c, next) => {
      // c.env may be undefined outside Workers runtime — replace it entirely
      (c as any).env = { ...c.env, ...mockEnv };
      await next();
    })
    .use('/api/*', async (c, next) => {
      c.set('user', TEST_USER);
      await next();
    })
    .route('/api/coach', coachRoutes)
    .route('/api/fitness-plan', fitnessPlanRoutes)
    .route('/api/integrations', integrationRoutes)
    .route('/api/profile', profileRoutes)
    .route('/api/workouts', workoutRoutes)
    .route('/api/billing', billingRoutes)
    .route('/webhooks', webhookRoutes)
    .route('/webhooks/stripe', stripeWebhookRoute);

  return { app, mockEnv };
}

/**
 * Creates mock facade methods for the UserHub DO stub.
 */
export function createMockUserHub(facadeMocks: Record<string, Record<string, any>>) {
  const facadeStubs: Record<string, () => Record<string, any>> = {};

  for (const [name, methods] of Object.entries(facadeMocks)) {
    const wrappedMethods: Record<string, any> = {};
    for (const [method, impl] of Object.entries(methods)) {
      wrappedMethods[method] = typeof impl === 'function' ? impl : vi.fn().mockResolvedValue(impl);
    }
    facadeStubs[name] = () => wrappedMethods;
  }

  return {
    getByName: vi.fn().mockReturnValue(facadeStubs),
    idFromName: vi.fn().mockReturnValue('test-do-id'),
    get: vi.fn().mockReturnValue({
      fetch: vi.fn().mockResolvedValue(new Response('ok')),
    }),
  };
}

/** Helper to make JSON requests to the test app */
export function req(app: Hono) {
  return {
    get(path: string) {
      return app.request(path, { method: 'GET' });
    },
    post(path: string, body?: unknown) {
      return app.request(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
    },
    patch(path: string, body?: unknown) {
      return app.request(path, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
    },
  };
}

/** Success result shape matching SerializedResult */
export function okResult<T>(value: T) {
  return { isSuccess: true, isFailure: false, value, errorMessage: '', errorCode: '' };
}

/** Failure result shape matching SerializedResult */
export function failResult(message: string, code = 'UNKNOWN_ERROR') {
  return { isSuccess: false, isFailure: true, value: null, errorMessage: message, errorCode: code };
}
