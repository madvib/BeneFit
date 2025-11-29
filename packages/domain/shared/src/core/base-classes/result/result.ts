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
/**
     * Returns all errors as a guaranteed Error[] array.
     * @throws Error if called on a successful result, or if no errors exist.
     */
    public getErrorsArray(): Error[] {
        if (this.isSuccess) {
            throw new Error('Cannot get errors from a successful result');
        }

        // Get the error object/array, which is of type E
        const currentError = this._error; 

        // 1. Check if the error property is actually set (not undefined)
        // This is the check that resolves the ts(2532) error.
        if (!currentError) {
            // This case should ideally not happen if fail() is called with an error, 
            // but we must handle the possibility that _error is undefined even if isFailure is true.
            throw new Error('Result failed but no error object was found.');
        }

        // 2. Use Array.isArray() to narrow the type of E
        if (Array.isArray(currentError)) {
            // TypeScript now knows currentError is E[]
            // We cast it to Error[] using unknown as an intermediary step
            return currentError as unknown as Error[];
        }

        // 3. If it's a single error object (or any non-array E), return it wrapped in an array
        return [currentError as unknown as Error];
    }

  /**
     * Returns the message of the first error in the result.
     * Use this for simple logging or display purposes.
     * @throws Error if called on a successful result.
     * @returns The first error message, or a default string if no error message is available.
     */
    public get errorMessage(): string {
        // Calling getErrorsArray() will throw if the result is successful.
        // It also contains logic to throw if isFailure is true but _error is missing.
        const errors = this.getErrorsArray(); 

        // Check if the array contains any elements before accessing index [0]
        if (errors.length === 0) {
            return "An unknown error occurred, but no specific error message was captured.";
        }
        
        // This is now safe as we know the array has at least one element
        return errors[0]?.message ?? "An unknown error occurred."; 
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

