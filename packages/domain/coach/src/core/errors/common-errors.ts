// Common errors for Coach module
export class CoachingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CoachingError';
  }
}

export class CommunicationError extends CoachingError {
  constructor(message: string) {
    super(message);
    this.name = 'CommunicationError';
  }
}

export class AnalysisError extends CoachingError {
  constructor(message: string) {
    super(message);
    this.name = 'AnalysisError';
  }
}

export class ValidationError extends CoachingError {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class ContextUpdateError extends CoachingError {
  constructor(message: string) {
    super(message);
    this.name = 'ContextUpdateError';
  }
}

export class MessageProcessingError extends CoachingError {
  constructor(message: string) {
    super(message);
    this.name = 'MessageProcessingError';
  }
}

export class CheckInError extends CoachingError {
  constructor(message: string) {
    super(message);
    this.name = 'CheckInError';
  }
}
