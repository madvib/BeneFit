import { DomainError } from './index.js';

/**
 * Error thrown when training constraints validation fails
 */
export class ConstraintsValidationError extends DomainError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'CONSTRAINTS_VALIDATION_ERROR', context);
  }
}
