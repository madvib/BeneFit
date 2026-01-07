/**
 * Base class for all application errors
 * Provides error codes and contextual information for better debugging and error handling
 */
export abstract class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = 'UNKNOWN_ERROR',
    public readonly context?: Record<string, unknown>,
    public override readonly cause?: Error,
  ) {
    super(message);
    this.name = this.constructor.name;

    // Maintains proper prototype chain
    Object.setPrototypeOf(this, new.target.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Returns a JSON representation of the error
   */
  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      context: this.context,
      cause: this.cause,
    };
  }
}

/**
 * Domain-specific business logic errors
 */
export class DomainError extends AppError {
  constructor(message: string, code: string = 'DOMAIN_ERROR', context?: Record<string, unknown>, cause?: Error) {
    super(message, code, context, cause);
  }
}

/**
 * Persistence/Database layer errors
 */
export class RepositoryError extends AppError {
  constructor(message: string, code: string = 'REPOSITORY_ERROR', cause?: Error) {
    super(message, code, undefined, cause);
  }
}

export class EntityNotFoundError extends RepositoryError {
  constructor(entityName: string, identifier: string, cause?: Error) {
    super(
      `${ entityName } with identifier '${ identifier }' not found`,
      'ENTITY_NOT_FOUND',
      cause,
    );
  }
}

export class QueryError extends RepositoryError {
  constructor(operation: string, entityName: string, cause?: Error) {
    super(
      `Failed to ${ operation } ${ entityName }: ${ cause?.message || 'Unknown error' }`,
      'QUERY_ERROR',
      cause,
    );
  }
}

export class SaveError extends RepositoryError {
  constructor(entityName: string, identifier?: string, cause?: Error) {
    const id = identifier ? ` with id '${ identifier }'` : '';
    super(
      `Failed to save ${ entityName }${ id }: ${ cause?.message || 'Unknown error' }`,
      'SAVE_ERROR',
      cause,
    );
  }
}

export class DeleteError extends RepositoryError {
  constructor(entityName: string, identifier: string, cause?: Error) {
    super(
      `Failed to delete ${ entityName } with id '${ identifier }': ${ cause?.message || 'Unknown error' }`,
      'DELETE_ERROR',
      cause,
    );
  }
}

export class DatabaseError extends RepositoryError {
  constructor(operation: string, cause?: Error) {
    super(
      `Database error during ${ operation }: ${ cause?.message || 'Unknown error' }`,
      'DATABASE_ERROR',
      cause,
    );
  }
}

/**
 * Application flow/Use Case errors
 */
export class UseCaseError extends AppError {
  constructor(message: string, code: string = 'USE_CASE_ERROR', context?: Record<string, unknown>, cause?: Error) {
    super(message, code, context, cause);
  }
}

export class AIError extends UseCaseError {
  constructor(message: string, cause?: Error) {
    super(message, 'AI_ERROR', undefined, cause);
  }
}

export class ParseError extends UseCaseError {
  constructor(message: string, cause?: Error) {
    super(message, 'PARSE_ERROR', undefined, cause);
  }
}

/**
 * Input validation errors
 */
export class ValidationError extends AppError {
  constructor(message: string, code: string = 'VALIDATION_ERROR', context?: Record<string, unknown>, cause?: Error) {
    super(message, code, context, cause);
  }
}
