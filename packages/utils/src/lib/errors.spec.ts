import { describe, it, expect } from 'vitest';
import { 
  AuthError,
  InvalidCredentialsError,
  UserNotFoundError,
  UserNotConfirmedError,
  TooManyAttemptsError,
  WeakPasswordError,
  EmailExistsError,
  NetworkError,
  RateLimitError,
  EmailNotConfirmedError,
  SessionExpiredError
} from './errors';

describe('errors', () => {
  describe('AuthError', () => {
    it('should create AuthError with correct name and message', () => {
      const error = new AuthError('Test message');
      expect(error).toBeInstanceOf(AuthError);
      expect(error.name).toBe('AuthError');
      expect(error.message).toBe('Test message');
    });
  });

  describe('InvalidCredentialsError', () => {
    it('should create InvalidCredentialsError with correct name and default message', () => {
      const error = new InvalidCredentialsError();
      expect(error).toBeInstanceOf(AuthError);
      expect(error).toBeInstanceOf(InvalidCredentialsError);
      expect(error.name).toBe('InvalidCredentialsError');
      expect(error.message).toBe('Invalid email or password');
    });
  });

  describe('UserNotFoundError', () => {
    it('should create UserNotFoundError with correct name and default message', () => {
      const error = new UserNotFoundError();
      expect(error).toBeInstanceOf(AuthError);
      expect(error).toBeInstanceOf(UserNotFoundError);
      expect(error.name).toBe('UserNotFoundError');
      expect(error.message).toBe('User not found. Please check your email or try signing up.');
    });
  });

  describe('UserNotConfirmedError', () => {
    it('should create UserNotConfirmedError with correct name and default message', () => {
      const error = new UserNotConfirmedError();
      expect(error).toBeInstanceOf(AuthError);
      expect(error).toBeInstanceOf(UserNotConfirmedError);
      expect(error.name).toBe('UserNotConfirmedError');
      expect(error.message).toBe('Please confirm your email before logging in.');
    });
  });

  describe('TooManyAttemptsError', () => {
    it('should create TooManyAttemptsError with correct name and default message', () => {
      const error = new TooManyAttemptsError();
      expect(error).toBeInstanceOf(AuthError);
      expect(error).toBeInstanceOf(TooManyAttemptsError);
      expect(error.name).toBe('TooManyAttemptsError');
      expect(error.message).toBe('Too many failed login attempts. Please try again later.');
    });
  });

  describe('WeakPasswordError', () => {
    it('should create WeakPasswordError with correct name and default message', () => {
      const error = new WeakPasswordError();
      expect(error).toBeInstanceOf(AuthError);
      expect(error).toBeInstanceOf(WeakPasswordError);
      expect(error.name).toBe('WeakPasswordError');
      expect(error.message).toBe('Password is too weak. Please use at least 6 characters.');
    });
  });

  describe('EmailExistsError', () => {
    it('should create EmailExistsError with correct name and default message', () => {
      const error = new EmailExistsError();
      expect(error).toBeInstanceOf(AuthError);
      expect(error).toBeInstanceOf(EmailExistsError);
      expect(error.name).toBe('EmailExistsError');
      expect(error.message).toBe('An account with this email already exists. Try logging in instead.');
    });
  });

  describe('NetworkError', () => {
    it('should create NetworkError with correct name and default message', () => {
      const error = new NetworkError();
      expect(error).toBeInstanceOf(AuthError);
      expect(error).toBeInstanceOf(NetworkError);
      expect(error.name).toBe('NetworkError');
      expect(error.message).toBe('Network error. Please check your connection and try again.');
    });
  });

  describe('RateLimitError', () => {
    it('should create RateLimitError with correct name and default message', () => {
      const error = new RateLimitError();
      expect(error).toBeInstanceOf(AuthError);
      expect(error).toBeInstanceOf(RateLimitError);
      expect(error.name).toBe('RateLimitError');
      expect(error.message).toBe('Too many requests. Please try again later.');
    });
  });

  describe('EmailNotConfirmedError', () => {
    it('should create EmailNotConfirmedError with correct name and default message', () => {
      const error = new EmailNotConfirmedError();
      expect(error).toBeInstanceOf(AuthError);
      expect(error).toBeInstanceOf(EmailNotConfirmedError);
      expect(error.name).toBe('EmailNotConfirmedError');
      expect(error.message).toBe('Your email has not been confirmed. Please check your email for a confirmation link.');
    });
  });

  describe('SessionExpiredError', () => {
    it('should create SessionExpiredError with correct name and default message', () => {
      const error = new SessionExpiredError();
      expect(error).toBeInstanceOf(AuthError);
      expect(error).toBeInstanceOf(SessionExpiredError);
      expect(error.name).toBe('SessionExpiredError');
      expect(error.message).toBe('Your session has expired. Please log in again.');
    });
  });
});