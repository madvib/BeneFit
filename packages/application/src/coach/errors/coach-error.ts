import { ApplicationError } from '../../shared/application-error.js';

export class CoachError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.name = 'CoachError';
  }
}