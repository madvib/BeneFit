import { describe, it, expect } from 'vitest';
import { Password } from './password.js';

describe('Password', () => {
  it('should create a valid password', () => {
    const validPassword = 'Test1234!';
    const result = Password.create(validPassword);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.value).toBe(validPassword);
    }
  });

  it('should fail when password is empty', () => {
    const result = Password.create('');
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toContain('cannot be empty');
    }
  });

  it('should fail when password is null', () => {
    const result = Password.create(null as any);
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toContain('required');
    }
  });

  it('should fail when password is not a string', () => {
    const result = Password.create(123 as any);
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toContain('must be a string');
    }
  });

  it('should fail when password is less than 8 characters', () => {
    const result = Password.create('Abc123!');
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toContain('at least 8 characters');
    }
  });

  it('should fail when password does not contain uppercase letter', () => {
    const result = Password.create('test1234!');
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toContain('uppercase letter');
    }
  });

  it('should fail when password does not contain lowercase letter', () => {
    const result = Password.create('TEST1234!');
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toContain('lowercase letter');
    }
  });

  it('should fail when password does not contain number', () => {
    const result = Password.create('TestTest!');
    expect(result.isFailure).toBe(true);
    if (result.isFailure) {
      expect(result.errorMessage).toContain('number');
    }
  });

  it('should properly get the value', () => {
    const validPassword = 'ValidPass1!';
    const result = Password.create(validPassword);

    expect(result.isSuccess).toBe(true);
    if (result.isSuccess) {
      expect(result.value.value).toBe(validPassword);
    }
  });

  it('should compare passwords correctly', () => {
    const password1 = Password.create('ValidPass1!');
    const password2 = Password.create('ValidPass1!');
    const password3 = Password.create('AnotherPass1!');

    if (password1.isSuccess && password2.isSuccess && password3.isSuccess) {
      expect(password1.value.equals(password2.value)).toBe(true);
      expect(password1.value.equals(password3.value)).toBe(false);
    }
  });
});