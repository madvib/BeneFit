import { ApplicationError } from '@bene/domain-shared';

export class CoachError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.name = 'CoachError';
  }
}
