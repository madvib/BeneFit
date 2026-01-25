import { HttpResponse } from 'msw';
import { Result } from '@bene/shared';
// TODO we should not need this after migrating to results for all use case fixtures
/**
 * Unwraps a Result object into an MSW HttpResponse.
 * Supports:
 * 1. Result instances (with .serialize() and .isFailure)
 * 2. Plain SerializedResult objects (with isSuccess/isFailure)
 * 3. Raw data (returned as 200 OK)
 */
export function toHttpResponse<T>(data: T | Result<T>): HttpResponse<any> {
  if (!data || typeof data !== 'object') {
    return HttpResponse.json(data as any);
  }

  // Robust check for Result-like structure
  // It might be a class instance or a serialized object
  const asAny = data as any;
  const isSuccess = asAny.isSuccess === true;
  const isFailure = asAny.isFailure === true;

  // If we can't determine it's a result, return as is
  if (!isSuccess && !isFailure) {
    return HttpResponse.json(data as any);
  }

  // Handle Result instance or serialized structure
  if (isFailure) {
    // Try to get error message from .error, .errorMessage or serialized structure
    let errorMessage = 'Unknown error';

    if (typeof asAny.serialize === 'function') {
      const serialized = asAny.serialize();
      errorMessage = serialized.errorMessage || errorMessage;
    } else if (asAny.errorMessage) {
      errorMessage = asAny.errorMessage;
    } else if (asAny.error) {
      // If error is an object/array, we might want to flatten it or just stringify
      errorMessage = Array.isArray(asAny.error)
        ? asAny.error.map((e: any) => e.message || String(e)).join(', ')
        : (asAny.error.message || String(asAny.error));
    }

    return HttpResponse.json(
      { error: errorMessage },
      { status: 400 }
    );
  }

  // Handle Success
  if (isSuccess) {
    // If it's a class instance, it might have a getter for value
    // Or if it's serialized, it acts as a plain object

    // 1. Try .value getter/property (Result class usually has this)
    if ('value' in asAny) {
      return HttpResponse.json(asAny.value);
    }

    // 2. Try .serialize().value
    if (typeof asAny.serialize === 'function') {
      const serialized = asAny.serialize();
      if ('value' in serialized) {
        return HttpResponse.json(serialized.value);
      }
    }

    // 3. Fallback: if it's success but we can't find value, maybe it's void?
    // Return empty object or null?
    // If original data WAS the value but happened to have isSuccess=true property? Unlikely.
    return HttpResponse.json(null);
  }

  return HttpResponse.json(data as any);
}

/**
 * Wraps a fixture builder that returns a Result into an MSW handler body.
 */
export async function withResult<T>(
  builder: () => T | Result<T> | Promise<T | Result<T>>,
  delayMs?: number
): Promise<HttpResponse<any>> {
  if (delayMs) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  const result = await builder();
  return toHttpResponse(result);
}
