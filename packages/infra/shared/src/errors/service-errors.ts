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

export class AIError extends ServiceError {
  constructor(message: string, cause?: Error) {
    super(message, 'AI_ERROR', cause);
  }
}

export class ParseError extends ServiceError {
  constructor(message: string, cause?: Error) {
    super(message, 'PARSE_ERROR', cause);
  }
}
