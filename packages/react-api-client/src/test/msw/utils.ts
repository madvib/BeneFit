import { HttpResponse } from 'msw';
import { Result, type SerializedResult } from '@bene/shared';

/**
 * Unwraps a Result or SerializedResult into an MSW HttpResponse.
 * This function is STRICT and requires a Result-like object.
 * 
 * If you need to return raw JSON data that is not a Result, 
 * use HttpResponse.json() directly.
 */
export function toHttpResponse<T>(data: Result<T> | SerializedResult<T>): HttpResponse<any> {
  if (!data) {
    return HttpResponse.json({ error: 'Null result provided to toHttpResponse' }, { status: 500 });
  }

  const serialized = data instanceof Result ? data.serialize() : data;

  if (serialized.isFailure) {
    return HttpResponse.json(
      {
        error: serialized.errorMessage || 'Unknown Error',
        code: serialized.errorCode
      },
      { status: 400 }
    );
  }

  return HttpResponse.json(serialized.value ?? null);
}
