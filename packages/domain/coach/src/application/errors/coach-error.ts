import { ApplicationError } from '@bene/shared-domain';

export class CoachError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.name = 'CoachError';
  }
}
