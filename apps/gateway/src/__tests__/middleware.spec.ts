import { describe, it, expect } from 'vitest';
import { Hono } from 'hono';
import { ZodError } from 'zod';
import { errorHandler, AppError } from '../middleware/on-error.js';

describe('Error Handler Middleware', () => {
  it.skip('should handle ZodError as 400 with details', async () => {
    const app = new Hono()
      .onError(errorHandler)
      .get('/test', async () => {
        throw new ZodError([{
          code: 'invalid_type',
          expected: 'string',
          received: 'number',
          path: ['name'],
          message: 'Expected string',
        }]);
      });

    const res = await app.request('/test');

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe('Validation failed');
    expect(body.details).toHaveLength(1);
    expect(body.details[0].path).toBe('name');
  });

  it('should handle AppError with custom status', async () => {
    const app = new Hono()
      .onError(errorHandler)
      .get('/test', async () => {
        throw new AppError(403, 'Not allowed', 'FORBIDDEN');
      });

    const res = await app.request('/test');

    expect(res.status).toBe(403);
    const body = await res.json();
    expect(body.error).toBe('Not allowed');
    expect(body.code).toBe('FORBIDDEN');
  });

  it('should handle Durable Object errors as 503', async () => {
    const app = new Hono()
      .onError(errorHandler)
      .get('/test', async () => {
        throw new Error('Durable Object reset because its code was updated');
      });

    const res = await app.request('/test');

    expect(res.status).toBe(503);
    const body = await res.json();
    expect(body.error).toBe('Service temporarily unavailable');
  });

  it('should handle unknown errors as 500', async () => {
    const app = new Hono()
      .onError(errorHandler)
      .get('/test', async () => {
        throw new Error('Something unexpected');
      });

    const res = await app.request('/test');
    expect(res.status).toBe(500);
  });
});
