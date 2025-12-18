import { Result } from '@bene/shared-domain';
import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';

export function handleResult<T>(
  result: Result<T>,
  c: Context,
  successStatus: ContentfulStatusCode = 200,
) {
  if (result.isFailure) {
    // Map domain errors to HTTP status codes
    const statusCode = mapErrorToStatus(result.error);

    return c.json(
      {
        error: result.error.message,
      },
      statusCode,
    );
  }

  return c.json(result.value, successStatus);
}

function mapErrorToStatus(error: Error): ContentfulStatusCode {
  // You can be more sophisticated here
  if (error.message.includes('not found')) return 404;
  if (error.message.includes('Unauthorized')) return 401;
  if (error.message.includes('forbidden')) return 403;
  return 400; // Bad request for business logic errors
}
