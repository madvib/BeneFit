export abstract class ServiceError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public override readonly cause?: Error,
  ) {
    super(message);
    this.name = this.constructor.name;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
