import { type SerializedResult } from '@bene/shared';
import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';

export function handleResult<T>(
  result: SerializedResult<T>,
  c: Context,
  successStatus: ContentfulStatusCode = 200,
) {
  console.log(result);
  if (result.isFailure) {
    return c.json(
      {
        error: result.errorMessage,
      },
      mapErrorToStatus(result.errorMessage),
    );
  }

  return c.json<T>(result.value, successStatus);
}

function mapErrorToStatus(error: string): ContentfulStatusCode {
  if (error.includes('not found')) return 404;
  if (error.includes('Unauthorized')) return 401;
  if (error.includes('forbidden')) return 403;
  return 400; // Bad request for business logic errors
}
