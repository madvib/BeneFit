import type { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (err: Error, c: Context) => {
  console.error('Error occurred:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  // Zod validation errors (from zValidator or manual .parse())
  if (err instanceof ZodError) {
    return c.json(
      {
        error: 'Validation failed',
        details: err.issues.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        })),
      },
      400,
    );
  }

  // Your custom application errors
  if (err instanceof AppError) {
    return c.json(
      {
        error: err.message,
        code: err.code,
      },
      err.statusCode as ContentfulStatusCode,
    );
  }

  // Durable Object errors
  if (err.message.includes('Durable Object')) {
    return c.json(
      {
        error: 'Service temporarily unavailable',
      },
      503,
    );
  }

  // Database errors
  if (err.message.includes('D1')) {
    return c.json(
      {
        error: 'Database error',
      },
      500,
    );
  }

  // Catch-all for unexpected errors
  return c.json(
    {
      error: import.meta.env.PROD ? 'Internal server error' : err.message,
    },
    500,
  );
};
