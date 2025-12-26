export abstract class ApplicationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public override readonly cause?: Error,
  ) {
    super(message);
    this.name = this.constructor.name;

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export class AIError extends ApplicationError {
  constructor(message: string, cause?: Error) {
    super(message, 'AI_ERROR', cause);
  }
}

export class ParseError extends ApplicationError {
  constructor(message: string, cause?: Error) {
    super(message, 'PARSE_ERROR', cause);
  }
}
