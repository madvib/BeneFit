import { describe, it, expect } from 'vitest';
import { isValidEmail } from './email';

describe('email validation', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
      expect(isValidEmail('user123@test-domain.com')).toBe(true);
      expect(isValidEmail('a@b.co')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('user@domain.')).toBe(false);
      expect(isValidEmail('user@.com')).toBe(false);
      expect(isValidEmail('user name@domain.com')).toBe(false);
      expect(isValidEmail('user@domain.c')).toBe(false); // Top level domain too short
    });

    it('should return false for emails with special characters that are not allowed', () => {
      expect(isValidEmail('user name@domain.com')).toBe(false); // Space in email
    });
  });
});