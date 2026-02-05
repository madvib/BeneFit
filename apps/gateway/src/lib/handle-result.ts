import { type SerializedResult, APP_ERROR_CODES } from '@bene/shared';
import { Context } from 'hono';
import { ContentfulStatusCode } from 'hono/utils/http-status';

const ERROR_CODE_MAP: Record<keyof typeof APP_ERROR_CODES, ContentfulStatusCode> = {
  // 400 Bad Request
  [APP_ERROR_CODES.VALIDATION_ERROR]: 400,
  [APP_ERROR_CODES.DOMAIN_ERROR]: 400,
  [APP_ERROR_CODES.PARSE_ERROR]: 400,

  // 401 Unauthorized
  [APP_ERROR_CODES.UNAUTHORIZED]: 401,

  // 403 Forbidden
  [APP_ERROR_CODES.FORBIDDEN]: 403,

  // 404 Not Found
  [APP_ERROR_CODES.ENTITY_NOT_FOUND]: 404,
  [APP_ERROR_CODES.NO_ACTIVE_PLAN]: 404,

  // 409 Conflict
  [APP_ERROR_CODES.CONFLICT]: 409,

  // 502 Bad Gateway
  [APP_ERROR_CODES.AI_ERROR]: 502,

  // 500 Internal Server Error
  [APP_ERROR_CODES.REPOSITORY_ERROR]: 500,
  [APP_ERROR_CODES.QUERY_ERROR]: 500,
  [APP_ERROR_CODES.SAVE_ERROR]: 500,
  [APP_ERROR_CODES.DELETE_ERROR]: 500,
  [APP_ERROR_CODES.DATABASE_ERROR]: 500,
  [APP_ERROR_CODES.UNKNOWN_ERROR]: 500,
};

export function handleResult<T>(
  result: SerializedResult<T>,
  c: Context,
  successStatus: ContentfulStatusCode = 200,
) {
  if (result.isFailure) {
    const status = mapErrorToStatus(result.errorMessage, result.errorCode);

    // Log failures appropriately
    if (status >= 500) {
      console.error(`[Result Failure ${ status }] ${ result.errorCode }: ${ result.errorMessage }`);
    } else {
      console.warn(`[Result Failure ${ status }] ${ result.errorCode }: ${ result.errorMessage }`);
    }

    return c.json(
      {
        error: result.errorMessage,
        code: result.errorCode,
      },
      status,
    );
  }

  return c.json<T>(result.value, successStatus);
}

function mapErrorToStatus(error: string, code?: string): ContentfulStatusCode {
  // 1. Prefer explicit error code mapping
  if (code && code in ERROR_CODE_MAP) {
    return ERROR_CODE_MAP[code as keyof typeof ERROR_CODE_MAP];
  }

  // 2. Fallback to string matching (Legacy support)
  if (error.toLowerCase().includes('not found')) return 404;
  if (error.toLowerCase().includes('unauthorized')) return 401;
  if (error.toLowerCase().includes('forbidden')) return 403;

  return 400; // Default to Bad Request for unknown business logic errors
}
