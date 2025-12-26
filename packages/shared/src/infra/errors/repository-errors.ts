/**
 * Base error class for all repository errors
 */
export abstract class RepositoryError extends Error {
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

/**
 * Thrown when an entity is not found in the repository
 */
export class EntityNotFoundError extends RepositoryError {
  constructor(entityName: string, identifier: string, cause?: Error) {
    super(
      `${entityName} with identifier '${identifier}' not found`,
      'ENTITY_NOT_FOUND',
      cause,
    );
  }
}

/**
 * Thrown when a repository query operation fails
 */
export class QueryError extends RepositoryError {
  constructor(operation: string, entityName: string, cause?: Error) {
    super(
      `Failed to ${operation} ${entityName}: ${cause?.message || 'Unknown error'}`,
      'QUERY_ERROR',
      cause,
    );
  }
}

/**
 * Thrown when a repository save/update operation fails
 */
export class SaveError extends RepositoryError {
  constructor(entityName: string, identifier?: string, cause?: Error) {
    const id = identifier ? ` with id '${identifier}'` : '';
    super(
      `Failed to save ${entityName}${id}: ${cause?.message || 'Unknown error'}`,
      'SAVE_ERROR',
      cause,
    );
  }
}

/**
 * Thrown when a repository delete operation fails
 */
export class DeleteError extends RepositoryError {
  constructor(entityName: string, identifier: string, cause?: Error) {
    super(
      `Failed to delete ${entityName} with id '${identifier}': ${cause?.message || 'Unknown error'}`,
      'DELETE_ERROR',
      cause,
    );
  }
}

/**
 * Thrown when a database connection or client error occurs
 */
export class DatabaseError extends RepositoryError {
  constructor(operation: string, cause?: Error) {
    super(
      `Database error during ${operation}: ${cause?.message || 'Unknown error'}`,
      'DATABASE_ERROR',
      cause,
    );
  }
}

/**
 * Thrown when data validation fails before persistence
 */
export class ValidationError extends RepositoryError {
  constructor(entityName: string, validationErrors: string[], cause?: Error) {
    super(
      `Validation failed for ${entityName}: ${validationErrors.join(', ')}`,
      'VALIDATION_ERROR',
      cause,
    );
  }
}
