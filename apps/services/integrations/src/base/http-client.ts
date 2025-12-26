import { Result } from '@bene/shared';

/**
 * Base HTTP client for making API requests
 * Handles common patterns like authorization headers and error handling
 */
export class HttpClient {
  constructor(protected baseUrl: string) {}

  /**
   * Make a GET request
   */
  public async get<T>(
    endpoint: string,
    accessToken: string,
    headers?: Record<string, string>,
  ): Promise<Result<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'GET',
        headers: this.buildHeaders(accessToken, headers),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return Result.fail(
        new Error(
          `GET request failed: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }

  /**
   * Make a POST request
   */
  public async post<T>(
    endpoint: string,
    body: any,
    accessToken?: string,
    headers?: Record<string, string>,
  ): Promise<Result<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: this.buildHeaders(accessToken, {
          'Content-Type': 'application/json',
          ...headers,
        }),
        body: JSON.stringify(body),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return Result.fail(
        new Error(
          `POST request failed: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }

  /**
   * Make a PUT request
   */
  public async put<T>(
    endpoint: string,
    body: any,
    accessToken: string,
    headers?: Record<string, string>,
  ): Promise<Result<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: this.buildHeaders(accessToken, {
          'Content-Type': 'application/json',
          ...headers,
        }),
        body: JSON.stringify(body),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return Result.fail(
        new Error(
          `PUT request failed: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }

  /**
   * Make a DELETE request
   */
  public async delete<T>(
    endpoint: string,
    accessToken: string,
    headers?: Record<string, string>,
  ): Promise<Result<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: this.buildHeaders(accessToken, headers),
      });

      return this.handleResponse<T>(response);
    } catch (error) {
      return Result.fail(
        new Error(
          `DELETE request failed: ${error instanceof Error ? error.message : String(error)}`,
        ),
      );
    }
  }

  /**
   * Handle HTTP response
   */
  protected async handleResponse<T>(response: Response): Promise<Result<T>> {
    if (!response.ok) {
      const error = await response.text();
      return Result.fail(new Error(`HTTP ${response.status}: ${error}`));
    }

    try {
      const data = await response.json();
      return Result.ok(data as T);
    } catch (error) {
      // Response might not be JSON (e.g., 204 No Content)
      return Result.ok(undefined as T);
    }
  }

  /**
   * Build headers for request
   */
  protected buildHeaders(
    accessToken?: string,
    additionalHeaders?: Record<string, string>,
  ): Record<string, string> {
    const headers: Record<string, string> = {
      ...additionalHeaders,
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return headers;
  }
}
