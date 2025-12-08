// Common errors for Coach module
export class CoachError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CoachError';
  }
}

export class CommunicationError extends CoachError {
  constructor(message: string) {
    super(message);
    this.name = 'CommunicationError';
  }
}

export class AnalysisError extends CoachError {
  constructor(message: string) {
    super(message);
    this.name = 'AnalysisError';
  }
}

export class ValidationError extends CoachError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ContextUpdateError extends CoachError {
  constructor(message: string) {
    super(message);
    this.name = 'ContextUpdateError';
  }
}

export class MessageProcessingError extends CoachError {
  constructor(message: string) {
    super(message);
    this.name = 'MessageProcessingError';
  }
}

export class CheckInError extends CoachError {
  constructor(message: string) {
    super(message);
    this.name = 'CheckInError';
  }
}
