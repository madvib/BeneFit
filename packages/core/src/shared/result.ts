/**
 * Result type for explicit error handling without exceptions
 */
export class Result<T, E = Error> {
  private constructor(
    public readonly isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: E,
  ) {}

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
}
