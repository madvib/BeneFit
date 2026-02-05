import { DomainError } from '@bene/shared';

export class ConstraintsValidationError extends DomainError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, 'CONSTRAINTS_VALIDATION_ERROR', context);
  }
}
