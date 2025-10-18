// Define custom error types for authentication
export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// Define specific error types based on Supabase error codes
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

export class TooManyAttemptsError extends AuthError {
  constructor() {
    super('Too many failed login attempts. Please try again later.');
    this.name = 'TooManyAttemptsError';
  }
}