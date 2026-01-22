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

  // Strict check for Result-like structure
  // Must have isSuccess/isFailure as OWN properties or getters, AND either .serialize method or .value property
  const hasSuccess = 'isSuccess' in data;
  const hasFailure = 'isFailure' in data;

  if (hasSuccess && hasFailure) {
    // If it's a Result class instance, it has a .serialize() method
    const isInstance = typeof (data as any).serialize === 'function';
    const serialized = isInstance ? (data as any).serialize() : data as any;

    // Check if it's explicitly a failure
    if (serialized.isFailure === true) {
      const error = serialized.errorMessage || 'Unknown error';
      return HttpResponse.json(
        { error },
        { status: 400 }
      );
    }

    // Check if it's explicitly a success with a value
    if (serialized.isSuccess === true && 'value' in serialized) {
      return HttpResponse.json(serialized.value);
    }
  }

  // Not a Result, or success without 'value' field (not a standard handled Result)
  // Just return as JSON
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
