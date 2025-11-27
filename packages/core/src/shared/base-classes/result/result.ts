/**
 * Result type for explicit error handling without exceptions
 */
export class Result<T, E = Error | Error[]> {
  private constructor(
    public readonly isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: E,
  ) { }

  static ok<T>(value?: T): Result<T, never> {
    return new Result<T, never>(true, value);
  }

  static fail<E = Error>(error: E): Result<never, E> {
    return new Result<never, E>(false, undefined, error);
  }

  get value(): T {
    if (!this.isSuccess) {
      throw new Error('Cannot get value from failed result');
    }
    return this._value!;
  }

  get error(): E {
    if (this.isSuccess) {
      throw new Error('Cannot get error from successful result');
    }
    return this._error!;
  }

  get isFailure(): boolean {
    return !this.isSuccess;
  }

  map<U>(fn: (value: T) => U): Result<U, E> {
    if (this.isFailure) {
      return Result.fail(this.error);
    }
    return Result.ok(fn(this.value));
  }

  mapError<U>(fn: (error: E) => U): Result<T, U> {
    if (this.isSuccess) {
      return Result.ok(this.value);
    }
    return Result.fail(fn(this.error));
  }

  async asyncMap<U>(fn: (value: T) => Promise<U>): Promise<Result<U, E>> {
    if (this.isFailure) {
      return Result.fail(this.error);
    }
    const result = await fn(this.value);
    return Result.ok(result);
  }
  /**
   * Combines an array of Results.
   * - Returns: Result.ok(true) if ALL input Results are successful.
   * - Returns: Result.fail(E[]) if ONE or more input Results fail.
   *
   * @param results An array of Result<unknown, E> objects.
   * @returns Result<true, E[]>
   */
  public static combine<E = Error>(results: Result<unknown, E>[]): Result<true, E[]> {
    const failedResults = results.filter(r => r.isFailure);

    if (failedResults.length > 0) {
      // Extract the error object from each failed Result
      const errors = failedResults.map(r => r.error);

      // Return a single failed Result containing an array of all errors
      return Result.fail(errors);
    }

    // If no failures were found, return success with a value of 'true'
    return Result.ok(true);
  }
}

