// Define custom error types for authentication in the application layer
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// Define specific error types for authentication
export class InvalidCredentialsError extends AuthError {
  constructor() {
    super('Invalid email or password');
    this.name = 'InvalidCredentialsError';
  }
}

export class UserNotFoundError extends AuthError {
  constructor() {
    super('User not found. Please check your email or try signing up.');
    this.name = 'UserNotFoundError';
  }
}

export class UserNotConfirmedError extends AuthError {
  constructor() {
    super('Please confirm your email before logging in.');
    this.name = 'UserNotConfirmedError';
  }
}

export class WeakPasswordError extends AuthError {
  constructor() {
    super('Password is too weak. Please use at least 6 characters.');
    this.name = 'WeakPasswordError';
  }
}

export class EmailExistsError extends AuthError {
  constructor() {
    super('An account with this email already exists. Try logging in instead.');
    this.name = 'EmailExistsError';
  }
}

export class NetworkError extends AuthError {
  constructor() {
    super('Network error. Please check your connection and try again.');
    this.name = 'NetworkError';
  }
}

export class EmailNotConfirmedError extends AuthError {
  constructor() {
    super(
      'Your email has not been confirmed. Please check your email for a confirmation link.',
    );
    this.name = 'EmailNotConfirmedError';
  }
}

export class SessionExpiredError extends AuthError {
  constructor() {
    super('Your session has expired. Please log in again.');
    this.name = 'SessionExpiredError';
  }
}
