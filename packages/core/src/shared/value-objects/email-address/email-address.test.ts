import { describe, it, expect } from 'vitest';
import { EmailAddress } from './email-address.js';

describe('EmailAddress', () => {
  it('should create a valid email address', () => {
    const validEmail = 'test@example.com';
    const result = EmailAddress.create(validEmail);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.value).toBe(validEmail);
    }
  });

  it('should fail when email is empty', () => {
    const result = EmailAddress.create('');
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain('cannot be empty');
    }
  });

  it('should fail when email is null', () => {
    const result = EmailAddress.create(null as any);
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain('required');
    }
  });

  it('should fail when email is not a string', () => {
    const result = EmailAddress.create(123 as any);
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain('must be a string');
    }
  });

  it('should fail when email is invalid (no @)', () => {
    const result = EmailAddress.create('invalid-email');
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain('Invalid Email Address');
    }
  });

  it('should fail when email is invalid (no domain)', () => {
    const result = EmailAddress.create('test@');
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain('Invalid Email Address');
    }
  });

  it('should fail when email is invalid (no TLD)', () => {
    const result = EmailAddress.create('test@example');
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.error.message).toContain('Invalid Email Address');
    }
  });

  it('should properly get the value', () => {
    const validEmail = 'valid@example.com';
    const result = EmailAddress.create(validEmail);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.value).toBe(validEmail);
    }
  });

  it('should trim whitespace from email', () => {
    const emailWithSpaces = '  test@example.com  ';
    const expectedEmail = 'test@example.com';
    const result = EmailAddress.create(emailWithSpaces);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.value).toBe(expectedEmail);
    }
  });
});